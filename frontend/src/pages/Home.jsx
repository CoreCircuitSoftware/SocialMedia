import { useState, useEffect } from "react"
import React from "react"
import api from "../api"
// import "../styles/Home.css"
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Grid2, Paper, Box } from "@mui/material";
import SearchBar from "../components/SearchBar";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import PostDisplay from "../components/ProfilePostDisplay.jsx";
import RecsDisplay from "../components/RecsDisplay.jsx";

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
            {/* Sidebar Menu */}
            <Menu />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, marginLeft: '250px', mt: 8 }}>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 2, marginRight: 3 }}>
                            CircuitSocial
                        </Typography>
                        <SearchBar />
                    </Toolbar>
                </AppBar>

                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid2 container spacing={4}>
                        {/* Feed */}
                        <Grid2 item xs={12} md={8}>
                            {posts.map((post) => (
                                <PostDisplay post={post} key={post.postID} />
                            ))}
                        </Grid2>

                        {/* Right Sidebar */}
                        <Grid2 item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Check out these accounts!
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