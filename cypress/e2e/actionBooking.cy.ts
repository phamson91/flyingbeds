// MUST HAVE USER WITH ROLE ADMIN BEFORE RUN THIS TEST ('longdo@dobtech.vn', '123456')
// MUST CONFIRM USER email: testbooking@test.com not exists BEFORE RUN THIS TEST 
// MUST PNR EXISTS BEFORE RUN THIS TEST
// MUST Max Credit + Balance > Price Summary BEFORE RUN THIS TEST

//Get api amadeus to get PNR and then replace value of RELOC
const RELOC = '6UDQJ3';

describe('Action Booking spec', () => {
	//Register new user
	before(() => {
		cy.login('longdo@dobtech.vn', '123456');
		cy.findByTestId('btnAdmin').should('be.visible').click();
		cy.findByText('Manage Agents').should('be.visible').click();
		cy.intercept('POST', '**/api/users').as('addUser');

		cy.findByTestId('btnAddAgent').should('exist').click();
		cy.findByTestId('emailInput').should('exist').type('testbooking@test.com');
		cy.findByTestId('passwordInput').should('exist').type('123456');
		cy.findByTestId('phoneInput').should('exist').type('0111222233');
		cy.findByTestId('creditLimitInput').should('exist').type('1000000000');
		cy.findByTestId('companyNameInput')
			.should('exist')
			.type('Test Booking Ltd');
		cy.findByTestId('submitBtn').should('exist').click();
		cy.wait('@addUser').its('response.statusCode').should('eq', 201);
	});

	beforeEach(() => {
		cy.login('testbooking@test.com', '123456');
		cy.visit('/dashboard/action-booking');
	});

	it('should show input and retrieve button', () => {
		cy.findByPlaceholderText('Enter Relocator').should('be.visible');
		cy.findByText('Retrieve PNR').should('be.visible');
	});

	it('should show booking detail after submit valid PNR', () => {
		cy.findByPlaceholderText('Enter Relocator').type(RELOC);
		cy.findByText('Retrieve PNR').click();
		cy.findByText('Show Price Summary').should('be.visible');
	});

	it('should show price detail after click show price summary with valid PNR', () => {
		cy.findByPlaceholderText('Enter Relocator').type(RELOC);
		cy.findByText('Retrieve PNR').click();
		cy.findByText('Show Price Summary').click();
		cy.findByText('Issue Ticket').should('be.visible');
	});

	it.only('should show confirmation after issue ticket', () => {
		cy.intercept('POST', '**/api/issue-ticket/*').as('issueTicket');
		cy.intercept('GET', '**/api/pnr-retrieve/*').as('pnrRetrieve');
		cy.intercept('POST', '**/api/price-summary').as('priceSummary');

		cy.findByPlaceholderText('Enter Relocator').type(RELOC);
		cy.findByText('Retrieve PNR').click();
		cy.wait('@pnrRetrieve');
		cy.findByText('Show Price Summary').click();
		cy.wait('@priceSummary');
		cy.findByText('Issue Ticket').click();
		cy.wait('@issueTicket');
		cy.findByTestId('heading').should('include.text', 'Confirmation');
	});

	it('should show error if user have do not have enough credit to issue ticket', () => {
		cy.intercept('GET', '**/api/pnr-retrieve/*').as('pnrRetrieve');
		cy.intercept('POST', '**/api/price-summary').as('priceSummary');

		cy.findByPlaceholderText('Enter Relocator').type(RELOC);
		cy.findByText('Retrieve PNR').click();
		cy.wait('@pnrRetrieve');
		cy.findByText('Show Price Summary').click();
		cy.wait('@priceSummary');
		cy.findByText('Issue Ticket').click();
		cy.findByText('Insufficient credit balance').should('be.visible');
	});
});
