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
        user: '3405dbb2-abbf-471a-afcf-b45ddc505554', // UUID for the user
        postID: 123,
        title: 'Test Post Title',
        description: 'Test Post Description',
        postDate: new Date().toISOString(),
        editDate: new Date().toISOString(),
        hasEdit: true,
      },
    };

    const mockSlug2 = {
        post: {
          user: 'f040360808b64f75a542aaa7d6c70060', // UUID for the user
          postID: 321,
          title: 'Another Test',
          description: 'Another Test Post Description',
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

      const mockUserData2 = {
        "id": "f040360808b64f75a542aaa7d6c70060",
        "username": "abc",
        "email": "abc@abc.com",
        "displayName": "abc",
        "profilePicture": "https://i.redd.it/fat-tux-i-created-this-simple-tux-logo-for-fun-v0-w9zk1c24wgz91.png?auto=webp&s=78ae0dec3e65420a44af1ad983f9b708b3efb73f",
        "bio": "",
        "backgroundColor": "",
        "backgroundImage": ""
      }

    const mockVoteData = [
        {
            "voteID": 1,
            "post": 321,
            "user": "0eb60b58-8da6-484d-92ef-a81f57ccba68",
            "vote": true
        },
        {
            "voteID": 2,
            "post": 321,
            "user": "3405dbb2-abbf-471a-afcf-b45ddc505554",
            "vote": true
        }
    ]
    
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
        
        jest.clearAllMocks();
    });
  
    it('renders the post details correctly when user is not one who posted', async () => {
        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/')) {
                return Promise.resolve({ data: mockUserData2 });
            }
            if (url.includes('api/profile/getuserdata2/')) {
                return Promise.resolve({ data: mockUserData2 });
            }
            if (url === 'api/posts/vote/gettotal/321/') {
                return Promise.resolve({ data: mockVoteData });
            }
            if (url === 'api/posts/comments/gettotal/321/') {
                return Promise.resolve({ data: comments });
            }
            if (url === 'api/posts/vote/get/321/') {
                return Promise.resolve({ data: comments });
            }
            return Promise.reject(new Error('Not found'));
        })


        render(
                <PostDisplay post={mockSlug2.post} />
        );

        await waitFor(() => {
            expect(screen.getByText('Another Test')).toBeInTheDocument();
            expect(screen.getByText('Another Test Post Description')).toBeInTheDocument();
            expect(screen.getByText('abc @abc')).toBeInTheDocument();
            expect(screen.getByText('2 votes')).toBeInTheDocument();
            expect(screen.getByRole('img', {class: 'pfp'})).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /edit/i }))
            expect(screen.getByRole('button', { name: /delete/i }))
            expect(screen.getByRole('button', { name: /share/i }))
            expect(screen.getByRole('button', { name: /upvote/i }))
            expect(screen.getByRole('button', { name: /downvote/i }))
            expect(screen.getByRole('button', { name: /comments/i }))
        });

    });

    it('renders the default details correctly for when user is the one who posted', async () => {
        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url.includes('api/profile/getuserdata2/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url === 'api/posts/vote/gettotal/321/') {
                return Promise.resolve({ data: mockVoteData });
            }
            if (url === 'api/posts/comments/gettotal/321/') {
                return Promise.resolve({ data: comments });
            }
            if (url === 'api/posts/vote/get/321/') {
                return Promise.resolve({ data: comments });
            }
            return Promise.reject(new Error('Not found'));
        })


        render(
                <PostDisplay post={mockSlug.post} />
        );

        await waitFor(() => {
            expect(screen.getByText('Test Post Title')).toBeInTheDocument();
            expect(screen.getByText('Test Post Description')).toBeInTheDocument();
            expect(screen.getByText('123 @123')).toBeInTheDocument();
            expect(screen.getByText('0 votes')).toBeInTheDocument();
            expect(screen.getByRole('img', {class: 'pfp'})).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /edit/i }))
            expect(screen.getByRole('button', { name: /delete/i }))
            expect(screen.getByRole('button', { name: /share/i }))
            expect(screen.getByRole('button', { name: /upvote/i }))
            expect(screen.getByRole('button', { name: /downvote/i }))
            expect(screen.getByRole('button', { name: /comments/i }))
        });

    });

    it('renders the default details correctly', async () => {
        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url.includes('api/profile/getuserdata2/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url === 'api/posts/vote/gettotal/321/') {
                return Promise.resolve({ data: mockVoteData });
            }
            if (url === 'api/posts/comments/gettotal/321/') {
                return Promise.resolve({ data: comments });
            }
            if (url === 'api/posts/vote/get/321/') {
                return Promise.resolve({ data: comments });
            }
            return Promise.reject(new Error('Not found'));
        })

        render(
                <PostDisplay post={mockSlug.post} />
        );

        await waitFor(() => {
            expect(screen.getByText('0 votes')).toBeInTheDocument();
        });

    });

    it('Share button copies link of post to clipboard', async () => {
        navigator.clipboard = {writeText: jest.fn()};
        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url.includes('api/profile/getuserdata2/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url === 'api/posts/vote/gettotal/321/') {
                return Promise.resolve({ data: mockVoteData });
            }
            if (url === 'api/posts/comments/gettotal/321/') {
                return Promise.resolve({ data: comments });
            }
            if (url === 'api/posts/vote/get/321/') {
                return Promise.resolve({ data: comments });
            }
            return Promise.reject(new Error('Not found'));
        })

        render(<PostDisplay post={mockSlug.post} />);
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /share/i }))
            fireEvent.click(screen.getByRole('button', { name: /share/i }))
        })
    });

 
    it('Edit button navigates to edit page', async () => { 
        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url.includes('api/profile/getuserdata2/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url === 'api/posts/vote/gettotal/321/') {
                return Promise.resolve({ data: mockVoteData });
            }
            if (url === 'api/posts/comments/gettotal/321/') {
                return Promise.resolve({ data: comments });
            }
            if (url === 'api/posts/vote/get/321/') {
                return Promise.resolve({ data: comments });
            }
            return Promise.reject(new Error('Not found'));
        })
        render(<PostDisplay post={mockSlug.post} curUser={mockUserData} />)

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /edit/i }))
            fireEvent.click(screen.getByRole('button', { name: /edit/i }))
            expect(mockNavigate).toHaveBeenCalledWith(`/post/edit/${mockSlug.post.postID}`);
        })
    })



    it('Comments button brings user to comments page', async () => { 
        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url.includes('api/profile/getuserdata2/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url === 'api/posts/vote/gettotal/321/') {
                return Promise.resolve({ data: mockVoteData });
            }
            if (url === 'api/posts/comments/gettotal/321/') {
                return Promise.resolve({ data: comments });
            }
            if (url === 'api/posts/vote/get/321/') {
                return Promise.resolve({ data: comments });
            }
            return Promise.reject(new Error('Not found'));
        })
        render(<PostDisplay post={mockSlug.post} curUser={mockUserData2} />);
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /comments/i }))
            fireEvent.click(screen.getByRole('button', { name: /comments/i }))
            expect(mockNavigate).toHaveBeenCalledWith(`/post/view/${mockSlug.post.postID}`);
        })
    })

    it('Clicking profile picture brings user to page of profile clicked', async () => {
        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url.includes('api/profile/getuserdata2/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url === 'api/posts/vote/gettotal/321/') {
                return Promise.resolve({ data: mockVoteData });
            }
            if (url === 'api/posts/comments/gettotal/321/') {
                return Promise.resolve({ data: comments });
            }
            if (url === 'api/posts/vote/get/321/') {
                return Promise.resolve({ data: comments });
            }
            return Promise.reject(new Error('Not found'));
        })
        render(<PostDisplay post={mockSlug.post} curUser={mockCurUser} />);

        await waitFor(() => {
            expect(screen.getByRole('img', {class: 'pfp'})).toBeInTheDocument();
            fireEvent.click(screen.getByRole('img', {class: 'pfp'}))
            expect(mockNavigate).toHaveBeenCalledWith(`/profile/${mockUserData.username}`);
        });

    });


    it('Upvote a post', async () => { 
        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url.includes('api/profile/getuserdata2/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url === 'api/posts/vote/gettotal/321/') {
                return Promise.resolve({ data: mockVoteData });
            }
            if (url === 'api/posts/comments/gettotal/321/') {
                return Promise.resolve({ data: comments });
            }
            return Promise.reject(new Error('Not found'));
        })
        api.post.mockResolvedValue({ status: 201, data: { success: true } })
        render(<PostDisplay post={mockSlug2.post} curUser={mockUserData2} />);
        expect(screen.getByRole('button', { name: /upvote/i }))
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/posts/vote/gettotal/321/') 
            fireEvent.click(screen.getByRole('button', { name: /upvote/i }))
            
        })
        expect(api.post).toHaveBeenCalledWith('/api/posts/vote/new/', 
            {
                vote: true,
                post: 321,
                user: mockUserData2.id
            });
        await waitFor(() => {
            expect(screen.getByText('2 votes')).toBeInTheDocument()  
        })
    })

    it('delete a vote', async () => { 
        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url.includes('api/profile/getuserdata2/')) {
                return Promise.resolve({ data: mockUserData });
            }
            if (url === 'api/posts/vote/gettotal/123/') {
                return Promise.resolve({ data: mockVoteData });
            }
            if (url === 'api/posts/comments/gettotal/123/') {
                return Promise.resolve({ data: comments });
            }
            return Promise.reject(new Error('Not found'));
        })
        api.delete.mockResolvedValue({ status: 201, data: { success: true } })
        render(<PostDisplay post={mockSlug.post} />);
        expect(screen.getByRole('button', { name: /upvote/i }))

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/posts/vote/gettotal/123/') 
            fireEvent.click(screen.getByRole('button', { name: /downvote/i }))
            
        })
        expect(api.post).toHaveBeenCalledWith('/api/posts/vote/new/', 
            {
                vote: false,
                post: 123,
                user: "3405dbb2-abbf-471a-afcf-b45ddc505554"
            });
        await waitFor(() => {
            expect(screen.getByText('2 votes')).toBeInTheDocument()  
        })
    })

 


});