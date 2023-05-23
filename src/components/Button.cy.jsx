import React from 'react'
import Button from './Button'

describe('<Button />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Button label="Test button"/>)
    cy.contains('button', 'Test button')
  })
})