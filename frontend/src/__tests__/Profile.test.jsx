import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import UserProfileTest from '../pages/UserProfile';
import React from 'react';
import api from '../api';

jest.mock('react-router-dom', () => ({ //mock useNavigate
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../api');

describe('UserProfileTest', () => {
    global.React = React;
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockImplementation(() => mockNavigate);
    });

    it('Logout button sends user to logout page', () => {
        //render(<UserProfileTest />)
        render(
            <MemoryRouter>
                <UserProfileTest />
            </MemoryRouter>
        );
        
        //expect(screen.getByRole('button', { name: /Logout/i }))
    })

})