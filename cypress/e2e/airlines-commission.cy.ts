// MUST HAVE USER WITH ROLE ADMIN BEFORE RUN THIS TEST ('longdo@dobtech.vn', '123456')
// MUST CONFIRM AIRLINE with code = 'TEST_AIR' not exist in table Airlines before run this test

describe('Commission spec', () => {
	const codeAirline = 'TEST_AIR';
	const nameAirline = 'Test Airline';
	const notes = 'Test Notes';
	const descriptionCom = 'Test Description';
	const classCom = 'Test Class';
	const commissions = '1';
	const feeCom = '1';
	const descriptionComUpdate = 'Test Description Update';
	const classComUpdate = 'Test Class Update';
	const commissionsUpdate = '2';
	const feeComUpdate = '2';
	const categoryFee = 'Test Category Fee';
	const categoryFeeUpdate = 'Test Category Fee Update';
	const descriptionFee = 'Test Description Fee';
	const descriptionFeeUpdate = 'Test Description Fee Update';
	const fee = '1';
	const feeUpdate = '2';

	before(() => {
		cy.login('longdo@dobtech.vn', '123456');
		cy.findByTestId('btnAdmin').should('be.visible').click();
		cy.findByText('Manage Airlines').should('be.visible').click();
		cy.findByTestId('btnAddAirline').should('exist').click();
		cy.findByTestId('codeAirlineInput').should('exist').type(codeAirline);
		cy.findByTestId('nameAirlineInput').should('exist').type(nameAirline);
		cy.findByTestId('notesInput').should('exist').type(notes);
		cy.findByTestId('submit').should('exist').click();
		cy.wait(3000);
		cy.findByText(codeAirline).should('be.visible');
	});

	beforeEach(() => {
		cy.login('longdo@dobtech.vn', '123456');
		cy.visit('/dashboard/commissions');
		cy.findByTestId('airlineSearch').should('exist').type(codeAirline);
		cy.findByText(nameAirline).should('be.visible').click();
		cy.wait(1000);
	});

	it('should show new commission when successfully created commission', () => {
		cy.findByTestId('btnAddCommission').should('exist').click();
		cy.findByTestId('description').should('exist').type(descriptionCom);
		cy.findByTestId('class').should('exist').type(classCom);
		cy.findByTestId('commission').should('exist').clear().type(commissions);
		cy.findByTestId('service_fee').should('exist').clear().type(feeCom);
		cy.findByTestId('submit').should('exist').click();
		cy.wait(3000);
		cy.findByText(descriptionCom).should('be.visible');
	});

	it('should have correct data from previous test and successfully update commission data with valid inputs', () => {
		cy.contains('td', descriptionCom)
			.parent()
			.findByTestId('btnEditCommission')
			.should('exist')
			.click();
		cy.findByTestId('description')
			.should('exist')
			.clear()
			.type(descriptionComUpdate);
		cy.findByTestId('class')
			.should('exist')
			.should('have.value', classCom)
			.clear()
			.type(classComUpdate);
		cy.findByTestId('commission')
			.should('exist')
			.should('have.value', commissions)
			.clear()
			.type(commissionsUpdate);
		cy.findByTestId('service_fee')
			.should('exist')
			.should('have.value', feeCom)
			.clear()
			.type(feeComUpdate);
		cy.findByTestId('submit').should('exist').click();
		cy.wait(3000);
		cy.findByText(descriptionComUpdate).should('be.visible');
	});

	it('should have correct data from previous test and successfully delete commission data', () => {
		cy.contains('td', descriptionComUpdate)
			.parent()
			.findByTestId('btnDeleteCommission')
			.should('exist')
			.click();
		cy.findByTestId('confirmDelete').should('exist').click();
		cy.wait(3000);
		cy.findByText(descriptionComUpdate).should('not.exist');
	});

	it('should show new fee when successfully created fee', () => {
		cy.findByTestId('btnAddFee').should('exist').click();
		cy.findByTestId('category').should('exist').type(categoryFee);
		cy.findByTestId('description').should('exist').type(descriptionFee);
		cy.findByTestId('service_fee').should('exist').clear().type(fee);
		cy.findByTestId('submit').should('exist').click();
		cy.wait(3000);
		cy.findByText(categoryFee).should('be.visible');
	});

	it('should have correct data from previous test and successfully update category fee data with valid inputs', () => {
		cy.contains('td', categoryFee)
			.parent()
			.findByTestId('btnEditFee')
			.should('exist')
			.click();
		cy.findByTestId('category')
			.should('exist')
			.should('have.value', categoryFee)
			.clear()
			.type(categoryFeeUpdate);
		cy.findByTestId('description')
			.should('exist')
			.clear()
			.type(descriptionFeeUpdate);
		cy.findByTestId('service_fee')
			.should('exist')
			.should('have.value', fee)
			.clear()
			.type(feeUpdate);
		cy.findByTestId('submit').should('exist').click();
		cy.wait(3000);
		cy.findByText(categoryFeeUpdate).should('be.visible');
	});

	it('should have correct data from previous test and successfully delete fee data', () => {
		cy.contains('td', categoryFeeUpdate)
			.parent()
			.findByTestId('btnDeleteFee')
			.should('exist')
			.click();
		cy.findByTestId('confirmDelete').should('exist').click();
		cy.wait(3000);
		cy.findByText(categoryFeeUpdate).should('not.exist');
	});

	after(() => {
		cy.findByTestId('btnAdmin').should('be.visible').click();
		cy.findByText('Manage Airlines').should('be.visible').click();
		cy.contains('td', codeAirline)
			.parent()
			.findByTestId('deleteAirline')
			.should('exist')
			.click();
		cy.findByTestId('confirmDelete').should('exist').click();
		cy.wait(3000);
		cy.findByText(codeAirline).should('not.exist');
	});
});
