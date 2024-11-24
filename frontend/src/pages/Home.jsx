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
    const [sort, setSort] = useState("friends")
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(true)
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
            .get("/api/posts/new/")
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
        <main>
            <SearchBar />
            <Menu />
            <Footer />
            <div className="feed-center">
                { loading ? (<h1>Loading...</h1>) : (
                <div>
                    {sort == "friends" ? (<h1>Home - Friend's posts</h1>) : (<h1>Home - New posts</h1>)}
                    <div className="sort">
                        <button onClick={() => handleSort("friends")}>Friends</button>
                        <button onClick={() => handleSort("new")}>New</button>
                    </div>
                    <div className="post-holder">
                        {posts.map((post) => <PostDisplay post={post} key={post.postID} />)}
                        {posts.length == 0 ? (<h1>No posts found</h1>) : null}
                    </div>
                </div>
                )}
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