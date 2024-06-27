// MUST HAVE USER TEST BEFORE RUN THIS TEST (test@test, 123456)

describe('Setting User spec', () => {
	const originUserData = {
		email: 'test@test.com',
		password: '123456',
		phone: '',
		companyName: '',
	};
	const editUserData = {
		email: 'edit@test.com',
		password: '123456edit',
		phone: '0223456789',
		companyName: 'Company Name Test',
	};

	beforeEach(() => {
		cy.login('test@test.com', '123456');
		cy.openModalEditUser();
		cy.findByTestId('email')
			.invoke('val')
			.then((value) => {
				originUserData.email = value as string;
			});
		cy.findByTestId('phone')
			.invoke('val')
			.then((value) => {
				originUserData.phone = value as string;
			});
		cy.findByTestId('companyName')
			.invoke('val')
			.then((value) => {
				originUserData.companyName = value as string;
			});
		cy.findByTestId('cancel').click();
	});

	it('Should show page dashboard when after login successfully', () => {
		cy.url().should('include', '/dashboard');
	});

	it('Should show page setting user when click button setting user', () => {
		cy.openModalEditUser();
	});

	it('Should display initial value when open modal edit user', () => {
		cy.openModalEditUser();
		cy.findByTestId('email').should('have.value', originUserData.email);
		cy.findByTestId('phone').should('have.value', originUserData.phone);
		cy.findByTestId('companyName').should(
			'have.value',
			originUserData.companyName
		);
	});

	describe('Should show error when enter value input', () => {
		it('Should show error when enter empty value input', () => {
			cy.openModalEditUser();
			// Input empty value and submit
			cy.findByTestId('email').clear();
			cy.findByTestId('changePassword').click();
			cy.findByTestId('password').clear();
			cy.findByTestId('phone').clear();
			cy.findByTestId('companyName').clear();
			cy.findByTestId('submit').click();
			cy.findByTestId('email-error').should('be.visible');
			cy.findByTestId('password-error').should('be.visible');
			cy.findByTestId('phone-error').should('be.visible');
			cy.findByTestId('companyName-error').should('be.visible');
		});

		it('Should show error when enter invalid value input', () => {
			cy.openModalEditUser();
			// Input invalid value and submit
			cy.findByTestId('email').clear().type('abc.com');
			cy.findByTestId('changePassword').click();
			cy.findByTestId('password').clear().type('123');
			cy.findByTestId('phone').clear().type('abc');
			cy.findByTestId('companyName').clear().type('a');
			cy.findByTestId('submit').click();
			cy.findByTestId('email-error').should('be.visible');
			cy.findByTestId('password-error').should('be.visible');
			cy.findByTestId('phone-error').should('be.visible');
			cy.findByTestId('companyName-error').should('be.visible');
		});

		describe('Should update user successfully', () => {
			afterEach(() => {
				cy.login(editUserData.email, editUserData.password);
				cy.openModalEditUser();

				// Reset user data with origin user data and submit
				cy.findByTestId('email').click().clear().type(originUserData.email);
				cy.findByTestId('changePassword').click();
				cy.findByTestId('password').clear().type(originUserData.password);
				cy.findByTestId('phone').clear().type(originUserData.phone);
				cy.findByTestId('companyName').clear().type(originUserData.companyName);
				cy.findByTestId('submit').click();
				cy.logout();
			});

			it('Should update user successfully when enter valid value input', () => {
				cy.openModalEditUser();
				// Update value and submit
				cy.findByTestId('email').click().clear().type(editUserData.email);
				cy.findByTestId('changePassword').click();
				cy.findByTestId('password').clear().type(editUserData.password);
				cy.findByTestId('phone').clear().type(editUserData.phone);
				cy.findByTestId('companyName').clear().type(editUserData.companyName);
				cy.findByTestId('submit').click();
				cy.findAllByText('User edit successfully').should('exist');
				// Check value after update but before logout
				cy.get('#dropdown-email').should('include.text', editUserData.email);
				cy.openModalEditUser();
				cy.findByTestId('email').should('have.value', editUserData.email);
				cy.findByTestId('phone').should('have.value', editUserData.phone);
				cy.findByTestId('companyName').should(
					'have.value',
					editUserData.companyName
				);
				cy.findByTestId('cancel').click();

				// Log out only to check new password
				cy.logout();

				//Check login with new detail
				cy.login(editUserData.email, editUserData.password);
				cy.logout();
			});
		});
	});
});
