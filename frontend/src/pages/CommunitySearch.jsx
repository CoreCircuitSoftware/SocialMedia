import { useState, useEffect } from "react"
import React from "react"
import api from "../api"
import logo from'../assets/csbutwhiteoutlined.png'
import "../styles/Home_Community.css"
import { useNavigate, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Grid2, Paper, Box } from "@mui/material";
import SearchBar from "../components/SearchBar";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import PostDisplay from "../components/ProfilePostDisplay.jsx";
import RecsDisplay from "../components/RecsDisplay.jsx";
import Avatar from '@mui/material/Avatar';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GradeIcon from '@mui/icons-material/Grade';
import Button from '@mui/material/Button';
import CommunityTest from "./Community"

export default function Home() {
    const [posts, setPosts] = useState([])
    const [userRec, setUserRec] = useState([])
    const [myProfile, setMyProfile] = useState([]);
    const [sort, setSort] = useState("friends")
    const [friends, setFriends] = useState([])
    const [CommMember, setMembership] = useState([])
    const [loading, setLoading] = useState(true)
    const {Communty, setCommunity} = useState([])
    const delay = ms => new Promise(res => setTimeout(res, ms))

    useEffect(() => {
        getMyProfile();
    }, [])

    useEffect(() => {
        findUsersToDisplay()
    }, [myProfile])

    useEffect(() => {
        
        if (sort == "friends" && myProfile.id) {
            fetchFriends()
            fetchMyCommunities()
            getCommunities()
        } else if (sort == "new") {
            getPostsSortByNew()
        }
    }, [sort, myProfile])

    useEffect(() => {
        handleFriendsPosts()
    }, [friends])


    useEffect(() => {
        if (sort == "friends" && posts.length > 0) {
            posts.sort((a, b) => (b.postID) - (a.postID))
        }
    }, [posts])

    const handleFriendsPosts = async () => {
        if (friends.length > 0) {
            friends.map((friend) => {
                const friendID = friend.user1.id === myProfile.id ? friend.user2 : friend.user1;
                getPostFromUser(friendID.id)
            })
            setLoading(false)
        } else {
            await delay(1500)
            setLoading(false)
        }
    }

    const getPostsSortByNew = () => {
        api
            .get("/api/posts/community/new/")
            .then((res) => res.data)
            .then((data) => {
                setPosts(data.reverse())
            })
            .catch((err) => alert(err))
            .finally(() => setLoading(false))
    }

    const fetchFriends = () => { 
        api.get(`/api/friends/${myProfile.id}/`)
            .then((res) => {
            setFriends(res.data)
        })
        .catch((err) => console.log(err));
    }

    const fetchMyCommunities = () => { 
        api
            .get(`/api/communitymember/${myProfile.id}/`)
            .then((res) => {
            setMembership(res.data)
        })
        .catch((err) => console.log(err));

        console.log(myProfile.id)
    }
    const getCommunities = () => {
        api 
            .get(`/api/community/getdataid/${CommMember.community_id}/`)
            .then((res) => {
            setCommunity(res.data)
            
        })


    }

    const getPostFromUser = (friendID) => {
        api
            .get(`/api/profile/posts/${friendID}/`)
            .then((res) => res.data)
            .then((data) => {
                setPosts((prev) => {
                    const newPosts = data.reverse().filter(post => !prev.some(existingPost => existingPost.postID === post.postID));
                    return [...prev, ...newPosts.reverse()];
                });
            })
            .catch((err) => console.log("Error getting posts"));
    };

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

    const handleSort = (sortOption) => {
        if (sort == sortOption) {
            return
        } else if (sortOption == "new") {
            setLoading(true)
            setPosts([])
            setSort("new")
        } else if (sortOption == "friends") {
            setLoading(true)
            setPosts([])
            setSort("friends")
        }
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
                            <div className="feed-center">
                                { loading ? (<h1>Loading...</h1>) : (
                                <div> 
                                    {sort == "friends" ? (<h1>Home - My Communities</h1>) : (<h1>Home - New Community Posts</h1>)}
                                    <div className="sort">
                                        <Button variant='contained' color='primary' startIcon=<PeopleAltIcon /> onClick={() => handleSort("friends")}>Followed</Button>
                                        <Button variant='contained' color='primary' startIcon=<GradeIcon /> onClick={() => handleSort("new")}>New</Button>
                                    </div>
                                    <div className="post-holder">
                                        
                                        {posts.map((post) => <PostDisplay post={post} key={post.postID} />)}
                                        {posts.length == 0 ? (<h1>No posts found</h1>) : null}
                                    </div>
                                </div>
                                )}
                            </div>
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