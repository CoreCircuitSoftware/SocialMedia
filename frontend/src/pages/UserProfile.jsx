import api from "../api.js"
import "../styles/Home.css"
import "../styles/Profile.css"
import "../styles/Layout.css"
import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import PostDisplay from "../components/ProfilePostDisplay.jsx"
import SearchBar from "../components/SearchBar"
import Menu from "../components/Menu"
import Footer from "../components/Footer"

export default function UserProfileTest() {
    const { username } = useParams();
    const navigate = useNavigate();
    const postType = 1; //post type 1=user posts
    const [profile, setProfile] = useState([]);
    const [myProfile, setMyProfile] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [friendCount, setFriendCount] = useState(0);
    const [friends, setFriends] = useState([]);
    const [friendRequestSent, setFriendRequestSent] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        getProfile(); // Fetch profile of the user being viewed
        getMyProfile(); // Fetch current logged-in user's profile
    }, []);

    useEffect(() => {
        if (profile.id) {
            getFriends(); // Only fetch friends after profile.id is available
            getPosts();   // Only fetch posts after profile.id is available
            if (profile.id === myProfile.id) {
                setIsMyProfile(true); // Check if this is the logged-in user's profile
                getPendingFriendRequests();  // Fetch pending friend requests if it's the user's own profile
            }
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
            .catch((err) => console.log(err));
    };
    
    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => setMyProfile(data))
            .catch((err) => alert(err));
    };

    const getFriends = () => {
        api
            .get(`/api/friends/${profile.id}/`)
            .then((res) => res.data)
            .then((data) => {
                setFriends(data);
                setFriendCount(data.length); // Update the friend count
            })
            .catch((err) => console.log(err));
    };

    const handleAddFriend = () => {
        if (!profile.id || !myProfile.id) {
            console.error("Profile ID or MyProfile ID is not defined.");
            return;
        }
    
        // Send friend request using both user1 (current user) and user2 (profile)
        api
            .post(`/api/friend-request/${profile.id}/`, {
                user1: myProfile.id,  // The logged-in user's ID
                user2: profile.id     // The ID of the profile being viewed
            })
            .then(() => {
                alert(`${profile.username} added to friend requests!`);
                setFriendRequestSent(true);
            })
            .catch((err) => {
                console.error("Error sending friend request:", err);
            });
    };

    const handleAcceptFriendRequest = (requestID) => {
        api.put(`/api/friend-request/accept/${requestID}/`)
            .then(() => {
            alert('Friend request accepted!');
            getFriends(); // Fetch the updated list of friends after accepting
            })
            .catch((err) => console.log("Error accepting friend request:", err));
    };

    const getPendingFriendRequests = () => {
        api.get(`/api/friend-requests/`)
        .then((res) => {
            console.log("Friend requests:", res.data); // Debug output
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

    return (
        <main>
        <SearchBar />
        <Menu />
        <Footer />
        <div className="content">
            <div className="profile-top">
                <img className="back-img" src={profile.backgroundImage} alt="background" />
                <div className="profile-card">
                    <div className="card-upper">
                        <img className="pfp" src={profile.profilePicture} alt="profile" />
                        <div className="names">
                            <p className="display-name">{profile.displayName}</p>
                            <p className="username">@{profile.username}</p>
                        </div>
                        <div className="buttons">
                            {isMyProfile ? (
                                <div>
                                    <button className="logout-button" onClick={handlePostCreate}>Create Post</button>
                                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                                    <button className="edit-button" onClick={handleEdit}>Edit</button>
                                </div>
                            ) : (
                                <div>
                                    <button className="edit-button" onClick={handleMessage}>Message</button>
                                    {!friendRequestSent ? (
                                        <button className="edit-button" onClick={handleAddFriend}>Add Friend</button>
                                    ) : (
                                        <p>Friend Request Sent</p>
                                    )}
                                </div>
                            )}
                            <div className="friends-count">
                                <p onClick={handleViewFriends}>Friends {friendCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bio">{profile.bio}</div>

                    {/* Display Pending Friend Requests */}
                    {isMyProfile && friendRequests.length > 0 && (
                        <div className="friend-requests">
                            <h3>Pending Friend Requests</h3>
                            {friendRequests.map(request => (
                                <div key={request.requestID}>
                                    <p>{request.user1.username} has sent you a friend request!</p>
                                    <button onClick={() => handleAcceptFriendRequest(request.requestID)}>Accept</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="post-holder">
                        {posts.map((post) => <PostDisplay post={post} profile={profile} key={post.postID} />)}
                    </div>
                </div>
            </div>
        </div>
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
// import 'bootstrap/dist/css/bootstrap.min.css';
// import api from "../api.js";
// import "../styles/Home.css";
// import "../styles/Profile.css";
// import "../styles/Layout.css";
// import { useState, useEffect } from "react";
// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
// import PostDisplay from "../components/ProfilePostDisplay.jsx";
// import SearchBar from "../components/SearchBar";
// import Menu from "../components/Menu";
// import Footer from "../components/Footer";

// export default function UserProfileTest() {
//     const { username } = useParams();
//     const navigate = useNavigate();
//     const [profile, setProfile] = useState([]);
//     const [myProfile, setMyProfile] = useState([]);
//     const [posts, setPosts] = useState([]);
//     const [isMyProfile, setIsMyProfile] = useState(false);

//     useEffect(() => {
//         getProfile();
//         getMyProfile();
//     }, []);

//     const getProfile = () => {
//         api
//             .get(`/api/profile/getuserdata/${username}/`)
//             .then((res) => res.data)
//             .then((data) => {
//                 setProfile(data[0]);
//             })
//             .catch((err) => console.log(err));
//     };

//     const getMyProfile = () => {
//         api
//             .get(`/api/profile/`)
//             .then((res) => res.data)
//             .then((data) => {
//                 setMyProfile(data);
//             })
//             .catch((err) => alert(err));
//     };

//     useEffect(() => {
//         getPosts();
//     }, [profile]);

//     const getPosts = () => {
//         api
//             .get(`/api/profile/posts/${profile.id}/`)
//             .then((res) => res.data)
//             .then((data) => {
//                 setPosts(data.reverse());
//             })
//             .catch((err) => console.log("Error getting posts"));
//     };

//     useEffect(() => {
//         if (profile.id && profile.id === myProfile.id) {
//             setIsMyProfile(true);
//         }
//     }, [profile, myProfile]);

//     const handleEdit = () => {
//         navigate("/profile/edit");
//     };
//     const handleLogout = () => {
//         navigate("/logout");
//     };
//     const handlePostCreate = () => {
//         navigate("/post/create");
//     };
//     const handleMessage = () => {
//         navigate(`/profile/${profile.username}/message`);
//     };

//     return (
//         <div className="container-fluid">
//         <div className="row">
//             {/* Sidebar */}
//             <div className="col-md-3 sidebar d-none d-md-block">
//                 <ul className="nav flex-column">
//                     <li className="nav-item">
//                         <a className="nav-link" href="#">Home</a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link" href="#">Explore</a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link" href="#">Notifications</a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link" href="#">Messages</a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link" href="#">Bookmarks</a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link active" href="#">Profile</a>
//                     </li>
//                 </ul>
//             </div>

//             {/* Main Content */}
//             <div className="col-md-9">
//                 {/* Profile Header */}
//                 <div className="profile-header">
//                     <div className="banner">
//                         <img className="banner-img" src={profile.backgroundImage} alt="Profile Background" />
//                     </div>
//                     <div className="profile-info text-center">
//                         <img className="profile-pic rounded-circle" src={profile.profilePicture} alt="Profile" />
//                         <h5>{profile.displayName}</h5>
//                         <p className="text-muted">@{profile.username}</p>
//                         <p>{profile.bio}</p>
//                         {isMyProfile ? (
//                             <button className="btn btn-secondary" onClick={handleEdit}>
//                                 Edit Profile
//                             </button>
//                         ) : (
//                             <button className="btn btn-secondary">
//                                 Message
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 {/* Profile Details */}
//                 <div className="profile-details mt-4">
//                     <ul className="nav nav-tabs">
//                         <li className="nav-item">
//                             <a className="nav-link active" href="#">Tweets</a>
//                         </li>
//                         <li className="nav-item">
//                             <a className="nav-link" href="#">Media</a>
//                         </li>
//                         <li className="nav-item">
//                             <a className="nav-link" href="#">Likes</a>
//                         </li>
//                     </ul>
//                     <div className="tab-content mt-3">
//                         <div className="tab-pane fade show active">
//                             {/* Display posts here */}
//                             {profile.posts && profile.posts.map((post) => (
//                                 <div className="post mb-4" key={post.postID}>
//                                     <h5>{post.title}</h5>
//                                     <p>{post.content}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <Footer />
//     </div>
//     );
// }