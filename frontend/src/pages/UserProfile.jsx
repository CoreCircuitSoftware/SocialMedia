import api from "../api.js"
import "../styles/Home.css"
import "../styles/Profile.css"
import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import PostDisplay from "../components/ProfilePostDisplay.jsx"

export default function UserProfileTest() {
    const { username } = useParams();

    const navigate = useNavigate();
    const postType = 1; //post type 1=user posts
    const [profile, setProfile] = useState([]);
    const [myProfile, setMyProfile] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isMyProfile, setIsMyProfile] = useState(false);

    useEffect(() => {
        getProfile();
        getMyProfile()
    }, [])

    const getProfile = () => {
        api
            .get(`/api/profile/getuserdata/${username}/`)
            .then((res) => res.data)
            .then((data) => {
                // console.log(data[0])
                setProfile(data[0])
            })
            .catch((err) => console.log(err));
    }

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => {
                // console.log(data)
                setMyProfile(data)
            })
            .catch((err) => alert(err));
    }

    useEffect(() => {
        getPosts()  
    }, [profile]);

    const getPosts = () => {
        api
        .get(`/api/profile/posts/${profile.id}/`)
        .then((res) => res.data)
        .then((data) => {
            setPosts(data.reverse());
        })
        .catch((err) => console.log("Error getting posts"))
    }

    useEffect(() => {
        if (profile.id && (profile.id == myProfile.id)) {
            setIsMyProfile(true)
        }
    }, [profile, myProfile]);

    const handleEdit = () => {
        navigate("/profile/edit")
    }
    const handleLogout = () => {
        navigate("/logout")
    }
    const handlePostCreate = () => {
        navigate("/post/create")
    }

    return (
        <main>
            <div className="profile-top">
                <img className="back-img" src={profile.backgroundImage} />
                <div className="profile-card">
                    <div className="card-upper">
                        <img className="pfp" src={profile.profilePicture} />
                        <div className="names">
                            <p className="display-name">{profile.displayName}</p>
                            <p className="username">{profile.username}</p>
                        </div> { isMyProfile && (
                        <div className="buttons">
                            <button className="logout-button" type="button" onClick={handlePostCreate}>Create Post</button>
                            <button className="logout-button" type="button" onClick={handleLogout}>Logout</button>
                            <button className="edit-button" type="button" onClick={handleEdit}>Edit</button> 
                        </div> )}
                    </div>
                    <div className="bio">{profile.bio}</div>
                    <div className="post-holder">
                        {posts.map((post) => 
                            <PostDisplay post={post} profile={profile} key={post.postID} />
                        )}
                    </div>
                </div>
            </div>
            <footer>
                <p>© 2024 Core Circuit Software&emsp;</p>
                <br/>
                <a href="https://corecircuitsoftware.github.io">About us</a>
            </footer>
        </main>
    );
}

// import api from "../api.js"
// import "../styles/Home.css"
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Profile.css"
// import PostDisplay from "../components/ProfilePostDisplay.jsx"

// function UserProfile() {
//     const navigate = useNavigate();
//     const postType = 1; //post type 1=user posts
//     const [profile, setProfile] = useState([]);
//     const [posts, setPosts] = useState([])

//     useEffect(() => {
//         getProfile();
//     }, [])

//     const getProfile = () => {
//         api
//             .get(`/api/profile/`)
//             .then((res) => res.data)
//             .then((data) => {
//                 //console.log(data)
//                 setProfile(data)
//             })
//             .catch((err) => alert(err));
//     }
//     const handleEdit = () => {
//         navigate("/edit-profile")
//     }
//     const handleLogout = () => {
//         navigate("/logout")
//     }
//     const handlePostCreate = () => {
//         navigate("/create-post/")
//     }

//     useEffect(() => {
//         getPosts()  
//     }, [profile]);

//     const getPosts = () => {
//         api
//         .get(`/api/profile/posts/${profile.id}/`)
//         .then((res) => res.data)
//         .then((data) => {
//             setPosts(data.reverse());
//             // console.log("test")
//             // console.log(data.reverse())
//         })
//         .catch((err) => console.log("err"))
//     }

//     return (
//         <main>
//             <div className="profile-top">
//                 <img className="back-img" src={profile.backgroundImage} />
//                 <div className="profile-card">
//                     <div className="card-upper">
//                         <img className="pfp" src={profile.profilePicture} />
//                         <div className="names">
//                             <p className="display-name">{profile.displayName}</p>
//                             <p className="username">{profile.username}</p>
//                         </div>
//                         <div className="buttons">
//                             <button className="logout-button" type="button" onClick={handlePostCreate}>Create Post</button>
//                             <button className="logout-button" type="button" onClick={handleLogout}>Logout</button>
//                             <button className="edit-button" type="button" onClick={handleEdit}>Edit</button>
//                         </div>
//                     </div>
//                     <div className="bio">{profile.bio}</div>
//                     <div className="post-holder">
//                         {posts.map((post) => 
//                             <PostDisplay post={post} profile={profile} key={post.postID} />
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <footer>
//                 <p>© 2024 Core Circuit Software&emsp;</p>
//                 <br/>
//                 <a href="https://corecircuitsoftware.github.io">About us</a>
//             </footer>
//         </main>
//     );
// }


// export default UserProfile