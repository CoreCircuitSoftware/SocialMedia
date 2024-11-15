/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"

function ProfileForm() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState([]);

    const [displayName, setDisplayName] = useState("")
    const [bio, setBio] = useState("");
    const [pfp, setPfp] = useState("");
    const [backImg, setBackImg] = useState("");
    //const [backCol, setBackCol] = useState("");

    useEffect(() => {
        getProfile();
        setDisplayName(profile.displayName)
        setBio(profile.bio)
        setPfp(profile.profilePicture)
        setBackImg(profile.backgroundImage)
    }, [])
    const getProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => {
                setProfile(data)
            })
            .catch((err) => alert(err));
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.patch("/api/profile/edit/", { displayName: displayName, bio: bio, profilePicture: pfp, backgroundImage: backImg })
            navigate("/profile")
        } catch (error) {
            alert(error)
        }
    }

    const handleCancel = async (e) => {
        e.preventDefault();
        navigate(`/profile/${profile.username}`)
    }

    const handleDeleteProfile = () => {
        if (window.confirm("Delete your account? This cannot be undone")) {
            api.delete(`/api/profile/delete/`)
            navigate("/login")
            alert('Account deleted!')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Edit Profile</h1>
            <h2>{profile.username}</h2>
            <label htmlFor="display_name">Display Name</label>
            <input id="display_name"
                className="form-input"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={profile.displayName}
                data-cy="display-name"
            />
            <label htmlFor="bio">Bio</label>
            <textarea id="bio"
                className="form-input"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={profile.bio}
                data-cy="bio"
            />
            <label htmlFor="pfp">Profile Picture</label>
            <input id="pfp"
                className="form-input"
                type="text"
                value={pfp}
                onChange={(e) => setPfp(e.target.value)}
                placeholder={profile.profilePicture}
                data-cy="pfp"
            />
            <label htmlFor="back_img">Banner</label>
            <input id="back_img"
                className="form-input"
                type="text"
                value={backImg}
                onChange={(e) => setBackImg(e.target.value)}
                placeholder={profile.backgroundImage}
                data-cy="banner"
            />
            {/* <label htmlFor="back_col">Background Color</label>
            <input id="back_col"
                className="form-input"
                type="text"
                value={backCol}
                onChange={(e) => setBackCol(e.target.value)}
                placeholder={profile.backgroundImage}
            /> */}
            <button className="form-button" type="submit" data-cy="confirm">
                Confirm
            </button>
            <button className="form-button" type="button" onClick={handleCancel} data-cy="cancel">
                Cancel
            </button>
            <button className="form-button" type="button" onClick={handleDeleteProfile} data-cy="delete">
                Delete
            </button>
        </form>
    );
}

export default ProfileForm