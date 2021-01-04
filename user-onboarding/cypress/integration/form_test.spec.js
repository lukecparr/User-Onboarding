describe('Form tests', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000')
	})

	const nameInput = () => cy.get('input[name="name"]')
	const emailInput = () => cy.get('input[name="email"]')
	const passwordInput = () => cy.get('input[name="password"]')
	const termsBox = () => cy.get('input[name="terms"]')
	const submitBtn = () => cy.get('button[type="submit"]')
	const preArea = () => cy.get('pre')
	const error = () => cy.get('p[class="error"]')

	it('Elements exist', () => {
		nameInput().should('exist')
		emailInput().should('exist')
		passwordInput().should('exist')
		termsBox().should('exist')
		submitBtn().should('exist')
		preArea().should('exist')
	})

	it('Elements work', () => {
		// Name input works
		nameInput()
			.should('have.value', '')
			.type('Luke')
			.should('have.value', 'Luke')

		// Email input works
		emailInput()
			.should('have.value', '')
			.type('luke-parr@lambdastudents.com')
			.should('have.value', 'luke-parr@lambdastudents.com')

		// Password input works
		passwordInput()
			.should('have.value', '')
			.type('viral elastic octopus')
			.should('have.value', 'viral elastic octopus')
				
		// Terms checkbox works
		termsBox()
			.should('not.be.checked')
			.check()
			.should('be.checked')

		// Submit button works
		submitBtn()
			.should('be.enabled')
			.click()
		
		// Form contents were successfully submitted
		cy.contains(`"name": "Luke", "email": "luke-parr@lambdastudents.com`).should('exist')
	})

	describe('Validation checks', () => {
		it('Name validation works', () => {
			nameInput()
				.type('a')
				.type('{backspace}')
	
			error().should('exist')
		})

		it('Email validation works', () => {
			emailInput()
				.type('lp')
				
			error().should('exist')
		})
		
		it('Password validation works', () => {
			passwordInput()
				.type('viral')
				.type('{selectAll}{backspace}')
				
			error().should('exist')
		})
		
		it('Terms validation works', () => {
			termsBox()
				.check()
				.uncheck()
				
			error().should('exist')
		})

	})

			
})