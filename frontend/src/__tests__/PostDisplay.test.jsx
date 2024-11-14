import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import PostDisplay from '../components/ProfilePostDisplay';
import React from 'react';
import api from '../api';

jest.mock('react-router-dom', () => ({ //mock useNavigate
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../api');

describe('PostDisplay', () => {
    global.React = React;
    const mockNavigate = jest.fn();
  
    // Properly structured mockSlug object
    const mockSlug = {
      post: {
        user: '123e4567-e89b-12d3-a456-426614174000', // UUID for the user
        postID: 123,
        title: 'Test Post Title',
        description: 'Test Post Description',
        postDate: new Date().toISOString(),
        editDate: new Date().toISOString(),
        hasEdit: true,
      },
    };

    const mockUserData = {
        "id": "3405dbb2-abbf-471a-afcf-b45ddc505554",
        "username": "123",
        "email": "123@123.com",
        "displayName": "123",
        "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/7/74/White_domesticated_duck,_stretching.jpg",
        "bio": "bio",
        "backgroundColor": "",
        "backgroundImage": ""
      }

    const mockVoteData = {
        postVote: {
            voteID: 1,
            vote: 1,
            postID: 123,
            userID: '3405dbb2abbf471aafcfb45ddc505554'
        }
    }
    
    const mockCurUser = {
        curUser: {
            "id": "3405dbb2-abbf-471a-afcf-b45ddc505554",
            "username": "123",
            "email": "123@123.com",
            "displayName": "123",
            "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/7/74/White_domesticated_duck,_stretching.jpg",
            "bio": "bio",
            "backgroundColor": "",
            "backgroundImage": ""
          }
    }

    const comments = [{"a": 13}, {"b": 14}, {"c": 15}, {"d": 16}, {"e": 17}]

    beforeEach(() => {
        useNavigate.mockImplementation(() => mockNavigate);
        
        // Mock API calls
        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/getuserdata2/')) {
                return Promise.resolve({ data: mockUserData });
            }
            // if (url.includes('/api/post/vote/gettotal/')) {
            //     return Promise.resolve({ data: mockVoteData });
            // }
            // if (url.includes('/api/post/vote/get/')) {
            //     return Promise.resolve({ data: { vote: -1 } });
            // }
            // if (url.includes('/api/comments/gettotal/')) {
            //     return Promise.resolve({ data: comments });
            // }
            return Promise.reject(new Error('Not found'));
        });

        jest.clearAllMocks();
    });
  
    it('renders the post details correctly', async () => {
        render(
                <PostDisplay post={mockSlug.post} curUser={mockCurUser.curUser} />
        );

        await waitFor(() => {
            expect(screen.getByText('Test Post Title')).toBeInTheDocument();
            expect(screen.getByText('Test Post Description')).toBeInTheDocument();
            expect(screen.getByText('123 @123')).toBeInTheDocument();
            expect(screen.getByText('0 comments')).toBeInTheDocument();
            expect(screen.getByText('0 votes')).toBeInTheDocument();
        });

    });

    it('renders the default details correctly', async () => {
        render(
                <PostDisplay post={mockSlug} curUser={mockCurUser} />
        );

        await waitFor(() => {
            expect(screen.getByText('0 comments')).toBeInTheDocument();
            expect(screen.getByText('0 votes')).toBeInTheDocument();
        });

    });
});