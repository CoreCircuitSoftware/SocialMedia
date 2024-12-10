import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, useParams, useNavigate } from "react-router-dom";
import MessagePage from "../pages/Message";
import api from "../api";

// Mock API module
jest.mock("../api");

// Mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

describe("MessagePage", () => {
    const mockNavigate = jest.fn();
    global.React = React
    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
        useParams.mockReturnValue({ username: "testuser" });
    });

    it("should render the page and fetch profiles", async () => {
        const mockProfile = { id: "1", username: "testuser" };
        const mockMyProfile = { id: "2", username: "myprofile" };
        const mockMessages = [
            { messageID: "1", sender: "2", message: "Hello!" },
            { messageID: "2", sender: "1", message: "Hi there!" },
        ];

        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/getuserdata/testuser/')) {
                return Promise.resolve({ data: [mockProfile] });
            }
            if (url.includes("/api/profile/")) {
                return Promise.resolve({ data: mockMyProfile });
            }
            
            if (url.includes(`/api/profile/message/getmessages/3/`)) {
                return Promise.resolve({ data: mockMessages });
            }
            return Promise.reject(new Error('Not found'));
        })

        api.post.mockImplementation((url) => {
            if (url.includes(`/api/profile/message/1/2/`)) {
                return Promise.resolve({ data: "3" });
            }
            return Promise.reject(new Error('Not found'));
        })

        render(
            <MemoryRouter>
                <MessagePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/profile/getuserdata/testuser/");
            expect(api.get).toHaveBeenCalledWith("/api/profile/");
            expect(api.post).toHaveBeenCalledWith(`/api/profile/message/1/2/`);
        });

    });

    it("should show messages when convoID exists", async () => {
        const mockProfile = { id: "1", username: "testuser" };
        const mockMyProfile = { id: "2", username: "myprofile" };
        const mockMessages = [
            { messageID: "1", sender: "2", message: "Hello!" },
            { messageID: "2", sender: "1", message: "Hi there!" },
        ];

        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/getuserdata/testuser/')) {
                return Promise.resolve({ data: [mockProfile] });
            }
            if (url.includes("/api/profile/")) {
                return Promise.resolve({ data: mockMyProfile });
            }
            
            if (url.includes(`/api/profile/message/getmessages/3/`)) {
                return Promise.resolve({ data: mockMessages });
            }
            return Promise.reject(new Error('Not found'));
        })

        api.post.mockImplementation((url) => {
            if (url.includes(`/api/profile/message/1/2/`)) {
                return Promise.resolve({ data: "3" });
            }
            return Promise.reject(new Error('Not found'));
        })

        render(
            <MemoryRouter>
                <MessagePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/profile/getuserdata/testuser/");
            expect(api.get).toHaveBeenCalledWith("/api/profile/");
            expect(api.post).toHaveBeenCalledWith(`/api/profile/message/1/2/`);
        });

        expect(screen.getByText("Your convo with testuser")).toBeInTheDocument();
    });

    it("should send a message when the form is submitted", async () => {
        const mockProfile = { id: "1", username: "testuser" };
        const mockMyProfile = { id: "2", username: "myprofile" };
        const mockMessages = [
            { messageID: "1", sender: "2", message: "Hello!" },
            { messageID: "2", sender: "1", message: "Hi there!" },
        ];

        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/getuserdata/testuser/')) {
                return Promise.resolve({ data: [mockProfile] });
            }
            if (url.includes("/api/profile/")) {
                return Promise.resolve({ data: mockMyProfile });
            }
            
            if (url.includes(`/api/profile/message/getmessages/3/`)) {
                return Promise.resolve({ data: mockMessages });
            }
            return Promise.reject(new Error('Not found'));
        })

        api.post.mockImplementation((url) => {
            if (url.includes(`/api/profile/message/1/2/`)) {
                return Promise.resolve({ data: "3" });
            }
            if (url.includes(`/api/profile/message/send/`)) {
                return Promise.resolve([{ messageID: "3", sender: "2", message: "Test Message" }],);
            }
            return Promise.reject(new Error('Not found'));
        })

        render(
            <MemoryRouter>
                <MessagePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/profile/getuserdata/testuser/");
            expect(api.get).toHaveBeenCalledWith("/api/profile/");
            expect(api.post).toHaveBeenCalledWith(`/api/profile/message/1/2/`);
        });

        expect(screen.getByTestId("message-input")).toBeInTheDocument();
       
        fireEvent.change(screen.getByTestId("message-input")), {
            target: { value: "Test Message" },
        };
        fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    });

    it("should show 'You have not messaged this user before' when no convo exists", async () => {
        const mockProfile = { id: "1", username: "testuser" };
        const mockMyProfile = { id: "2", username: "myprofile" };
        const mockMessages = [
            { messageID: "1", sender: "2", message: "Hello!" },
            { messageID: "2", sender: "1", message: "Hi there!" },
        ];

        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/getuserdata/testuser/')) {
                return Promise.resolve({ data: [mockProfile] });
            }
            if (url.includes("/api/profile/")) {
                return Promise.resolve({ data: mockMyProfile });
            }
            
            if (url.includes(`/api/profile/message/getmessages/3/`)) {
                return Promise.resolve({ data: mockMessages });
            }
            return Promise.reject(new Error('Not found'));
        })

        api.post.mockImplementation((url) => {
            if (url.includes(`/api/profile/message/1/2/`)) {
                return Promise.resolve({ data: null });
            }
            if (url.includes(`/api/profile/message/send/`)) {
                return Promise.resolve([{ messageID: "3", sender: "2", message: "Test Message" }],);
            }
            return Promise.reject(new Error('Not found'));
        })

        render(
            <MemoryRouter>
                <MessagePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/api/profile/message/1/2/");
        });

        expect(screen.getByText("You have not messaged this user before")).toBeInTheDocument();
    });

    it("create new convo", async () => {
        const mockProfile = { id: "1", username: "testuser" };
        const mockMyProfile = { id: "2", username: "myprofile" };
        const mockMessages = [
            { messageID: "1", sender: "2", message: "Hello!" },
            { messageID: "2", sender: "1", message: "Hi there!" },
        ];

        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/getuserdata/testuser/')) {
                return Promise.resolve({ data: [mockProfile] });
            }
            if (url.includes("/api/profile/")) {
                return Promise.resolve({ data: mockMyProfile });
            }
            
            if (url.includes(`/api/profile/message/getmessages/3/`)) {
                return Promise.resolve({ data: mockMessages });
            }
            return Promise.reject(new Error('Not found'));
        })

        api.post.mockImplementation((url) => {
            if (url.includes(`/api/profile/message/1/2/`)) {
                return Promise.resolve({ data: null });
            }
            if (url.includes(`/api/profile/message/send/`)) {
                return Promise.resolve([{ messageID: "3", sender: "2", message: "Test Message" }],);
            }
            if (url.includes("/api/profile/message/createconvo/")) {
                return Promise.resolve({ status: 201, data: { success: true }});
            }
            if (url.includes("/api/profile/message/setconvoparticipant/")) {
                return Promise.resolve({ status: 201, data: { success: true }});
            }
            return Promise.reject(new Error('Not found'));
        })

        render(
            <MemoryRouter>
                <MessagePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/api/profile/message/1/2/");
        });

        expect(screen.getByText("You have not messaged this user before")).toBeInTheDocument();
        expect(screen.getByTestId("create-convo-button")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("create-convo-button"))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/api/profile/message/createconvo/");
            });
    });

    it("create new convo - error", async () => {
        const mockProfile = { id: "1", username: "testuser" };
        const mockMyProfile = { id: "2", username: "myprofile" };
        const mockMessages = [
            { messageID: "1", sender: "2", message: "Hello!" },
            { messageID: "2", sender: "1", message: "Hi there!" },
        ];

        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/getuserdata/testuser/')) {
                return Promise.resolve({ data: [mockProfile] });
            }
            if (url.includes("/api/profile/")) {
                return Promise.resolve({ data: mockMyProfile });
            }
            
            if (url.includes(`/api/profile/message/getmessages/3/`)) {
                return Promise.resolve({ data: mockMessages });
            }
            return Promise.reject(new Error('Not found'));
        })

        api.post.mockImplementation((url) => {
            if (url.includes(`/api/profile/message/1/2/`)) {
                return Promise.resolve({ data: null });
            }
            if (url.includes(`/api/profile/message/send/`)) {
                return Promise.resolve([{ messageID: "3", sender: "2", message: "Test Message" }],);
            }
            if (url.includes("/api/profile/message/createconvo/")) {
                return Promise.resolve(new Error('Convo Error'));
            }
            if (url.includes("/api/profile/message/setconvoparticipant/")) {
                return Promise.resolve({ status: 201, data: { success: true }});
            }
            return Promise.reject(new Error('Not found'));
        })

        render(
            <MemoryRouter>
                <MessagePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/api/profile/message/1/2/");
        });

        expect(screen.getByText("You have not messaged this user before")).toBeInTheDocument();
        expect(screen.getByTestId("create-convo-button")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("create-convo-button"))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/api/profile/message/createconvo/");
        });
    });

    it("create new convo - error", async () => {
        const mockProfile = { id: "1", username: "testuser" };
        const mockMyProfile = { id: "2", username: "myprofile" };
        const mockMessages = [
            { messageID: "1", sender: "2", message: "Hello!" },
            { messageID: "2", sender: "1", message: "Hi there!" },
        ];

        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/getuserdata/testuser/')) {
                return Promise.resolve({ data: [mockProfile] });
            }
            if (url.includes("/api/profile/")) {
                return Promise.resolve({ data: mockMyProfile });
            }
            
            if (url.includes(`/api/profile/message/getmessages/3/`)) {
                return Promise.resolve({ data: mockMessages });
            }
            return Promise.reject(new Error('Not found'));
        })

        api.post.mockImplementation((url) => {
            if (url.includes(`/api/profile/message/1/2/`)) {
                return Promise.resolve(new Error('Convo Error'));
            }
            if (url.includes(`/api/profile/message/send/`)) {
                return Promise.resolve([{ messageID: "3", sender: "2", message: "Test Message" }],);
            }
            if (url.includes("/api/profile/message/createconvo/")) {
                return Promise.resolve(new Error('Convo Error'));
            }
            if (url.includes("/api/profile/message/setconvoparticipant/")) {
                return Promise.resolve({ status: 201, data: { success: true }});
            }
            return Promise.reject(new Error('Not found'));
        })

        render(
            <MemoryRouter>
                <MessagePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/api/profile/message/1/2/");
        });
    });

    it("should initialize WebSocket when convoID is set", async () => {
        const mockProfile = { id: "1", username: "testuser" };
        const mockMyProfile = { id: "2", username: "myprofile" };
        const mockMessages = [
            { messageID: "1", sender: "2", message: "Hello!" },
            { messageID: "2", sender: "1", message: "Hi there!" },
        ];

        api.get.mockImplementation((url) => {
            if (url.includes('/api/profile/getuserdata/testuser/')) {
                return Promise.resolve({ data: [mockProfile] });
            }
            if (url.includes("/api/profile/")) {
                return Promise.resolve({ data: mockMyProfile });
            }
            
            if (url.includes(`/api/profile/message/getmessages/3/`)) {
                return Promise.resolve({ data: mockMessages });
            }
            return Promise.reject(new Error('Not found'));
        })

        api.post.mockImplementation((url) => {
            if (url.includes(`/api/profile/message/1/2/`)) {
                return Promise.resolve(new Error('Convo Error'));
            }
            if (url.includes(`/api/profile/message/send/`)) {
                return Promise.resolve([{ messageID: "3", sender: "2", message: "Test Message" }],);
            }
            if (url.includes("/api/profile/message/createconvo/")) {
                return Promise.resolve(new Error('Convo Error'));
            }
            if (url.includes("/api/profile/message/setconvoparticipant/")) {
                return Promise.resolve({ status: 201, data: { success: true }});
            }
            return Promise.reject(new Error('Not found'));
        })
    
        render(
            <MemoryRouter>
                <MessagePage />
            </MemoryRouter>
        );
    
        // Simulate convoID effect
        await waitFor(() => {
            const newSocket = new WebSocket(`ws://127.0.0.1/ws/chat/3/`);
            expect(newSocket).toBeDefined();
            expect(newSocket.readyState).toBe(0); // WebSocket connecting state
        });
    })
});
