describe('Cypress_Plan', function () {
  beforeEach(() => {
    cy.visit('/');
  });
  it('valid login', () => {
    cy.url().should('eq', 'https://www.saucedemo.com/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory.html');
  });
  it('valid log out', () => {
    cy.url().should('eq', 'https://www.saucedemo.com/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory.html');
    cy.get('#react-burger-menu-btn').click();
    cy.get('[class="bm-item menu-item" ]').eq(2).click()
    // .trigger('mouseover').should('have.css','color','#e2231a')
    cy.url().should('eq', 'https://www.saucedemo.com/');
  });
  it('invalid credentials', () => {
    cy.url().should('eq', 'https://www.saucedemo.com/');
    cy.get('#user-name').type('test');
    cy.get('#password').type('test');
    cy.get('#login-button').click();  
  });
});
