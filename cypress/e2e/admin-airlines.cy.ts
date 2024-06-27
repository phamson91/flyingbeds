// MUST HAVE USER WITH ROLE ADMIN BEFORE RUN THIS TEST ('longdo@dobtech.vn', '123456')
// MUST DELETE ALL AIRLINES BEFORE RUN THIS TEST (Table Airlines)
// MUST CONFIRM AIRLINE with code = 'TEST_AIR' & code = 'TEST_AIR_UPDATED' not exist in table Airlines before run this test

describe('Admin Airlines spec', () => {
	const codeAirline = 'TEST_AIR';
	const codeAirlineUpdated = 'TEST_AIR_UPDATED';
	const nameAirline = 'Test Airline';
	const nameAirlineUpdated = 'Test Airline Updated';
	const notes = 'Test Notes';
	const notesUpdated = 'Test Notes Updated';

	beforeEach(() => {
		cy.login('longdo@dobtech.vn', '123456');
		cy.findByTestId('btnAdmin').should('be.visible').click();
		cy.findByText('Manage Airlines').should('be.visible').click();
		cy.wait(1000);
	});

	it('should show new airline when successfully created airline', () => {
		cy.findByTestId('btnAddAirline').should('exist').click();
		cy.findByTestId('codeAirlineInput').should('exist').type(codeAirline);
		cy.findByTestId('nameAirlineInput').should('exist').type(nameAirline);
		cy.findByTestId('notesInput').should('exist').type(notes);
		cy.findByTestId('submit').should('exist').click();
		cy.wait(3000);
		cy.findByText(codeAirline).should('be.visible');
	});

	it('should have correct data from previous test and successfully update airline data with valid inputs', () => {
		cy.contains('td', codeAirline)
			.parent()
			.findByTestId('editAirline')
			.should('exist')
			.click();
		cy.findByTestId('codeAirlineInput')
			.should('exist')
			.should('have.value', codeAirline)
			.clear()
			.type(codeAirlineUpdated);
		cy.findByTestId('nameAirlineInput')
			.should('exist')
			.should('have.value', nameAirline)
			.clear()
			.type(nameAirlineUpdated);
		cy.findByTestId('notesInput')
			.should('exist')
			.should('have.value', notes)
			.clear()
			.type(notesUpdated);
		cy.findByTestId('submit').should('exist').click();
		cy.wait(3000);
		cy.findByText(codeAirlineUpdated).should('be.visible');
	});

	it('should have correct data from previous test and successfully delete airline', () => {
		cy.contains('td', codeAirlineUpdated)
			.parent()
			.findByTestId('deleteAirline')
			.should('exist')
			.click();
		cy.findByTestId('confirmDelete').should('exist').click();
		cy.wait(3000);
		cy.findByText(codeAirlineUpdated).should('not.exist');
	});
});
