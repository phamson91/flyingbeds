// MUST HAVE USER WITH ROLE ADMIN BEFORE RUN THIS TEST ('longdo@dobtech.vn', '123456')

describe('Login spec', () => {
	beforeEach(() => {
		cy.visit('/auth');
	});

	//Check show input email
	describe('Show input email', () => {
		it('Should display input email when initial page load', () => {
			cy.findByPlaceholderText('Enter email').should('exist');
		});
		it("Show error when don't enter value email", () => {
			cy.findByText('Submit').click();
			cy.findByText('Please enter email').should('exist');
		});
		it('Show error when enter invalid value email', () => {
			cy.findByPlaceholderText('Enter email').type('abc.com');
			cy.findByText('Submit').click();
			cy.findByText('Please enter a valid email').should('exist');
		});
		it('Not showing error when enter valid value email', () => {
			cy.findByPlaceholderText('Enter email').type('test@test.com');
			cy.findByText('Submit').click();
			cy.findByText('Please enter a valid email').should('not.exist');
		});
	});

	//Check show input password
	describe('Show input password', () => {
		it('Should display input password when initial page load', () => {
			cy.findByPlaceholderText('Enter password').should('exist');
		});
		it("Show error when don't enter value password", () => {
			cy.findByText('Submit').click();
			cy.findByText('Please enter password').should('exist');
		});
		it('Show error when enter invalid value password', () => {
			cy.findByPlaceholderText('Enter password').type('123');
			cy.findByText('Submit').click();
			cy.findByText('Password must be at least 6 characters').should('exist');
		});
		it('Not showing error when enter valid value password', () => {
			cy.findByPlaceholderText('Enter password').type('123456');
			cy.findByText('Submit').click();
			cy.findByText('Password must be at least 6 characters').should(
				'not.exist'
			);
		});
	});

	//Status login when enter email, password
	describe('Login check', () => {
		it('Show notification when enter email, password not exists', () => {
			cy.findByPlaceholderText('Enter email').type('test@test.com');
			cy.findByPlaceholderText('Enter password').type('123456789');
			cy.findByText('Submit').click();
			cy.findByText('Email or password is incorrect').should('exist');
		});
		it('Navigates to /dashboard on successful login', () => {
			cy.login('longdo@dobtech.vn', '123456');
		});
	});
});
