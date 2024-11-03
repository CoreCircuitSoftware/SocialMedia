import api from "../api"
import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import MessageDisplay from "../components/MessageDisplay";
import "../styles/Message.css"

export default function MessagePage() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState([]);
    const [myProfile, setMyProfile] = useState([]);
    const [convoExists, setConvoExists] = useState([]);
    const [convoID, setConvoID] = useState([]);
    const [thisConvo, setThisConvo] = useState([]);
    const [curMessage, setCurMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const placeholderText = `Send a message to ${profile.displayName}`
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${convoID}/`);
        //const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/`);
        newSocket.onmessage = (e) => {
          const data = JSON.parse(e.data); 
          setMessages((prev) => {//[...prev, e.data]);
            if (!prev.some(messages => messages.messageID === data.messageID)) {
                return [...prev, data];
            }
            return prev;
        });
        };
        setSocket(newSocket);
        return () => newSocket.close();
      }, [convoID]);

    useEffect(() => {
        getProfile();
        getMyProfile()
    }, [])

    const getProfile = () => {
        api
            .get(`/api/profile/getuserdata/${username}/`)
            .then((res) => res.data)
            .then((data) => {
                setProfile(data[0])
            })
            .catch((err) => console.log(err));
    }

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => {
                setMyProfile(data)
            })
            .catch((err) => alert(err));
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
            .catch((error) => console.log("error.response.data"))
    }

    // const loadConvo = () => {
    //     api
    //         .post(`/api/profile/message/loadconvo/${convoID}/`)
    //         .then((res) => res.data)
    //         .then((data) => {
    //             setThisConvo(data[0])
    //         })
    // }

    const getMessages = () => {
        api
            .get(`/api/profile/message/getmessages/${convoID}/`)
            .then((res) => res.data)
            .then((data) => {
                setMessages(data)
            })
    }


    const handleSendMessage = async (event) => {
        event.preventDefault()
        try {
            const response = await api.post("/api/profile/message/send/", {
                  convo: convoID,
                  sender: myProfile.id,
                  message: curMessage 
                }, );
                const messageData = JSON.stringify(response.data)
                socket.send(messageData);
            }catch (error) {
                //console.error('Error sending message:', error.response ? error.response.data : error.message);
            }
        setCurMessage("")
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
        <main className="messages-page">
            <div className="title">
                {/* <div> { thisConvo.convoName && (
                    <h1>{thisConvo.convoName}</h1>)}
                </div> 
                <div> { !thisConvo.convoName && (
                    <h1>Your convo with {profile.username}</h1> )}
                </div>  */}
                <h1>Your convo with {profile.username}</h1>
            </div>
            
            <div className="message-holder" data-cy="message-holder">
                {messages.map((messages) =>
                <MessageDisplay message={messages} key={`${messages.messageID}`} />
                )}
            </div>
            { convoExists ? (
            <form onSubmit={handleSendMessage} className="message-input" data-cy="message-form">
                <input id="input-box"
                    className="form-input"
                    type="text"
                    value={curMessage}
                    onChange={(e) => setCurMessage(e.target.value)}
                    placeholder={placeholderText}
                    data-cy="message-input"
                />
                <button className="send-message" type="submit" data-cy="send-message">
                    Send Message
                </button>
            </form> )
            :  (
                <form data-cy="no-msg-user-before">
                    <h3>You have not messaged this user before</h3>
                    <h4>Begin here!</h4>
                    <button onClick={createConvo} type="submit">
                        Start your convo with {profile.username}!
                    </button>
                </form>
            )}
        </main> 
    )
}