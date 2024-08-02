import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

// Mocking Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange }) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', height: '200px' }} // Optional styling to mimic editor size
    />
  ),
}));

describe('Mustache Template Validator', () => {
  test('renders the component correctly', () => {
    render(<App />);
    expect(screen.getByText(/Mustache Template Validator/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter prefix.../i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter valid attributes here, separated by commas or new lines.../i)).toBeInTheDocument();
    expect(screen.getByText(/Validate/i)).toBeInTheDocument();
  });

  test('handles input and validates correct template syntax', async () => {
    render(<App />);

    // Mock input for prefix and attributes
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Enter prefix.../i), {
        target: { value: 'user.' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter valid attributes here/i), {
        target: { value: 'Name, Email' },
      });

      // Mock input for the MonacoEditor
      fireEvent.change(screen.getByTestId('monaco-editor'), {
        target: { value: 'My name is {{user.Name}} and my email is {{user.Email}}' },
      });

      fireEvent.click(screen.getByText(/Validate/i));
    });

    await waitFor(() => {
      expect(screen.getByText(/The template is valid!/i)).toBeInTheDocument();
    });
  });

  test('detects incorrect template syntax', async () => {
    render(<App />);

    // Mock input for prefix and attributes
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Enter prefix.../i), {
        target: { value: 'user.' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter valid attributes here/i), {
        target: { value: 'Name, Email' },
      });

      // Incorrect template (missing one closing brace)
      fireEvent.change(screen.getByTestId('monaco-editor'), {
        target: { value: 'My name is {{user.Name}} and my email is {{user.Email}' }, // Missing closing brace
      });

      fireEvent.click(screen.getByText(/Validate/i));
    });

    await waitFor(() => {
      expect(screen.getByText(/Invalid/i)).toBeInTheDocument();
    });
  });

  test('shows modal with correct content when validation state changes', async () => {
    render(<App />);

    // Initial incorrect input for testing modal visibility
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Enter prefix.../i), {
        target: { value: 'user.' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter valid attributes here/i), {
        target: { value: 'Name' },
      });

      fireEvent.change(screen.getByTestId('monaco-editor'), {
        target: { value: 'My name is {{user.Name}} and my email is {{user.Email}}' },
      });

      fireEvent.click(screen.getByText(/Validate/i));
    });

    // Check if the modal displays the error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid/i)).toBeInTheDocument();
    });

    // Correct input to change validation state and show success message
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Enter valid attributes here/i), {
        target: { value: 'Name, Email' },
      });

      fireEvent.click(screen.getByText(/Validate/i));
    });

    // Check if the modal displays the success message
    await waitFor(() => {
      expect(screen.getByText(/Success/i)).toBeInTheDocument();
    });

    // Close the modal
    fireEvent.click(screen.getByText(/Ok/i));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
