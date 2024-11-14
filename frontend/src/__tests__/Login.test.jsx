import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import React from 'react';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';


jest.mock('react-router-dom', () => ({ //mock useNavigate
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

jest.mock('../api');
window.alert = jest.fn();

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe("LoginForm", () => {
    global.React = React; //This line fixes the error: "ReferenceError: React is not defined"

    const mockNavigate = jest.fn();
  
    beforeEach(() => {
      useNavigate.mockImplementation(() => mockNavigate);

      window.alert.mockClear();
      localStorage.clear();
    });

    it('navigates to /register when the Register button is clicked', () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)
        
        render(<LoginForm />);
    
        fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
        expect(mockNavigate).toHaveBeenCalledWith('/register');
      });

    it('Text typed into textboxes appears in the textboxes', () => {
        render(<LoginForm />);
        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const keyInput = screen.getByPlaceholderText(/enter login key/i);

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        fireEvent.change(keyInput, { target: { value: 'CS4800' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('testpassword');
        expect(keyInput.value).toBe('CS4800');
    });

    it('navigates to /profile and stores tokens on successful login', async () => {
      api.post.mockResolvedValue({
        data: { access: 'access_token', refresh: 'refresh_token' },
      });

      render(<LoginForm route="/login" />);

      fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'testpassword' } });
      fireEvent.change(screen.getByPlaceholderText(/enter login key/i), { target: { value: 'CS4800' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
      });

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/login', { username: 'testuser', password: 'testpassword' });
        expect(localStorage.setItem).toHaveBeenCalledWith(ACCESS_TOKEN, 'access_token');
        expect(localStorage.setItem).toHaveBeenCalledWith(REFRESH_TOKEN, 'refresh_token');
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
      });
    });

    it("Error given when no username is entered when user hits 'login'", () => {
        render(<LoginForm route="/login" />);
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(screen.getByText(/Error: Enter a username/i)).toBeInTheDocument();
    })

    it("Error given when no password is entered when user hits 'login'", () => {
      render(<LoginForm route="/login" />);
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      expect(screen.getByText(/Error: Enter a password/i)).toBeInTheDocument();
  })


    it("Error given when incorrect login info used", async () => {
      api.post.mockResolvedValue({ status: 401 });
      render(<LoginForm route="/login" />);

      fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'testpassword' } });
      fireEvent.change(screen.getByPlaceholderText(/enter login key/i), { target: { value: 'CS4800' } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/login', {
            username: "testuser",
            password: "testpassword"
        });
        expect(screen.getByText(/Error: Incorrect Account Credentials/i)).toBeInTheDocument();
    })
  })
})