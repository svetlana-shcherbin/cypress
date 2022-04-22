const { faker } = require('@faker-js/faker');
const firstName=faker.name.firstName();
const lastName=faker.name.lastName();
const adress =faker.address.city();

const invalidData = () => {
  return Math.random()
    .toString(36)
    .substring(7);
};

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
  it.only('valid log out', () => {
    cy.login();
    cy.get('#react-burger-menu-btn').click();
    cy.get('[class="bm-item menu-item" ]')
      .eq(2)
    // .trigger('mouseover').should('have.css','color','#e2231a')
    cy.url().should('eq', 'https://www.saucedemo.com/');
  });
  it('invalid credentials', () => {
    cy.url().should('eq', 'https://www.saucedemo.com/');
    cy.get('#user-name').type(invalidData());
    cy.get('#password').type(invalidData());
    cy.get('#login-button').click();
    cy.get('[class="error-message-container error"]').contains(
      "Epic sadface: Username and password do not match any user in this service"
    );
    cy.get('[class="error-button"]').click();
    cy.get('input#user-name.input_error.form_input').should('have.css', 'border-bottom-color', 'rgb(237, 237, 239)');
    cy.get('div.form_group').not('[class="svg-inline--fa fa-times-circle fa-w-16 error_icon"]');
    cy.get('input#password.input_error.form_input').should('have.css', 'border-bottom-color', 'rgb(237, 237, 239)');
  });
  it('add items to cart', () => {
    cy.login();
    cy.get('[class="shopping_cart_link"]').not('[class="shopping_cart_badge"]');
    cy.get('[class="inventory_item"]').eq(1).within(($item)=>{
      cy.get('#add-to-cart-sauce-labs-bike-light').click()
    })
    cy.get('a.shopping_cart_link>span').contains('1')
    cy.get('a.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
    cy.get('div.cart_item>div.cart_quantity').contains('1');
    cy.get('#remove-sauce-labs-bike-light').click();
    cy.get('div.cart_list').not('div.cart_item');
  });
  it('add all items to cart', () => {
    cy.login();
    cy.get('div.inventory_list>div.inventory_item').each(($item) => {
        cy.wrap($item).within(($item)=>{cy.get('[class="btn btn_primary btn_small btn_inventory"]').click()});
      });
    cy.get('a.shopping_cart_link>span').contains('6');
    cy.get('a.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
    cy.get('div.cart_list>div.cart_item').each(($item) => {
      cy.wrap($item).within(($item)=>{cy.get('[class="btn btn_secondary btn_small cart_button"]').click()});
    });
    cy.get('div.cart_list').not('div.cart_item');
  });
  it('order checkout', () => {
    cy.login();
    cy.get('[class="shopping_cart_link"]').not('[class="shopping_cart_badge"]');
    cy.get('[class="inventory_item"]').eq(2).within(($item)=>{
      cy.get('#add-to-cart-sauce-labs-bolt-t-shirt').click()
    })
    cy.get('[class="inventory_item"]').eq(3).within(($item)=>{
      cy.get('#add-to-cart-sauce-labs-fleece-jacket').click()
    })
    cy.get('a.shopping_cart_link>span').contains('2')
    cy.get('a.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
    cy.get('div.cart_list>div.cart_item').should('have.length', 2)
    cy.get('#checkout').click();
    cy.url().should('include', '/checkout-step-one.html');
    cy.get('#first-name').type(firstName);
    cy.get('#last-name').type(lastName);
    cy.get('#postal-code').type(adress);
    cy.get('#continue').click();
    cy.url().should('include', '/checkout-step-two.html');
  });
});
