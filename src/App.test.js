import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

// Mock MonacoEditor to avoid complex setups in unit tests
jest.mock('@monaco-editor/react', () => ({ value, onChange }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    data-testid="monaco-editor"
  />
));

describe('Mustache Template Validator', () => {
  test('renders the main components', () => {
    render(<App />);

    // Check if editor, attribute input, prefix input, and button are present
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter valid attributes here, separated by commas or new lines...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter prefix...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /validate/i })).toBeInTheDocument();
  });

  test('validates a template successfully with correct attributes and prefix', () => {
    render(<App />);

    // Mock user input
    const templateInput = screen.getByTestId('monaco-editor');
    const attributeInput = screen.getByPlaceholderText('Enter valid attributes here, separated by commas or new lines...');
    const prefixInput = screen.getByPlaceholderText('Enter prefix...');
    const validateButton = screen.getByRole('button', { name: /validate/i });

    fireEvent.change(templateInput, { target: { value: '{{user.UserAttribute.Name}}' } });
    fireEvent.change(attributeInput, { target: { value: 'Name, Age, Email' } });
    fireEvent.change(prefixInput, { target: { value: 'user.UserAttribute.' } });

    // Validate the template
    fireEvent.click(validateButton);

    // Check for success message
    expect(screen.getByText('The template is valid!')).toBeInTheDocument();
  });

  test('shows error for unmatched attributes', () => {
    render(<App />);

    // Mock user input
    const templateInput = screen.getByTestId('monaco-editor');
    const attributeInput = screen.getByPlaceholderText('Enter valid attributes here, separated by commas or new lines...');
    const prefixInput = screen.getByPlaceholderText('Enter prefix...');
    const validateButton = screen.getByRole('button', { name: /validate/i });

    fireEvent.change(templateInput, { target: { value: '{{user.UserAttribute.Name}}' } });
    fireEvent.change(attributeInput, { target: { value: 'Age, Email' } }); // 'Name' is missing
    fireEvent.change(prefixInput, { target: { value: 'user.UserAttribute.' } });

    // Validate the template
    fireEvent.click(validateButton);

    // Check for error message
    expect(screen.getByText('Invalid Template!')).toBeInTheDocument();
    expect(screen.getByText('Unmatched Attributes: user.UserAttribute.Name')).toBeInTheDocument();
  });

  test('handles empty attribute input gracefully', () => {
    render(<App />);

    // Mock user input
    const templateInput = screen.getByTestId('monaco-editor');
    const validateButton = screen.getByRole('button', { name: /validate/i });

    fireEvent.change(templateInput, { target: { value: '{{user.UserAttribute.Name}}' } });
    fireEvent.click(validateButton);

    // Check for error message due to empty attribute list
    expect(screen.getByText('Invalid Template!')).toBeInTheDocument();
    expect(screen.getByText('Unmatched Attributes: user.UserAttribute.Name')).toBeInTheDocument();
  });

  test('handles empty template input gracefully', () => {
    render(<App />);

    // Mock user input
    const attributeInput = screen.getByPlaceholderText('Enter valid attributes here, separated by commas or new lines...');
    const prefixInput = screen.getByPlaceholderText('Enter prefix...');
    const validateButton = screen.getByRole('button', { name: /validate/i });

    fireEvent.change(attributeInput, { target: { value: 'Name, Age, Email' } });
    fireEvent.change(prefixInput, { target: { value: 'user.UserAttribute.' } });

    // Validate without a template
    fireEvent.click(validateButton);

    // Check for success as there is nothing to validate against
    expect(screen.queryByText('Invalid Template!')).not.toBeInTheDocument();
    expect(screen.queryByText('The template is valid!')).toBeInTheDocument();
  });
});
