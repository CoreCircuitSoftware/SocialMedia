import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import PostEdit from '../components/PostEdit';
import React from 'react';
import api from '../api';

jest.mock('react-router-dom', () => ({ //mock useNavigate
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock('../api');

describe("PostEdit", () => { 
    global.React = React;
    const mockNavigate = jest.fn();

    const mockPost = {
        user: '3405dbb2-abbf-471a-afcf-b45ddc505554',
        postID: 123,
        title: 'Test Post Title',
        description: 'Test Post Description',
        postDate: new Date().toISOString(),
        editDate: new Date().toISOString(),
        hasEdit: true,
      }

    beforeEach(() => {
        useParams.mockReturnValue({ postid: mockPost.postID });
        useNavigate.mockImplementation(() => mockNavigate);
        jest.clearAllMocks();
      });

    it('fetches and displays post data', async () => {
        api.get.mockResolvedValue({ data: mockPost });

        render(<PostEdit />);

        // Wait for data to be loaded and check that it is displayed
        await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith(`/api/posts/${mockPost.postID}/`);
        expect(screen.getByLabelText('Post Title')).toHaveValue(mockPost.title);
        expect(screen.getByLabelText('Post Description')).toHaveValue(mockPost.description);
        });
    });

    it('Entering data updates the state', async () => {
        api.get.mockResolvedValue({ data: mockPost });

        render(<PostEdit />);
        await waitFor(() => {
            fireEvent.change(screen.getByLabelText('Post Title'), { target: { value: 'New Title' } });
            fireEvent.change(screen.getByLabelText('Post Description'), { target: { value: 'New Description' } });
            expect(screen.getByLabelText('Post Title')).toHaveValue('New Title');
            expect(screen.getByLabelText('Post Description')).toHaveValue('New Description');
        });
    })

    it('submits the form and navigates to the post view page', async () => {
        api.get.mockResolvedValue({ data: mockPost });
        api.patch.mockResolvedValue({ data: {} });

        render(<PostEdit />);
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
            expect(api.patch).toHaveBeenCalledWith(`/api/posts/edit/${mockPost.postID}/`, { title: mockPost.title, description: mockPost.description });
            expect(mockNavigate).toHaveBeenCalledWith(`/post/view/${mockPost.postID}`);
        });
    })

    it('pressing cancel returns user back to the page of the post', async () => {
        api.get.mockResolvedValue({ data: mockPost });
        render(<PostEdit />);
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
            expect(mockNavigate).toHaveBeenCalledWith(`/post/view/${mockPost.postID}`);
        });
    })


})