import api from "../api.js";
import "../styles/Home.css";
import "../styles/Profile.css";
import "../styles/Layout.css";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostDisplay from "../components/ProfilePostDisplay.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Menu from "../components/Menu.jsx";
import Footer from "../components/Footer.jsx";

export default function ProfileSearch() {
    console.log('hello')
    const { userchunk } = useParams();
    console.log(`hello again`)
    console.log(`userchunk: ${userchunk}`)
    const [results, setResults] = useState([]);
    const navigate = useNavigate();


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
            <SearchBar />
            <Footer />
            <div className="content">
                {userchunk !== undefined ? <h1>Results</h1> : <h1 data-cy="search-all">All Profiles</h1>}
                <ul>
                    {results.length > 0 ? results.map((profile) => {
                        return (
                            <li key={profile.username} data-cy="search-user">
                                <img className="friendlistimage" src={profile.profilePicture} alt="profile" />
                                <a href={`/profile/${profile.username}`}>{profile.username}</a>
                                <a href={`/profile/${profile.username}/message`}>
                                    <img className="friendlistimage" src="https://icons.veryicon.com/png/o/miscellaneous/official-icon-of-flying-pig/mailbox-82.png"></img>
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