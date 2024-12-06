import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import GetMyProfile from '../components/GetMyProfile';
import api from "../api";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../api');

describe("GetMyProfile", () => { 
    global.React = React; //This line fixes the error: "ReferenceError: React is not defined"

    beforeEach(() => {
      //const mockNavigate = jest.fn();
      jest.clearAllMocks(); 
    })

    it('gets profile', async () => {
        const mockData = { "profile": { "username": "example_user" } };
        api.get.mockResolvedValue({ data: mockData });
        render(<GetMyProfile />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/api/profile/');
        })
    })

    it('navigate to profile given username', async () => {
        const mockData = {"username": "example_user" };
        api.get.mockResolvedValue({ data: mockData });
        render(
            <MemoryRouter>
                <GetMyProfile />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/api/profile/');
            expect(mockNavigate).toHaveBeenCalledWith('/profile/example_user/')
        })
    })

    it('error mock', async () => {
        const mockError = new Error("Error");
        api.get.mockRejectedValue(mockError);
        render(
            <MemoryRouter>
                <GetMyProfile />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/profile/");
            expect(mockNavigate).not.toHaveBeenCalled();
        })
    })
})