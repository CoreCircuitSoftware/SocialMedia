import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import React from 'react';

jest.mock('react-router-dom', () => ({ //mock useNavigate
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

  const mockNavigate = require('react-router-dom').useNavigate;

describe("SearchBar", () => { 
    global.React = React; //This line fixes the error: "ReferenceError: React is not defined"

    beforeEach(() => {
      //const mockNavigate = jest.fn();
      useNavigate.mockImplementation(() => mockNavigate);
    })

    it('Search Menu loads', () => {
      // const mockNavigate = jest.fn();
      // useNavigate.mockImplementation(() => mockNavigate);

      render(<SearchBar />);

      const searchButton = screen.getByPlaceholderText("Find users");
      expect(searchButton).toBeInTheDocument();
  });

    it('should update text field when typing', () => {
      render(<SearchBar />);

      const textField = screen.getByPlaceholderText('Find users');
      fireEvent.change(textField, { target: { value: 'testUser' } });
      expect(textField.value).toBe('testUser');
  });

    it('should call navigate with correct path when enter is pressed', () => {
      render(<SearchBar />);

      const textField = screen.getByPlaceholderText('Find users');
      fireEvent.change(textField, { target: { value: 'testUser' } });
      fireEvent.keyDown(textField, { key: 'Enter', code: 'Enter' });

      expect(mockNavigate).toHaveBeenCalledWith('/search/profile/testUser');
  });

    it('should call navigate to load all users when enter is pressed with empty field', () => {
      render(<SearchBar />);

      const textField = screen.getByPlaceholderText('Find users');
      fireEvent.change(textField, { target: { value: '' } });
      fireEvent.keyDown(textField, { key: 'Enter', code: 'Enter' });

      expect(mockNavigate).toHaveBeenCalledWith('/search/profile');
  });
})