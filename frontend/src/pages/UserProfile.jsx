import api from "../api.js"
import "../styles/Home.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css"

function UserProfile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState([]);

    useEffect(() => {
        getProfile();
    }, [])
    const getProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => {
                console.log(data)
                setProfile(data)
            })
            .catch((err) => alert(err));
    }
    const handleEdit = () => {
        navigate("/edit-profile")
    }
    const handleLogout = () => {
        navigate("/logout")
    }
    const handlePostCreate = () => {
        navigate("/create-post/")
    }

    return (
        <div>
            <img className="back-img" src={profile.backgroundImage} />
            <div className="profile-card">
                <div className="card-upper">
                    <img className="pfp" src={profile.profilePicture} />
                    <div className="names">
                        <p className="display-name">{profile.displayName}</p>
                        <p className="username">{profile.username}</p>
                    </div>
                    <div className="buttons">
                        <button className="logout-button" type="button" onClick={handlePostCreate}>Create Post</button>
                        <button className="logout-button" type="button" onClick={handleLogout}>Logout</button>
                        <button className="edit-button" type="button" onClick={handleEdit}>Edit</button>
                    </div>
                </div>
                <div className="bio">{profile.bio}</div>
            </div>
        </div>
    );
}


export default UserProfile