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
    const { userchunk } = useParams();  // Get the username chunk from the URL
    console.log(`hello again`)
    console.log(`userchunk: ${userchunk}`)
    const [results, setResults] = useState([]);


    useEffect(() => {
        // console.log(`userChunk: ${userchunk} ; length ${userchunk.length}`)
        // api.get(`/api/search/profile/${userchunk}/`)
        //     .then((res) => {
        //         console.log(res.data);  // Log the response to see if data is correct
        //         setResults(res.data)
        //     })
        //     .catch((err) => console.log(err));

        if (userchunk !== undefined) {
            api.get(`/api/search/profile/${userchunk}/`)
                .then((res) => {
                    console.log(res.data);  // Log the response to see if data is correct
                    setResults(res.data)
                })
                .catch((err) => console.log(err));
        }
        else {
            api.get(`/api/search/profile/`)
                .then((res) => {
                    console.log(res.data);  // Log the response to see if data is correct
                    setResults(res.data)
                })
                .catch((err) => console.log(err));
        }
    }, [userchunk]);

    return (
        <main>
            <SearchBar />
            <Menu />
            <Footer />
            <div className="content">
                {userchunk !== undefined ? <h1>Results</h1> : <h1>All Profiles</h1>}
                <ul>
                    {results.length > 0 ? results.map((profile) => {
                        return (
                            <li key={profile.username}>
                                <img className="friendlistimage" src={profile.profilePicture} alt="profile" />
                                <a href={`/profile/${profile.username}`}>{profile.username}</a>
                                <a href={`/profile/${profile.username}/message`}>
                                    <img className="friendlistimage" src="https://icons.veryicon.com/png/o/miscellaneous/official-icon-of-flying-pig/mailbox-82.png"></img>
                                </a>
                            </li>
                        );
                    }) : (
                        <p>No Results found.</p>
                    )}
                </ul>
            </div>
        </main>
    );
}