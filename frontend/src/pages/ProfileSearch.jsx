import api from "../api.js";
import "../styles/Home.css";
import "../styles/Profile.css";
import "../styles/Layout.css";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PostDisplay from "../components/ProfilePostDisplay.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Menu from "../components/Menu.jsx";
import Footer from "../components/Footer.jsx";
import logo from '../assets/csbutwhiteoutlined.png'
import Avatar from '@mui/material/Avatar';
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function ProfileSearch() {
    console.log('hello')
    const { userchunk } = useParams();
    console.log(`hello again`)
    console.log(`userchunk: ${userchunk}`)
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const [myProfile, setMyProfile] = useState(null); // Local state for profile



    useEffect(() => {
        if (userchunk !== undefined) {
            api.get(`/api/search/profile/${userchunk}/`)
                .then((res) => {
                    console.log(res.data);
                    setResults(res.data)
                })
                .catch((err) => {
                    if (err.response && err.response.status === 404) {
                        navigate("/404");
                    } else if (err.response && err.response.status === 401) {
                        navigate("/login");
                    } else {
                        alert(err);
                    }
                })
        }
        else {
            api.get(`/api/search/profile/`)
                .then((res) => {
                    console.log(res.data);
                    setResults(res.data)
                })
                .catch((err) => {
                    if (err.response && err.response.status === 404) {
                        navigate("/404");
                    } else if (err.response && err.response.status === 401) {
                        navigate("/login");
                    } else {
                        alert(err);
                    }
                })
        }
    }, [userchunk]);

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
                </Toolbar>
            </AppBar>

            {/* Side Menu */}
            <Menu />
            <Footer />
            <div className="content" style={{ transform: "translateY(55px)"}}>
                {userchunk !== undefined ? <h1 style={{transform: "translateX(40px)"}}>Results</h1> : <h1 data-cy="search-all">All Profiles</h1>}
                <ul>
                    {results.length > 0 ? results.map((profile) => {
                        return (
                            <li key={profile.username}  style={{width: '300px', height: '75px'}} data-cy="search-user">
                                <img className="friendlistimage" style={{transform: "translateY(-5px)", marginLeft: '5px'}} src={profile.profilePicture} alt="profile" />
                                <a href={`/profile/${profile.username}`} style={{width: '0px', transform: "translateY(-15px)"}}>{profile.username}</a>
                                <a href={`/profile/${profile.username}/message`}>
                                    <img className="friendlistimage" style={{transform: "translateX(155px)"}} src="https://icons.veryicon.com/png/o/miscellaneous/official-icon-of-flying-pig/mailbox-82.png"></img>               
                                </a>
                            </li>
                        );
                    }) : (
                        <p data-cy="no-results">No Results found.</p>
                    )}
                </ul>
            </div>
        </main>
    );
}