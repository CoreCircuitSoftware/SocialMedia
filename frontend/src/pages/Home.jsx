import { useState, useEffect } from "react"
import React from "react"
import api from "../api"
import "../styles/Home.css"
import { useNavigate } from "react-router-dom";
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
                console.log(userArr)
                setUserRec(userArr)
            })
            .catch((err) => console.log(err));
    }

    return (
        <main>
            <SearchBar />
            <Menu />
            <Footer />
            <div className="feed-center">
                <div className="post-holder">
                    {posts.map((post) => <PostDisplay post={post} key={post.postID} />)}
                </div>
            </div>
            <div className="recs">
                <h2>Check out these accounts!</h2>
                <div>
                    {userRec.map((rec) => <RecsDisplay rec={rec} key={rec.id} />)}
                </div>
            </div>
        </main>
    );
}