import api from "../api.js";
import "../styles/community.css";
import "../styles/Profile.css";
import "../styles/Layout.css";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PostDisplay from "../components/ProfilePostDisplay.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Menu from "../components/Menu.jsx";
import Footer from "../components/Footer.jsx";
import logo from'../assets/csbutwhiteoutlined.png'


//Material Ui
// import Button from "../components/Button/Button";
import Button from "@mui/material/Button";

import { ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Container, Grid2, Paper, Box } from "@mui/material";
import theme from '../styles/theme.js';  // Import the custom theme
import ShareIcon from "@mui/icons-material/Share";
import CreateIcon from "@mui/icons-material/Create";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Avatar from '@mui/material/Avatar';



export default function CommunityTest() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState([]);
    const [community, setCommunity] = useState([]);
    const { communityname } = useParams();
    console.log("Community Name:", communityname);
    const [myProfile, setMyProfile] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isMyProfile, setIsMyProfile] = useState(false);


    useEffect(() => {
        getCommunity();
        getMyProfile(); // Fetch current logged-in user's profile
        

    }, [communityname, username]);

    useEffect(() => {
        getPosts();
        if (profile.id && myProfile.id) {
            if (profile.id === myProfile.id) {
                setIsMyProfile(true);
            } else {
                setIsMyProfile(false);
            }
            getPosts();

        }
    }, [profile, myProfile]);


    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => setMyProfile(data))
            .catch((err) => alert(err));
    };
    
    const getCommunity = () => {
        api
            .get(`api/community/getdata/${communityname}/`)

            .then((res) => res.data)
            .then((data) => setCommunity(data))
            .catch((err) => alert(err));
            
    };

    const getPosts = () => {
        api
            .get(`/api/posts/community/${community.communityID}/`)
            .then((res) => res.data)
            .then((data) => setPosts(data.reverse())) // Display posts in reverse order
            .catch((err) => console.log("Error getting posts"));
            console.log("getting posts")
    };

    const handleEdit = () => navigate("/profile/edit");
    const handleLogout = () => navigate("/logout");
    const handlePostCreate = () => navigate("/post/create");
    const handleMessage = () => navigate(`/profile/${profile.username}/message`);
    const handleViewFriends = () => navigate(`/profile/${profile.username}/friends`);
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(`http://circuitsocial.tech/profile/${profile.username}`);
            // alert("Copied");
            console.log('Profile link copied')
        } catch (err) {
            console.log('Error copying profile link')
        }
    }

    const handleRemoveFriend = () => {
        if (window.confirm("Remove Friend?")) {
            api.delete(`/api/friends/remove/${friendShipID}/`).then(getProfile())
        }
    }
    console.log("community id: ", community.communityID)
    return (
        <Box sx={{ display: 'flex'}}> 
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

            <Box sx={{ flexGrow: 1, marginLeft: '300px', mt: 8 }}> 
               
                <div className="content">
                    <div className="profile-top">
                        <img className="back-img" src= "https://django-s3-4800.s3.us-east-2.amazonaws.com/post_images/background_pG2GYnu.jpg" alt="background" data-cy="banner" />
                        <div className="profile-card">
                            <div className="card-upper">
                                <img className="pfp" src={community.iconURL} alt="profile" data-cy="pfp" />
                                <div className="names">
                                    <p className="display-name" data-cy="display-name">{community.name} </p>
                                   
                                </div>
                                <div className="buttons">
                                    {isMyProfile ? (
                                        <ThemeProvider theme={theme}>
                                            <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1, // Space between items, equivalent to 16px (8 * 2)
                                        }}
                                        >
                                            <Button variant='contained' color='primary' startIcon={<ShareIcon />} onClick={handleShare} data-cy="share">Share</Button>
                                            <Button variant='contained' startIcon={<CreateIcon />} onClick={handlePostCreate} data-cy="create-post">Create Post</Button>
                                            <Button variant='contained' startIcon={<LogoutIcon />} onClick={handleLogout} data-cy="logout">Logout</Button>
                                            <Button variant='contained' startIcon={<AccountBoxIcon />} onClick={handleEdit} data-cy="edit">Edit</Button>
                                        </Box>
                                        </ThemeProvider>
                                    ) : (
                                        <div>
                                            
                                        </div>
                                    )}
                                    <div className="friends-count">
                                    </div>
                                </div>
                            </div>

                            <div className="bio" data-cy="bio" >{community.description}</div>
                        
                        {(true) ? (
                            <div className="post-holder" data-cy="posts">
                                {posts.map((post) => <PostDisplay post={post} curUser={myProfile} key={post.postID} />)}
                            </div>
                            ) : (
                                <h3 data-cy="user-no-posts">{communityname} is empty, be the first to post!?</h3>
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            </Box>
        </Box>
    );
}
