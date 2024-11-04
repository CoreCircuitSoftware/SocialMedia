import api from "../api.js";
import "../styles/Home.css";
import "../styles/Profile.css";
import "../styles/Layout.css";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostDisplay from "../components/ProfilePostDisplay.jsx";
import SearchBar from "../components/SearchBar";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

export default function UserProfileTest() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState([]);
    const [myProfile, setMyProfile] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [friendCount, setFriendCount] = useState(0);
    const [friendStatus, setFriendStatus] = useState('');
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [friendShipID, setFriendshipID] = useState();

    useEffect(() => {
        getProfile(); // Fetch profile of the user being viewed
        getMyProfile(); // Fetch current logged-in user's profile
    }, [username]);

    useEffect(() => {
        if (profile.id && myProfile.id) {
            if (profile.id === myProfile.id) {
                setIsMyProfile(true);
                getPendingFriendRequests();
            } else {
                setIsMyProfile(false);
            }
            getFriends();
            getPosts();
            checkFriendStatus();
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
        api
            .post(`/api/friend-request/${profile.id}/`, {})
            .then(() => {
                alert(`Friend request sent to ${profile.username}!`);
                setFriendStatus('pending');
            })
            .catch((err) => {
                console.error("Error sending friend request:", err);
            });
    };

    const handleAcceptFriendRequest = (requestID, accepted) => {
        api.put(`/api/friend-request/accept/${requestID}/`, { accepted })
            .then(() => {
                alert(`Friend request ${accepted ? 'accepted' : 'declined'}!`);
                // Remove the processed request
                setFriendRequests((prevRequests) =>
                    prevRequests.filter((request) => request.requestID !== requestID)
                );
                if (accepted) {
                    getFriends(); // Update friends list
                    setFriendStatus('friends');
                } else {
                    setFriendStatus('none');
                }
            })
            .catch((err) => console.log("Error responding to friend request:", err));
    };

    const handleAcceptFriendRequestByButton = (accepted) => {
        // Find the friend request where user1 is the profile user and user2 is the current user
        const request = friendRequests.find(
            (req) => req.user1.id === profile.id && req.user2.id === myProfile.id
        );
        if (request) {
            handleAcceptFriendRequest(request.requestID, accepted);
        } else {
            alert('No friend request found.');
        }
    };

    const checkFriendStatus = () => {
        console.log(`Profile ID: ${profile.id}`);  // Ensure this is a valid ID without extra characters
        api.get(`/api/friend-status/${profile.id}/`)
            .then((res) => res.data)
            .then((data) => {
                console.log('Friend status:', data.status); // Debugging log
                setFriendStatus(data.status);
                if (data.status === 'friends')
                    getFriendship();
            })
            .catch((err) => console.log(err));
    };

    const getFriendship = () => {
        api.get(`/api/friend/${myProfile.username}/${profile.username}/`)
            .then((res) => res.data)
            .then((data) => {
                console.log('FriendshipID: ', data.friendShipID)
                setFriendshipID(data.friendShipID)
            })
            .catch((err) => console.log(err));
    };


    const getPendingFriendRequests = () => {
        api.get(`/api/friend-requests/`)
            .then((res) => {
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
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(`http://circuitsocial.tech/profile/${profile.username}`);
            alert("Copied");
            console.log('Profile link copied')
        } catch (err) {
            console.log('Error copying profile link')
        }
    }

    const handleRemoveFriend = () => {
        if (window.confirm("Remove Friend?"))
            api.delete(`/api/friend/remove/${friendShipID}/`)
    }

    return (
        <main>
            <SearchBar />
            <Menu />
            <Footer />
            <div className="content">
                <div className="profile-top">
                    <img className="back-img" src={profile.backgroundImage} alt="background" data-cy="banner" />
                    <div className="profile-card">
                        <div className="card-upper">
                            <img className="pfp" src={profile.profilePicture} alt="profile" data-cy="pfp" />
                            <div className="names">
                                <p className="display-name" data-cy="display-name">{profile.displayName} </p>
                                <p className="username" data-cy="username">@{profile.username}</p>
                            </div>
                            <div className="buttons">
                                {isMyProfile ? (
                                    <div>
                                        <button className="logout-button" onClick={handleShare} data-cy="share">Share</button>
                                        <button className="logout-button" onClick={handlePostCreate} data-cy="create-post">Create Post</button>
                                        <button className="logout-button" onClick={handleLogout} data-cy="logout">Logout</button>
                                        <button className="edit-button" onClick={handleEdit} data-cy="edit">Edit</button>
                                    </div>
                                ) : (
                                    <div>
                                        <button className="edit-button" onClick={handleMessage}>Message</button>
                                        {friendStatus === 'none' && (
                                            <button className="edit-button" onClick={handleAddFriend}>Add Friend</button>
                                        )}
                                        {friendStatus === 'pending' && (
                                            <p>Friend Request Sent</p>
                                        )}
                                        {friendStatus === 'pending_received' && (
                                            <div>
                                                <button onClick={() => handleAcceptFriendRequestByButton(true)}>Accept Friend Request</button>
                                                <button onClick={() => handleAcceptFriendRequestByButton(false)}>Decline</button>
                                            </div>
                                        )}
                                        {friendStatus === 'friends' && (
                                            <button className="logout-button" onClick={handleRemoveFriend} >Remove Friend</button>
                                        )}
                                    </div>
                                )}
                                <div className="friends-count">
                                    <p onClick={handleViewFriends} data-cy="friends">Friends {friendCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bio" data-cy="bio" >{profile.bio}</div>

                        {/* Display Pending Friend Requests */}
                        {isMyProfile && friendRequests.length > 0 && (
                            <div className="friend-requests">
                                <h3>Pending Friend Requests</h3>
                                {friendRequests.map(request => (
                                    <div key={request.requestID}>
                                        <p>{request.user1.username} has sent you a friend request!</p>
                                        <button onClick={() => handleAcceptFriendRequest(request.requestID, true)}>Accept</button>
                                        <button onClick={() => handleAcceptFriendRequest(request.requestID, false)}>Decline</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Display Friends List */}
                        {/* {friends.length > 0 && (
                            <div className="friends-list">
                                <h3>Friends</h3>
                                <ul>
                                    {friends.map((friend) => {
                                        const friendUser = friend.user1.id === profile.id ? friend.user2 : friend.user1;
                                        return (
                                            <li key={friend.friendShipID}>
                                                <a href={`/profile/${friendUser.username}`}>{friendUser.username}</a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )} */}
                    {(posts.length > 0) ? (
                        <div className="post-holder" data-cy="posts">
                            {posts.map((post) => <PostDisplay post={post} key={post.postID} />)}
                        </div>
                        ) : (
                            <h3 data-cy="user-no-posts">{username} hasn't made any posts yet</h3>
                        )}
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