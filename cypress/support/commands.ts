/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import { TEST_EMAIL, TEST_PASSWORD } from '../../utils/constant';
import '@testing-library/cypress/add-commands';

//Login
Cypress.Commands.add(
	'login',
	(
		email = Cypress.env('test_email'),
		password = Cypress.env('test_password')
	) => {
		cy.visit('/auth');

		cy.findByPlaceholderText('Enter email').type(email);
		cy.findByPlaceholderText('Enter password').type(password);

		cy.findByText('Submit').click();

		cy.url().should('include', '/dashboard');
	}
);

//Logout
Cypress.Commands.add('logout', () => {
	cy.findByTestId('logout').click();

	cy.findByText('Submit').click();

	cy.url().should('include', '/auth');
});

//Open modal edit user
Cypress.Commands.add('openModalEditUser', () => {
	cy.get('#dropdown-email').click();
	cy.get('#dropdown-item-setting').click();
	cy.findByText('Edit User').should('exist');
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
	namespace Cypress {
		interface Chainable {
			login(email?: string, password?: string): Chainable<void>;
			logout(): Chainable<void>;
			openModalEditUser: () => Chainable<void>;
			//   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
			//   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
			//   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
		}
	}
}

export {};
