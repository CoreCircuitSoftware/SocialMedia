import api from "../api.js";
import "../styles/Home.css";
import "../styles/Profile.css";
import "../styles/Layout.css";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PostDisplay from "../components/ProfilePostDisplay.jsx";
import SearchBar from "../components/SearchBar";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import logo from '../assets/csbutwhiteoutlined.png'

//Material Ui
// import Button from "../components/Button/Button";
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";

import { ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Container, Grid2, Paper, Box } from "@mui/material";
import theme from '../styles/theme';  // Import the custom theme
import ShareIcon from "@mui/icons-material/Share";
import CreateIcon from "@mui/icons-material/Create";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Avatar from '@mui/material/Avatar';



export default function UserProfileTest() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState([]);
    const [myProfile, setMyProfile] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [friendCount, setFriendCount] = useState(0);
    const [friendStatus, setFriendStatus] = useState('');
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [friendShipID, setFriendshipID] = useState();

    useEffect(() => {
        getProfile(); // Fetch profile of the user being viewed
        getMyProfile(); // Fetch current logged-in user's profile
    }, [username]);

    useEffect(() => {
        if (profile.id && myProfile.id) {
            if (profile.id === myProfile.id) {
                setIsMyProfile(true);
                getPendingFriendRequests();
            } else {
                setIsMyProfile(false);
            }
            getFriends();
            getPosts();
            checkFriendStatus();
        }
    }, [profile, myProfile]);

    const getProfile = () => {
        api
            .get(`/api/profile/getuserdata/${username}/`)
            .then((res) => res.data)
            .then((data) => {
                if (data && data.length > 0) {
                    setProfile(data[0]);
                } else {
                    console.error("No profile data found.");
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    navigate("/404");
                } else if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            })
    };

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => setMyProfile(data))
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    navigate("/404");
                } else if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            })
    };

    const getFriends = () => {
        api
            .get(`/api/friends/${profile.id}/`)
            .then((res) => res.data)
            .then((data) => {
                setFriends(data);
                setFriendCount(data.length); // Update the friend count
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    navigate("/404");
                } else if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            })
    };

    const handleAddFriend = () => {
        if (!profile.id || !myProfile.id) {
            console.error("Profile ID or MyProfile ID is not defined.");
            return;
        }
        api
            .post(`/api/friend-request/${profile.id}/`, {})
            .then(() => {
/*                 alert(`Friend request sent to ${profile.username}!`);
 */                setFriendStatus('pending');
            })
            .catch((err) => {
                console.error("Error sending friend request:", err);
            });
    };

    const handleAcceptFriendRequest = (requestID, accepted) => {
        api.put(`/api/friend-request/accept/${requestID}/`, { accepted })
            .then(() => {
/*                 alert(`Friend request ${accepted ? 'accepted' : 'declined'}!`);
 */                // Remove the processed request
                setFriendRequests((prevRequests) =>
                    prevRequests.filter((request) => request.requestID !== requestID)
                );
                if (accepted) {
                    getFriends(); // Update friends list
                    setFriendStatus('friends');
                } else {
                    setFriendStatus('none');
                }
            })
            .catch((err) => console.log("Error responding to friend request:", err));
    };

    const handleAcceptFriendRequestByButton = (accepted) => {
        // Find the friend request where user1 is the profile user and user2 is the current user
        const request = friendRequests.find(
            (req) => req.user1.id === profile.id && req.user2.id === myProfile.id
        );
        if (request) {
            handleAcceptFriendRequest(request.requestID, accepted);
        }
    };

    const checkFriendStatus = () => {
        console.log(`Profile ID: ${profile.id}`);  // Ensure this is a valid ID without extra characters
        api.get(`/api/friend-status/${profile.id}/`)
            .then((res) => res.data)
            .then((data) => {
                console.log('Friend status:', data.status); // Debugging log
                setFriendStatus(data.status);
                if (data.status === 'friends')
                    getFriendship();
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    navigate("/404");
                } else if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            })
    };

    const getFriendship = () => {
        api.get(`/api/friend/${myProfile.username}/${profile.username}/`)
            .then((res) => res.data)
            .then((data) => {
                console.log('FriendshipID: ', data.friendShipID)
                setFriendshipID(data.friendShipID)
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    navigate("/404");
                } else if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            })
    };


    const getPendingFriendRequests = () => {
        api.get(`/api/friend-requests/`)
            .then((res) => {
                setFriendRequests(res.data);
            })
            .catch((err) => console.log("Error fetching friend requests:", err));
    };

    const getPosts = () => {
        api
            .get(`/api/profile/posts/${profile.id}/`)
            .then((res) => res.data)
            .then((data) => setPosts(data.reverse())) // Display posts in reverse order
            .catch((err) => console.log("Error getting posts"));
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
        api.delete(`/api/friends/remove/${friendShipID}/`).then(getProfile())
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed">
                <Toolbar sx={{ display: 'flex', alignItems: 'center', width: '102%' }}>

                    {/* Logo - Aligned to the left */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 1 }}>
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
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                        <Link to={`/profile/${myProfile.username}`}> {/* Navigate to the user's profile */}
                            <Avatar
                                src={myProfile.profilePicture} // Path to the avatar image
                                alt={`${myProfile.username}'s Avatar`}
                                sx={{
                                    width: 55, // Adjust avatar size
                                    height: 55,
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
                        <img className="back-img" src={profile.backgroundImage} alt="background" data-cy="banner" />
                        <div className="profile-card">
                            <div className="card-upper">
                                <img className="pfp" src={profile.profilePicture} alt="profile" data-cy="pfp" />
                                <div className="names">
                                    <p className="display-name" data-cy="display-name">{profile.displayName} </p>
                                    <p className="username" data-cy="username">@{profile.username}</p>
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
                                                <Button variant='contained' startIcon={<AccountBoxIcon />} onClick={handleEdit} data-cy="edit">Edit</Button>
                                                <Button variant='contained' startIcon={<LogoutIcon />} onClick={handleLogout} color='error' data-cy="logout">Logout</Button>
                                            </Box>
                                        </ThemeProvider>
                                    ) : (
                                        <ThemeProvider theme={theme}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1, // Space between items, equivalent to 16px (8 * 2)
                                                }}
                                            >
                                            <Button className="edit-button" onClick={handleMessage}>Message</Button>
                                            {friendStatus === 'none' && (
                                            <Button className="edit-button" onClick={handleAddFriend}>Add Friend</Button>
                                            )}
                                            {friendStatus === 'pending' && (
                                                <p>Friend Request Sent</p>
                                            )}
                                            {friendStatus === 'pending_received' && (
                                                <div>
                                                    <ButtonGroup variant="contained" color='primary'>
                                                        <Button  onClick={() => handleAcceptFriendRequestByButton(true)}>Accept Friend Request</Button>
                                                        <Button color='error' onClick={() => handleAcceptFriendRequestByButton(false)}>Decline</Button>
                                                    </ButtonGroup>
                                                </div>
                                            )}
                                            {friendStatus === 'friends' && (
                                                <Button color='error' className="logout-button" onClick={handleRemoveFriend} >Remove Friend</Button>
                                            )}
                                            </Box>
                                            </ThemeProvider>
                                    )}
                                    <div className="friends-count">
                                        <p onClick={handleViewFriends} data-cy="friends">Friends {friendCount}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bio" data-cy="bio"  style={{fontSize: '20px'}}>{profile.bio}</div>

                            {/* Display Pending Friend Requests */}
                            {isMyProfile && friendRequests.length > 0 && (
                                <div className="friend-requests">
                                    <h3>Pending Friend Requests</h3>
                                    {friendRequests.map(request => (
                                        <div key={request.requestID}>
                                            <p>{request.user1.username} has sent you a friend request!</p>
                                            <ButtonGroup variant="contained" color='primary'>
                                                <Button  onClick={() => handleAcceptFriendRequest(request.requestID, true)}>Accept</Button>
                                                <Button color='error' onClick={() => handleAcceptFriendRequest(request.requestID, false)}>Decline</Button>
                                            </ButtonGroup>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {(posts.length > 0) ? (
                                <div className="post-holder" data-cy="posts">
                                    {posts.map((post) => <PostDisplay post={post} curUser={myProfile} key={post.postID} />)}
                                </div>
                            ) : (
                                <h3 data-cy="user-no-posts">{username} hasn't made any posts yet</h3>
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            </Box>
        </Box>
    );
}
