import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";  
import Menu from '../components/Menu'; 
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer'; 
import '../styles/FriendsList.css'
import logo from'../assets/csbutwhiteoutlined.png'
import Avatar from '@mui/material/Avatar';
import { AppBar, Toolbar, Typography, Container, Grid2, Paper, Box } from "@mui/material";

export default function FriendsList() {
    const { username } = useParams();  // Get the username from the URL
    const [friends, setFriends] = useState([]);
    const [userId, setUserId] = useState(null);
    const [myProfile, setMyProfile] = useState([]);

    useEffect(() => {
        // Fetch profile ID based on username
        api.get(`/api/profile/getuserdata/${username}/`)
            .then((res) => res.data)
            .then((data) => {
                if (data && data.length > 0) {
                    setUserId(data[0].id);
                } else {
                    console.error("No profile data found.");
                }
            })
            .catch((err) => console.log(err));
    }, [username]);

    useEffect(() => {
        // Fetch friends once userId is set
        if (userId) {
            api.get(`/api/friends/${userId}/`)
                .then((res) => {
                    console.log(res.data); 
                    setFriends(res.data)
                })
                .catch((err) => console.log(err));
        }
    }, [userId]);
    useEffect(() => {
        getMyProfile();
    }, [])

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => {
                setMyProfile(data)
            })
            .catch((err) => alert(err));
    }
    
    return (
        <main>
           <AppBar position="fixed">
                <Toolbar sx={{ display: 'flex', alignItems: 'center', width: '102%' }}>

                    {/* Logo - Aligned to the left */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 1}}>
                        <Link to="/home"> {/* Redirect to the home page */}
                            <img
                                src={logo} // Path to your logo
                                alt="Logo"
                                style={{
                                    width: 85,  // Adjust size of the logo
                                    height: 60,
                                    marginRight: '1px',
                                    cursor: 'pointer', // Make it clear that the logo is clickable
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
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center'}}>
                        <Link to={`/profile/${myProfile.username}`}> {/* Navigate to the user's profile */}
                            <Avatar
                                src={myProfile.profilePicture} // Path to the avatar image
                                alt={`${myProfile.username}'s Avatar`}
                                sx={{
                                    width: 40, // Adjust avatar size
                                    height: 40,
                                    cursor: 'pointer', // Make it clickable
                                    marginRight: 3, // Add space between avatar and username
                                }}
                            />
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>
            <Menu />
            
            <div className="content">
                <h1>{username}'s Friends</h1>
                <ul>
                    {friends.length > 0 ? friends.map((friend) => {
                        const friendUser = friend.user1.id === userId ? friend.user2 : friend.user1;
                        console.log(friendUser);
                        return (
                            <li key={friend.friendShipID}>
                                <img className="friendlistimage" src={friendUser.profilePicture} alt="profile" />
                                <a href={`/profile/${friendUser.username}`}>{friendUser.username}</a>
                                <a href={`/profile/${friendUser.username}/message`}>
                                    <img className="friendlistimage" src="https://icons.veryicon.com/png/o/miscellaneous/official-icon-of-flying-pig/mailbox-82.png"></img>
                                </a>
                            </li>
                        );
                    }) : (
                        <p>No friends found.</p>
                    )}
                </ul>
            </div>
            <Footer />
        </main>
    );    
}

