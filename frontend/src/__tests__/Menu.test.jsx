import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Menu from "../components/Menu";
import React from 'react';

jest.mock('react-router-dom', () => ({ //mock useNavigate
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

describe("Menu", () => {
    global.React = React; //This line fixes the error: "ReferenceError: React is not defined"

    it("Profile button goes to correct page", () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)

        render(<Menu />)
        const profileButton = screen.getByRole("button", {name: /Profile/i})
        fireEvent.click(profileButton)

        expect(mockNavigate).toHaveBeenCalledWith("/profile")
    })

    it('Home button goes to the correct page', () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)
    
        render(<Menu />)
        const homeButton = screen.getByRole('button', { name: /Home/i })
        fireEvent.click(homeButton)
    
        expect(mockNavigate).toHaveBeenCalledWith('/home')
      })

    it('Communities button goes to the correct page', () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)
    
        render(<Menu />)
        const communityButton = screen.getByRole('button', { name: /Communities/i })
        fireEvent.click(communityButton)
    
        expect(mockNavigate).toHaveBeenCalledWith('/communities')
      })

    it('Messages button goes to the correct page', () => {
        const mockNavigate = jest.fn()
        useNavigate.mockImplementation(() => mockNavigate)
    
        render(<Menu />)
        const messagesButton = screen.getByRole('button', { name: /Messages/i })
        fireEvent.click(messagesButton)
    
        expect(mockNavigate).toHaveBeenCalledWith('/message')
      })
})