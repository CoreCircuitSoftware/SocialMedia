import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import React from 'react';

jest.mock('react-router-dom', () => ({ //mock useNavigate
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

describe("SearchBar", () => { 
    global.React = React; //This line fixes the error: "ReferenceError: React is not defined"

    it('Search Menu loads', () => {
      const mockNavigate = jest.fn();
      useNavigate.mockImplementation(() => mockNavigate);

      render(<SearchBar />);

      const searchButton = screen.getByPlaceholderText("Find users");
      expect(searchButton).toBeInTheDocument();
  });

    // it("Press Search button with no text entered into search field", () => {
    //     const mockNavigate = jest.fn()
    //     useNavigate.mockImplementation(() => mockNavigate)

    //     render(<SearchBar />)
    //     const searchButton = screen.getByRole("button", {name: /Search/i})
    //     fireEvent.click(searchButton)

    //     expect(mockNavigate).toHaveBeenCalledWith("/search/profile")
    // })

    // it('navigates to the correct path when a user types a name and clicks search', () => {
    //     const mockNavigate = jest.fn();
    //     useNavigate.mockImplementation(() => mockNavigate);
    
    //     render(<SearchBar />);
    
    //     const searchInput = screen.getByPlaceholderText(/find users/i);
    //     fireEvent.change(searchInput, { target: { value: 'test_user' } });
    
    //     const searchButton = screen.getByRole('button', { name: /search/i });
    //     fireEvent.click(searchButton);
    
    //     expect(mockNavigate).toHaveBeenCalledWith('/search/profile/test_user');
    //   });

})