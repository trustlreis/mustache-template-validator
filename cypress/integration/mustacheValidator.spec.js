describe('Mustache Template Validator E2E Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Ensure this is the correct URL for your app
    });
  
    it('renders the main components', () => {
      cy.get('textarea[data-testid="monaco-editor"]').should('exist');
      cy.get('textarea[placeholder="Enter valid attributes here, separated by commas or new lines..."]').should('exist');
      cy.get('input[placeholder="Enter prefix..."]').should('exist');
      cy.get('button').contains('Validate').should('exist');
    });
  
    it('validates a template successfully with correct attributes and prefix', () => {
      cy.get('textarea[data-testid="monaco-editor"]').type('{{user.UserAttribute.Name}}');
      cy.get('textarea[placeholder="Enter valid attributes here, separated by commas or new lines..."]').type('Name, Age, Email');
      cy.get('input[placeholder="Enter prefix..."]').type('user.UserAttribute.');
  
      cy.get('button').contains('Validate').click();
  
      cy.contains('The template is valid!').should('be.visible');
    });
  
    it('shows error for unmatched attributes', () => {
      cy.get('textarea[data-testid="monaco-editor"]').type('{{user.UserAttribute.Name}}');
      cy.get('textarea[placeholder="Enter valid attributes here, separated by commas or new lines..."]').type('Age, Email');
      cy.get('input[placeholder="Enter prefix..."]').type('user.UserAttribute.');
  
      cy.get('button').contains('Validate').click();
  
      cy.contains('Invalid Template!').should('be.visible');
      cy.contains('Unmatched Attributes: user.UserAttribute.Name').should('be.visible');
    });
  
    it('handles empty attribute input gracefully', () => {
      cy.get('textarea[data-testid="monaco-editor"]').type('{{user.UserAttribute.Name}}');
      
      cy.get('button').contains('Validate').click();
  
      cy.contains('Invalid Template!').should('be.visible');
      cy.contains('Unmatched Attributes: user.UserAttribute.Name').should('be.visible');
    });
  
    it('handles empty template input gracefully', () => {
      cy.get('textarea[placeholder="Enter valid attributes here, separated by commas or new lines..."]').type('Name, Age, Email');
      cy.get('input[placeholder="Enter prefix..."]').type('user.UserAttribute.');
  
      cy.get('button').contains('Validate').click();
  
      cy.contains('The template is valid!').should('be.visible');
    });
  });
  