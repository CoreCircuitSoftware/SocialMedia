import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import React from 'react';
import api from '../api';

jest.mock('react-router-dom', () => ({ //mock useNavigate
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../api');

describe("ProfileForm", () => {
    global.React = React;
    const mockNavigate = jest.fn();

    const mockProfile = {
        "id": "3405dbb2-abbf-471a-afcf-b45ddc505554",
        "username": "123",
        "email": "123@123.com",
        "displayName": "123",
        "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/7/74/White_domesticated_duck,_stretching.jpg",
        "bio": "bio",
        "backgroundColor": "",
        "backgroundImage": "awawawa"
      }

    beforeEach(() => {
        useNavigate.mockImplementation(() => mockNavigate);
      });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('Form renders with empty fields', async () => { 
        api.get.mockResolvedValue({ data: mockProfile })
        render(<ProfileForm />)

        await waitFor(() => { 
            expect(screen.getByText("Display Name")).toBeInTheDocument();
            expect(screen.getByText("Bio")).toBeInTheDocument();
            expect(screen.getByText("Profile Picture")).toBeInTheDocument();
            expect(screen.getByText("Banner")).toBeInTheDocument();
            expect(screen.getAllByRole("textbox")).toHaveLength(4);
        })
    })

    it('Form renders with user data filled in form already', async () => { 
        api.get.mockResolvedValue({ data: mockProfile })
        render(<ProfileForm />)

        await waitFor(() => { 
            expect(screen.getByPlaceholderText(mockProfile.displayName)).toBeInTheDocument()
            expect(screen.getByPlaceholderText(mockProfile.bio)).toBeInTheDocument()
            expect(screen.getByPlaceholderText(mockProfile.profilePicture)).toBeInTheDocument()
            expect(screen.getByPlaceholderText(mockProfile.backgroundImage)).toBeInTheDocument()
        })
    })

    it('Text typed into textboxes appears in the textboxes', async () => {
        api.get.mockResolvedValue({ data: mockProfile })
        render(<ProfileForm />)

        await waitFor(() => {
            const displayName = screen.getByPlaceholderText(mockProfile.displayName);
            const bio = screen.getByPlaceholderText(mockProfile.bio);
            const pfp = screen.getByPlaceholderText(mockProfile.profilePicture);
            const bkg = screen.getByPlaceholderText(mockProfile.backgroundImage);

            fireEvent.change(displayName, { target: { value: 'test_name' } });
            fireEvent.change(bio, { target: { value: 'test_bio' } });
            fireEvent.change(pfp, { target: { value: 'test_pfp' } });
            fireEvent.change(bkg, { target: { value: 'test_bkg' } });

            expect(displayName.value).toBe('test_name');
            expect(bio.value).toBe('test_bio');
            expect(pfp.value).toBe('test_pfp');
            expect(bkg.value).toBe('test_bkg');
        })
    });

    it('Form submits and navigates to /profile', async () => { 
        api.get.mockResolvedValue({ data: mockProfile })
        api.patch.mockResolvedValue()
        render(<ProfileForm />)

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
            expect(api.patch).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/profile');
        })
    })

    it('User presses cancel', async () => { 
        api.get.mockResolvedValue({ data: mockProfile })
        render(<ProfileForm />)

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
            expect(mockNavigate).toHaveBeenCalledWith('/profile');
        })
    })

    it('User presses delete', async () => { 
        jest.spyOn(window, 'confirm').mockImplementation(() => true) 
        jest.spyOn(window, 'alert').mockImplementation(() => {}) 
        api.get.mockResolvedValue({ data: mockProfile })
        api.delete.mockResolvedValue()
        render(<ProfileForm />)

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /Delete/i }))
            expect(api.delete).toHaveBeenCalled()
            expect(window.confirm).toHaveBeenCalledWith('Delete your account? This cannot be undone')
            expect(api.delete).toHaveBeenCalledWith('/api/profile/delete/')
            expect(mockNavigate).toHaveBeenCalledWith("/login")
            expect(window.alert).toHaveBeenCalledWith('Account deleted!')
        })
    })

    it('User presses delete but cancels', async () => {
        jest.spyOn(window, 'confirm').mockImplementation(() => false)
        jest.spyOn(window, 'alert').mockImplementation(() => {}) 
        api.get.mockResolvedValue({ data: mockProfile })
        api.delete.mockResolvedValue()
        render(<ProfileForm />)

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /Delete/i }))
            expect(window.confirm).toHaveBeenCalledWith('Delete your account? This cannot be undone')
            expect(mockNavigate).toHaveBeenCalled()
            expect(window.alert).not.toHaveBeenCalled()
        })
    })
})