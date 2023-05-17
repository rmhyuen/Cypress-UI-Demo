export const CheckoutPage ={
  getFinishButton(){
    return cy.getByTest('finish')
  },
  fillInformationForm(firstName: string = 'Joe', lastName: string = 'Smith', postalCode: string = '90210') {
    return cy.get('.checkout_info_wrapper > form')
      .fillForm({
        '[data-test=firstName]': firstName,
        '[data-test=lastName]': lastName,
        '[data-test=postalCode]': postalCode
      })
  },
}