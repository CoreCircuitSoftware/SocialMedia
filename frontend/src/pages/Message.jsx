import api from "../api"
import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, Link } from "react-router-dom";
import MessageDisplay from "../components/MessageDisplay";
import MessageListPage from "./MessageList";
import "../styles/Message.css"
import SearchBar from "../components/SearchBar";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

import logo from '../assets/csbutwhiteoutlined.png'
import Avatar from '@mui/material/Avatar';
import { AppBar, Toolbar, Typography, Container, Grid2, Paper, Box } from "@mui/material";

export default function MessagePage() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState([]);
    const [myProfile, setMyProfile] = useState([]);
    const [otherUser, setOtherUser] = useState();
    const [convoExists, setConvoExists] = useState([]);
    const [convoID, setConvoID] = useState([]);
    const [selected, setSelected] = useState(false);
    const [curMessage, setCurMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const placeholderText = `Send a message to ${profile.displayName}`
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const [socket, setSocket] = useState(null);
    const baseURL = import.meta.env.VITE_MESSAGE_URL

    useEffect(() => {
        if (!convoID || convoID.length === 0) {
            console.warn("WebSocket connection aborted: convoID is undefined or empty.");
            return;
        }

        console.log("Initializing WebSocket with convoID:", convoID); // Debugging

        const newSocket = new WebSocket(`wss://${baseURL}/ws/chat/${convoID}/`);
        newSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prev) => {
                if (!prev.some((message) => message.messageID === data.messageID)) {
                    return [...prev, data];
                }
                return prev;
            });
        };

        newSocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                console.log("Closing WebSocket connection.");
                newSocket.close();
            }
        };
    }, [convoID]);

    useEffect(() => {
        if (username) {
            setSelected(true)
            getProfile();
        } else {
            setSelected(false)
        }
        getMyProfile()
    }, [])

    const getProfile = () => {
        api
            .get(`/api/profile/getuserdata/${username}/`)
            .then((res) => res.data)
            .then((data) => {
                setProfile(data[0])
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    alert(err);
                }
            })
    }

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => {
                setMyProfile(data)
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    alert(err);
                }
            })
    }


    const checkIfConvo = () => {
        api
            .post(`/api/profile/message/${profile.id}/${myProfile.id}/`)
            .then((res) => res.data)
            .then((data) => {
                if (data) {
                    setConvoExists(true)
                    setConvoID(data)
                } else {
                    setConvoExists(false)
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    alert(err);
                }
            })
    }

    const addParticipant = (participant, newConvoID) => {
        try {
            api
                .post("/api/profile/message/setconvoparticipant/", {
                    user: participant,
                    convo: newConvoID
                })
        } catch (error) {
            console.error('Error adding participants:', error.response ? error.response.data : error.message)
        }
    }

    const navigateBackHere = async () => {
        await delay(250);
        window.location.reload();
    }

    const createConvo = async (event) => {
        event.preventDefault()
        api
            .post("/api/profile/message/createconvo/")
            .then((res) => res.data)
            .then((data) => {
                setConvoID(data.convoID)
                addParticipant(myProfile.id, data.convoID)
                addParticipant(profile.id, data.convoID)
                navigateBackHere();
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    alert(err);
                }
            })
    }


    const getMessages = () => {
        api
            .get(`/api/profile/message/getmessages/${convoID}/`)
            .then((res) => res.data)
            .then((data) => {
                setMessages(data)
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    alert(err);
                }
            })
    }


    const handleSendMessage = async (event) => {
        event.preventDefault()
        try {
            const response = await api.post("/api/profile/message/send/", {
                convo: convoID,
                sender: myProfile.id,
                message: curMessage
            },);
            const messageData = JSON.stringify(response.data)
            socket.send(messageData);
        } catch (error) {
            //console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
        setCurMessage("")
    }

    const handleConvoSelection = (chosenConvo) => {
        setConvoID(chosenConvo)
        setSelected(true)
    }

    const displayOtherUser = (clickedUser) => {
        //username = ""
        setOtherUser(clickedUser)
    }

    useEffect(() => { //check if both user's have been found yet
        if (profile.id && myProfile.id) {
            checkIfConvo()
        }
    }, [profile, myProfile]);

    useEffect(() => {
        if (convoID > 0) {
            getMessages()
        }
    }, [convoID])

    return (
        <main>
            {/* Upper Bar */}
            <AppBar position="fixed">
                <Toolbar sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {/* Logo - Aligned to the left */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 1 }}>
                        <Link to="/home">
                            <img
                                src={logo} // Path to your logo
                                alt="Logo"
                                style={{
                                    width: 85,
                                    height: 60,
                                    marginRight: '1px',
                                    cursor: 'pointer',
                                }}
                            />
                        </Link>
                    </Box>

                    {/* Centered Text and SearchBar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Typography variant="h6" sx={{ textAlign: 'center', marginRight: 1 }}>
                            CircuitSocial
                        </Typography>
                        <SearchBar />
                    </Box>

                    {/* Avatar - Aligned to the right */}
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                        <Link to={`/profile/${myProfile.username}`}>
                            <Avatar
                                src={myProfile.profilePicture}
                                alt={`${myProfile.username}'s Avatar`}
                                sx={{
                                    width: 55,
                                    height: 55,
                                    cursor: 'pointer',
                                    marginRight: 3,
                                }}
                            />
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Side Menu */}
            <Menu />
            <MessageListPage onConvoSelect={handleConvoSelection} getOtherUser={displayOtherUser}/>
            {/* Main Content */}
            <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '80px', // Adjust for AppBar height
                marginLeft: '340px', // Adjust for Menu width
                padding: '20px',
                //boxSizing: 'border-box',
                height: '80dvh',//'calc(100vh - 225px)', // Full height minus AppBar
                width: '500px', // Full width minus Menu
                overflow: 'hidden,',
                border: '2px solid white', // Add white border
                        }}>
            <Box
                sx={{
/*                     display: 'flex',
                    flexDirection: 'column',
                    marginTop: '80px', // Adjust for AppBar height
                    marginLeft: '340px', // Adjust for Menu width
                    padding: '20px',
                    boxSizing: 'border-box',
                    height: 'calc(100vh - 225px)', // Full height minus AppBar
                    width: '500px', // Full width minus Menu
                    overflow: 'hidden,',
                    border: '2px solid white', // Add white border */

                }}
            >
                {selected ? (
                <div className="messages-page" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="title">
                        {/* Show conversation title */}
                        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', display: 'block', whiteSpace: 'normal', wordBreak: 'normal' }}>
                            {(username)  ? (
                                <>Your convo with {username}</>
                                ) : (
                                <>Your convo with {otherUser}</>
                                )}
                            
                        </Typography>
                    </div>

                    {/* Messages */}
                    <div
                        className="message-holder"
                        data-cy="message-holder"
                        style={{
                            flex: 1, // Allow the message holder to grow and fill available space
                            overflowY: 'auto', // Enable scrolling if messages overflow
                            padding: '50px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0px', // Add spacing between messages
                            wordBreak: 'break-word', // Break long words
                            // marginBottom: '0px',
                            maxHeight: "45dvh",
                            width: '400px',
                        }}
                    >
                        {messages.map((message) => (
                            <div
                                key={`${message.messageID}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: message.sender === myProfile.id ? 'flex-end' : 'flex-start', // Align messages correctly
                                    width: '100%', // Make sure the message takes the full width of the container
                                }}
                            >
                                <MessageDisplay
                                    key={`${message.messageID}`}
                                    message={message}
                                    myProfileId={myProfile.id}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    {convoExists ? (
                        <form
                            onSubmit={handleSendMessage}
                            className="message-input"
                            data-cy="message-form"
                            style={{
                                display: 'flex',
                                // alignItems: 'center',
                                gap: '10px', // Add spacing between input and button
                                padding: '0px',
                                boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
                                borderRadius: '5px',
                                width: '-webkit-fill-available',
                                marginTop: "65vh",
                                position: "absolute",
                                height: "15dvh"
                            }}
                        >
                            <input
                                id="input-box"
                                className="form-input"
                                type="text"
                                value={curMessage}
                                onChange={(e) => setCurMessage(e.target.value)}
                                placeholder="Type your message..."
                                data-cy="message-input"
                                style={{
                                    //flex: 1, // Make the input box grow to fill space
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    outline: 'none',
                                    width: '-webkit-fill-available',
                            
                                }}
                            />
                            <button
                                className="send-message"
                                type="submit"
                                data-cy="send-message"
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007BFF',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    
                                }}
                            >
                                Send Message
                            </button>
                        </form>
                    ) : (
                        <form data-cy="no-msg-user-before" style={{ textAlign: 'center', width: '110%' }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                You have not messaged this user before
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Begin here!
                            </Typography>
                            <button
                                onClick={createConvo}
                                type="submit"
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007BFF',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Start your convo with {profile.username}!
                            </button>
                        </form>
                    )}
                </div>
                ) : (
                    <div className="messages-page" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="title">
                            {/* Show conversation title */}
                            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', display: 'block', whiteSpace: 'normal', wordBreak: 'normal' }}>
                                Select a conversation to start chatting!
                            </Typography>
                        </div>
                    </div>
                )}
            </Box>
            </div>
            {/* Footer */}
            {/* <Footer /> */}
        </main>
    )
}