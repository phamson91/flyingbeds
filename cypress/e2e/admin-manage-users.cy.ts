// MUST HAVE USER WITH ROLE ADMIN BEFORE RUN THIS TEST ('longdo@dobtech.vn', '123456')
// MUST CONFIRM email: testcreateuser@test.com & testcreateuserupdated@test.com not exists before run this test

describe('Admin Manage Users spec', () => {
	const companyName = 'Test Create User Ltd';
	const companyNameUpdated = 'Test Create User Ltd Updated';
	const email = 'testcreateuser@test.com';
	const emailUpdated = 'testcreateuserupdated@test.com';
	const phone = '0102030405';
	const phoneUpdated = '0102030406';
	const creditLimit = '88000000';
	const creditLimitUpdated = '99000000';
	const password = '123456';
	const passwordUpdated = '1234567';

	beforeEach(() => {
		cy.login('longdo@dobtech.vn', '123456');
		cy.findByTestId('btnAdmin').should('be.visible').click();
		cy.findByText('Manage Agents').should('be.visible').click();
	});

	it('should show new user when successfully created user', () => {
		cy.intercept('POST', '**/api/users').as('addUser');

		cy.findByTestId('btnAddAgent').should('exist').click();
		cy.findByTestId('emailInput').should('exist').type(email);
		cy.findByTestId('passwordInput').should('exist').type(password);
		cy.findByTestId('phoneInput').should('exist').type(phone);
		cy.findByTestId('creditLimitInput').should('exist').type(creditLimit);
		cy.findByTestId('companyNameInput').should('exist').type(companyName);
		cy.findByTestId('submitBtn').should('exist').click();
		cy.wait('@addUser').its('response.statusCode').should('eq', 201);
		cy.findByText(companyName).should('be.visible');
	});

	it('should have correct data from previous test and successfully update user data with valid inputs', () => {
		cy.intercept('POST', '**/api/users').as('updatedUser');

		cy.contains('td', companyName)
			.parent()
			.findByTestId('editUser')
			.should('exist')
			.click();
		cy.findByTestId('emailInput')
			.should('exist')
			.should('have.value', email)
			.clear()
			.type(emailUpdated);
		cy.findByTestId('phoneInput')
			.should('exist')
			.should('have.value', phone)
			.clear()
			.type(phoneUpdated);
		cy.findByTestId('creditLimitInput')
			.should('exist')
			.should('have.value', creditLimit)
			.clear()
			.type(creditLimitUpdated);
		cy.findByTestId('companyNameInput')
			.should('exist')
			.should('have.value', companyName)
			.clear()
			.type(companyNameUpdated);
		cy.findByTestId('submitBtn').should('exist').click();
		cy.wait('@updatedUser').its('response.statusCode').should('eq', 201);
		cy.findByText(companyNameUpdated).should('be.visible');
	});

	it('should have correct data from update test and successfully change password with valid input', () => {
		cy.intercept('POST', '**/api/users').as('updatedUser');

		cy.contains('td', companyNameUpdated)
			.parent()
			.findByTestId('editUser')
			.should('exist')
			.click();
		cy.findByTestId('emailInput')
			.should('exist')
			.should('have.value', emailUpdated);
		cy.findByTestId('phoneInput')
			.should('exist')
			.should('have.value', phoneUpdated);
		cy.findByTestId('creditLimitInput')
			.should('exist')
			.should('have.value', creditLimitUpdated);
		cy.findByTestId('companyNameInput')
			.should('exist')
			.should('have.value', companyNameUpdated);
		cy.findByTestId('changePasswordBtn').should('exist').click();
		cy.findByTestId('passwordInput').should('exist').type(passwordUpdated);
		cy.findByTestId('submitBtn').should('exist').click();
		cy.wait('@updatedUser').its('response.statusCode').should('eq', 201);
		cy.findByTestId('logout').should('be.visible').click();
		cy.login(emailUpdated, passwordUpdated);
	});
});
