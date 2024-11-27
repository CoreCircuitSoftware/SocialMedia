import { useState, useEffect } from "react"
import React from "react"
import api from "../api"
import logo from'../assets/csbutwhiteoutlined.png'
// import "../styles/Home.css"
import { useNavigate, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Grid2, Paper, Box } from "@mui/material";
import SearchBar from "../components/SearchBar";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import PostDisplay from "../components/ProfilePostDisplay.jsx";
import RecsDisplay from "../components/RecsDisplay.jsx";
import Avatar from '@mui/material/Avatar';

export default function Home() {
    const [posts, setPosts] = useState([])
    const [userRec, setUserRec] = useState([])
    const [myProfile, setMyProfile] = useState([]);

    useEffect(() => {
        getPostsSortByNew()
        getMyProfile();
    }, [])

    useEffect(() => {
        findUsersToDisplay()
    }, [myProfile])

    const getPostsSortByNew = () => {
        api
            .get("/api/posts/new/")
            .then((res) => res.data)
            .then((data) => {
                setPosts(data.reverse())
            })
            .catch((err) => alert(err))
    }

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => {
                setMyProfile(data)
            })
            .catch((err) => alert(err));
    };

    const findUsersToDisplay = () => {
        api.get(`/api/search/profile/`)
            .then((res) => {
                var userArr = new Array()
                var numUsers = res.data.length
                for (var i = 0, j = 1; i < 3 && i < numUsers - 1; i++) {
                    var randomNum = Math.floor(Math.random() * (numUsers + (j - i)))
                    if (res.data[randomNum] && ((!userArr.includes(res.data[randomNum], 0)) && (myProfile.id != res.data[randomNum].id))) {
                        userArr.push(res.data[randomNum])
                    }
                    else {
                        i--
                    }
                }
                setUserRec(userArr)
            })
            .catch((err) => console.log(err));
    }

    return (
        
        <Box sx={{ display: 'flex' }}>
        
            {/* Main Content */}
            <Box sx={{ flexGrow: 1, marginLeft: '250px', mt: 8 }}>
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
                {/* Sidebar Menu */}
                <Menu />


                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid2 container spacing={4}>
                        {/* Feed */}
                        <Grid2 item xs={12} md={8}>
                            {posts.map((post) => (
                                <PostDisplay post={post} key={post.postID} />
                            ))}
                        </Grid2>

                        {/* Right Sidebar */}
                        <Grid2 item xs={12} md={4} sx={{ paddingLeft: 20 }}>
                            <Paper elevation={3} sx={{ p: 3}}>
                                <Typography variant="h6" gutterBottom>
                                    Accounts suggested for you!
                                </Typography>
                                {userRec.map((rec) => (
                                    <RecsDisplay rec={rec} key={rec.id} />
                                ))}
                            </Paper>
                        </Grid2>
                    </Grid2>
                </Container>

                {/* Footer */}
                <Footer />
            </Box>
         </Box>
    );
}