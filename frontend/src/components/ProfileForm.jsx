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
                console.log(data)
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
            />
            <label htmlFor="bio">Bio</label>
            <textarea id="bio"
                className="form-input"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={profile.bio}
            />
            <label htmlFor="pfp">Profile Picture</label>
            <input id="pfp"
                className="form-input"
                type="text"
                value={pfp}
                onChange={(e) => setPfp(e.target.value)}
                placeholder={profile.profilePicture}
            />
            <label htmlFor="back_img">Background Image</label>
            <input id="back_img"
                className="form-input"
                type="text"
                value={backImg}
                onChange={(e) => setBackImg(e.target.value)}
                placeholder={profile.backgroundImage}
            />
            {/* <label htmlFor="back_col">Background Color</label>
            <input id="back_col"
                className="form-input"
                type="text"
                value={backCol}
                onChange={(e) => setBackCol(e.target.value)}
                placeholder={profile.backgroundImage}
            /> */}
            <button className="form-button" type="submit">
                Confirm
            </button>
            <button className="form-button" type="button" onClick={handleCancel}>
                Cancel
            </button>
        </form>
    );
}

export default ProfileForm