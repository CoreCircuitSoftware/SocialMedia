import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate, Link } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
// import "../styles/PostProfile.css"
import MessageListDisplay from "../components/MessageListDisplay";
import "../styles/MessageListDisplay.css"
import SearchBar from "../components/SearchBar";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

import logo from '../assets/csbutwhiteoutlined.png'
import Avatar from '@mui/material/Avatar';
import { AppBar, Toolbar, Typography, Container, Grid2, Paper, Box } from "@mui/material";

export default function MessageListPage({onConvoSelect}) {
    const [myProfile, setMyProfile] = useState([]);
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => setMyProfile(data))
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    //alert(err);
                }
            })
    };

    const findConvos = () => {
        api
            .get(`/api/message/findconvos/${myProfile.id}/`)
            .then((res) => res.data)
            .then((data) => setConversations(data))
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    //alert(err);
                }
            })
    }

    useEffect(() => {
        if (myProfile) {
            findConvos()
        }
    }, [myProfile])

    useEffect(() => {
        getMyProfile()
    }, [])

    return (
        <main>
            {/* Main Content */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '50px', // Adjust to match the height of the AppBar
                    marginLeft: '380px', // Adjust to match the width of the Menu
                    boxSizing: 'border-box',
                    height: 'calc(100vh - 230px)', // Full height minus AppBar
                    justifyContent: conversations.length === 0 ? 'center' : 'flex-start', // Center if no conversations
                    alignItems: 'center', // Center horizontally
                   
                }}
            >
                <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center', marginTop: '20px' }}>
                        Your Conversations:
                </Typography>

                <div className="MessageListPage">
                    <div
                        style={{
                            
                        }}
                    >
                        {conversations.length > 0 ? (
                            <div>
                                {conversations.map((convo) => (
                                    <div key={convo.convo}>
                                        <MessageListDisplay 
                                          convo={convo} 
                                          myProfile={myProfile} 
                                          onConvoSelect={onConvoSelect} 
                                          style={{
                                            
                                          }}
                                          />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%', // Center within the available space
                                }}
                            >
                                <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 40 }}>
                                    No Conversations :(
                                </Typography>
                            </Box>
                        )}
                    </div>
                </div>
            </Box>


            {/* Footer */}
            <Footer />
        </main>
    )
}