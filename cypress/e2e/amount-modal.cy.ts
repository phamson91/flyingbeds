// MUST HAVE USER WITH ROLE ADMIN BEFORE RUN THIS TEST ('longdo@dobtech.vn', '123456')

declare namespace Cypress {
	interface Chainable<Subject = any> {
		openModalTopUp(): Chainable<any>;
		openModalReduce(): Chainable<any>;
	}
}
//Open modal top up
Cypress.Commands.add('openModalTopUp', () => {
	cy.findByTestId('btnAdmin').click();
	cy.findByText('Manage Agents').click();
	cy.get('tbody tr').should('exist');
	cy.contains('td', 'Test Co., Ltd').parent().findByTestId('topUp').click();
	cy.findByTestId('titleModal').should('exist');
});

//Open modal top up
Cypress.Commands.add('openModalReduce', () => {
	cy.findByTestId('btnAdmin').click();
	cy.findByText('Manage Agents').click();
	cy.get('tbody tr').should('exist');
	cy.contains('td', 'Test Co., Ltd')
		.parent()
		.findByTestId('reduceAmount')
		.click();
	cy.findByTestId('titleModal').should('exist');
});

//Test e2e Amount Modal
describe('Amount Modal', () => {
	beforeEach(() => {
		cy.login('longdo@dobtech.vn', '123456');
	});

	it('Should show button Admin when login with role Admin', () => {
		cy.findByTestId('btnAdmin').should('be.visible');
	});

	describe('Should show error when enter value input at screen top up and reduce', () => {
		it('Should show error when screen top up', () => {
			cy.openModalTopUp();
			cy.findByTestId('amountInput').clear();
			cy.findByTestId('submit').click();
			cy.findByTestId('amountInput-error').should('be.visible');
		});
		it('Should show error when screen reduce', () => {
			cy.openModalReduce();
			cy.findByTestId('amountInput').clear();
			cy.findByTestId('submit').click();
			cy.findByTestId('amountInput-error').should('be.visible');
		});
	});

	describe('Should show success when enter valid value input at screen top up and reduce', () => {
		it('Should show success when screen top up', () => {
			cy.openModalTopUp();
			cy.findByTestId('amountInput').clear().type('1000');
			cy.findByTestId('submit').click();
			cy.findByTestId('amountInput-error').should('not.exist');
		});
		it('Should show success when screen reduce', () => {
			cy.openModalTopUp();
			cy.findByTestId('amountInput').clear().type('1000');
			cy.findByTestId('submit').click();
			cy.findByTestId('amountInput-error').should('not.exist');
		});
	});
});
