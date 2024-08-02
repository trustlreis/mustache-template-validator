/// <reference types="cypress" />

describe('Mustache Template Validator', () => {
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('/'); // Base URL is set in cypress.config.js
  });

  it('renders the component correctly', () => {
    cy.contains('Mustache Template Validator').should('be.visible');
    cy.get('input[placeholder="Enter prefix..."]').should('be.visible');
    cy.get('textarea[placeholder="Enter valid attributes here, separated by commas or new lines..."]').should('be.visible');
    cy.get('button').contains('Validate').should('be.visible');
  });

  it('validates correct template syntax', () => {
    // Enter the prefix and attributes
    cy.get('input[placeholder="Enter prefix..."]').type('user.');
    cy.get('textarea[placeholder="Enter valid attributes here, separated by commas or new lines..."]').type('Name, Email');
    
    // Enter a valid Mustache template in the editor
    cy.get('[data-testid="monaco-editor"]').type('My name is {{user.Name}} and my email is {{user.Email}}');

    // Click the Validate button
    cy.get('button').contains('Validate').click();

    // Check if the validation result is displayed as valid
    cy.contains('The template is valid!').should('be.visible');
  });

  it('detects incorrect template syntax', () => {
    // Enter the prefix and attributes
    cy.get('input[placeholder="Enter prefix..."]').type('user.');
    cy.get('textarea[placeholder="Enter valid attributes here, separated by commas or new lines..."]').type('Name, Email');
    
    // Enter an incorrect Mustache template (missing closing brace)
    cy.get('[data-testid="monaco-editor"]').type('My name is {{user.Name}} and my email is {{user.Email}');

    // Click the Validate button
    cy.get('button').contains('Validate').click();

    // Check if the validation result is displayed as invalid
    cy.contains('Invalid Template! Unmatched Attributes: user.Email').should('be.visible');
  });

  it('displays the modal with correct messages', () => {
    // Initial incorrect input to show error
    cy.get('input[placeholder="Enter prefix..."]').type('user.');
    cy.get('textarea[placeholder="Enter valid attributes here, separated by commas or new lines..."]').type('Name');
    cy.get('[data-testid="monaco-editor"]').type('My name is {{user.Name}} and my email is {{user.Email}}');
    cy.get('button').contains('Validate').click();

    // Check if the modal displays the error message
    cy.get('div[role="dialog"]').should('be.visible');
    cy.contains('Validation Error').should('be.visible');
    cy.contains('Invalid Template! Unmatched Attributes: user.Email').should('be.visible');

    // Correct the input to show success
    cy.get('textarea[placeholder="Enter valid attributes here, separated by commas or new lines..."]').clear().type('Name, Email');
    cy.get('button').contains('Validate').click();

    // Check if the modal displays the success message
    cy.get('div[role="dialog"]').should('be.visible');
    cy.contains('Validation Success').should('be.visible');
    cy.contains('The template is valid!').should('be.visible');

    // Close the modal
    cy.get('button').contains('Close').click();
    cy.get('div[role="dialog"]').should('not.exist');
  });
});
