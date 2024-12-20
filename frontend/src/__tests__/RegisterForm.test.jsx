import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import React from 'react';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

jest.mock('react-router-dom', () => ({ //mock useNavigate
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}))

jest.mock('../api')

describe("RegisterForm", () => {
    global.React = React;
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockImplementation(() => mockNavigate);
    })

    it("Form loads with placeholders", async () => {
        render(<RegisterForm />)
        await waitFor(() => {
            expect(screen.getByPlaceholderText("Username")).toBeInTheDocument()
            expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
            expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
            expect(screen.getByPlaceholderText("Display Name")).toBeInTheDocument()
        })
    })

    it('navigates to /login when the Login button is clicked', () => {
        render(<RegisterForm />)
        fireEvent.click(screen.getByRole('button', { name: /login/i }))
        expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('submits the form and navigates to the login page', async () => {
        api.post.mockResolvedValue({ status: 201 }); // Mock API response
    
        render(<RegisterForm route="/register" />);
    
        // Simulate input changes
        fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: 'test_user' } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: 'test_password' } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: 'test_email' } });
        fireEvent.change(screen.getByPlaceholderText("Display Name"), { target: { value: 'test_display_name' } });
        fireEvent.change(screen.getByPlaceholderText("Enter register key"), { target: { value: 'CS4800' } }); // Ensure the key is correct
    
        // Simulate form submission
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /register/i }));
        });
    
        // Wait for API call and assertions
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/register', {
                username: 'test_user',
                password: 'test_password',
                email: 'test_email',
                displayName: 'test_display_name',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
})