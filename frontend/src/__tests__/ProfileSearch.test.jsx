import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import ProfileSearch from '../pages/ProfileSearch';
import api from "../api";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock('../api');

const mockUserData = [{
        "id": "3405dbb2-abbf-471a-afcf-b45ddc505554",
        "username": "123",
        "email": "123@123.com",
        "displayName": "123",
        "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/7/74/White_domesticated_duck,_stretching.jpg",
        "bio": "bio",
        "backgroundColor": "",
        "backgroundImage": ""
      }, {
        "id": "f040360808b64f75a542aaa7d6c70060",
        "username": "abc",
        "email": "abc@abc.com",
        "displayName": "abc",
        "profilePicture": "https://i.redd.it/fat-tux-i-created-this-simple-tux-logo-for-fun-v0-w9zk1c24wgz91.png?auto=webp&s=78ae0dec3e65420a44af1ad983f9b708b3efb73f",
        "bio": "",
        "backgroundColor": "",
        "backgroundImage": ""
      }]

const mockSingleUser = [{
        "id": "3405dbb2-abbf-471a-afcf-b45ddc505554",
        "username": "123",
        "email": "123@123.com",
        "displayName": "123",
        "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/7/74/White_domesticated_duck,_stretching.jpg",
        "bio": "bio",
        "backgroundColor": "",
        "backgroundImage": ""
}]


describe('ProfileSearch', () => {
    global.React = React
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockImplementation(() => mockNavigate);
        jest.clearAllMocks();
      });

    it('load searched for user', async () => {
        useParams.mockReturnValue({ userchunk: "123" });
        api.get.mockResolvedValue({ data: mockSingleUser });
        
        render(<ProfileSearch />);

        
        // Wait for data to be loaded and check that it is displayed
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/search/profile/123/`);
            expect(screen.getByText("Results")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("123")).toBeInTheDocument();
            
            const linkElement = screen.getByTestId('message-link')
            expect(linkElement).toHaveAttribute('href', '/profile/123/message')
            const linkElement2 = screen.getByTestId('username-link')
            expect(linkElement2).toHaveAttribute('href', '/profile/123')
            const linkElement3 = screen.getByTestId('img-link')
            expect(linkElement3).toHaveAttribute('src', 'https://icons.veryicon.com/png/o/miscellaneous/official-icon-of-flying-pig/mailbox-82.png')
        });

        await waitFor(() => {
            expect(screen.getAllByTestId("search-user")).toHaveLength(1);
        });
    })

    it('load test', () => {
        useParams.mockReturnValue({ userchunk: "123" });
        api.get.mockResolvedValue({ data: mockSingleUser });
        
        render(<ProfileSearch />);
    })

    it('no results', async () => {
        useParams.mockReturnValue({ userchunk: "123" });
        api.get.mockResolvedValue({ "data": "" });
        
        render(<ProfileSearch />);

        
        // Wait for data to be loaded and check that it is displayed
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/search/profile/123/`);
            expect(screen.getByText("No Results found.")).toBeInTheDocument();
        });
    })

     it('load searched for user but 404', async () => {
        useParams.mockReturnValue({ userchunk: "123" });
        api.get.mockRejectedValue({ response: { status: 404 } });
        
        render(<ProfileSearch />);

        // Wait for data to be loaded and check that it is displayed
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/search/profile/123/`);
            expect(mockNavigate).toHaveBeenCalledWith(`/404`);
        });
    })

    it('load searched for user but 401', async () => {
        useParams.mockReturnValue({ userchunk: "123" });
        api.get.mockRejectedValue({ response: { status: 401 } });
        
        render(<ProfileSearch />);

        // Wait for data to be loaded and check that it is displayed
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/search/profile/123/`);
            expect(mockNavigate).toHaveBeenCalledWith(`/login`);
        });
    })

    it('load searched for user but alert', async () => {
        const mockError = new Error("Error");
        useParams.mockReturnValue({ userchunk: "123" });
        api.get.mockRejectedValue(mockError);
        jest.spyOn(window, 'alert').mockImplementation(() => {})
        
        render(<ProfileSearch />);

        // Wait for data to be loaded and check that it is displayed
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/search/profile/123/`);
            expect(window.alert).toHaveBeenCalledWith(mockError)
        });
    })

    it('load all users', async () => {
        useParams.mockReturnValue({ userchunk: "" });
        api.get.mockResolvedValue({ data: mockUserData });
        
        render(<ProfileSearch />);

        // Wait for data to be loaded and check that it is displayed
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/search/profile//`);
        });
    })

    it('load all users but 404', async () => {
        useParams.mockReturnValue({ userchunk: "" });
        api.get.mockRejectedValue({ response: { status: 404 } });
        
        render(<ProfileSearch />);

        // Wait for data to be loaded and check that it is displayed
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/search/profile//`);
            expect(mockNavigate).toHaveBeenCalledWith(`/404`);
        });
    })

    it('load all users but 401', async () => {
        useParams.mockReturnValue({ userchunk: "" });
        api.get.mockRejectedValue({ response: { status: 401 } });
        
        render(<ProfileSearch />);

        // Wait for data to be loaded and check that it is displayed
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/search/profile//`);
            expect(mockNavigate).toHaveBeenCalledWith(`/login`);
        });
    }) 

    it('load searched for all but alert', async () => {
        const mockError = new Error("Error");
        useParams.mockReturnValue({ userchunk: "" });
        api.get.mockRejectedValue(mockError);
        jest.spyOn(window, 'alert').mockImplementation(() => {})
        
        render(<ProfileSearch />);

        // Wait for data to be loaded and check that it is displayed
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/search/profile//`);
            expect(window.alert).toHaveBeenCalledWith(mockError)
        });
    })
});
