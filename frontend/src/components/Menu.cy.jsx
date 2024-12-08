import React from 'react'
import Menu from './Menu'
import { MemoryRouter } from 'react-router-dom';

Cypress.Commands.add('mountWithRouter', (component) => {
  cy.mount(<MemoryRouter>{component}</MemoryRouter>);
});

describe('<Menu />', () => {
  beforeEach(() => {
    window.localStorage.setItem('ACCESS_TOKEN', 'mock-access-token');
    window.localStorage.setItem('REFRESH_TOKEN', 'mock-refresh-token');
});
  it('renders when user is logged in', () => {
    cy.mountWithRouter(<Menu />);
});
})