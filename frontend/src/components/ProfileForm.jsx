/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Avatar from '@mui/material/Avatar';
import defaultProfilePic from'../assets/csbutwhiteoutlined.png'
import defaultBackground from'../assets/login images/circuit-electronic-blue-black-dark-background-digital-art-ab.png'
import Box from '@mui/material/Box';


const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(10%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

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
    }, [])

    useEffect(() => {
        if (profile) {
          setDisplayName(profile.displayName || "");
          setBio(profile.bio || "");
        }
      }, [profile]);
    
    const getProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => {
                setProfile(data)
            })
            .catch((err) => alert(err));
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'profilePicture') {
          setPfp(files[0]);
        } else if (name === 'backgroundImage') {
          setBackImg(files[0]);
        }
      };    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('displayName', displayName);
        formData.append('bio', bio);
        if (pfp) {
          formData.append('profilePicture', pfp);
        }
        if (backImg) {
          formData.append('backgroundImage', backImg);
        }
    
        try {
          await api.patch("/api/profile/edit/", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          navigate("/profile");
        } catch (error) {
          alert(error);
        }
      };

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

            {/* Profile Picture Upload */}
            <label htmlFor="pfp">Profile Picture</label>
            <Box display="flex" alignItems="center">
                <Avatar
                src={pfp ? URL.createObjectURL(pfp) : profile.profilePicture || defaultProfilePic}
                alt="Profile Picture"
                sx={{ width: 70, height: 70 }}
                />
                <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ marginLeft: 9 }}
                color="primary" // Use 'primary' or another standard color unless 'customGreen' is defined
                >
                Upload Image
                <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    name="profilePicture"
                />
                </Button>
            </Box>
            
            {/* Banner Image Upload */}
            <label htmlFor="back_img">Banner</label>
            <Box display="flex" alignItems="center" gap={2}>  {/* Flex container with gap between image and button */}
                {/* Banner Image */}
                <img
                    src={backImg ? URL.createObjectURL(backImg) : profile.backgroundImage || defaultBackground}  // Fallback to default banner if no image is selected
                    alt="Banner"
                    style={{
                        width: '70%',  // Make it responsive by taking full width
                        maxWidth: '400px',  // Restrict the max width to 800px (adjust as needed)
                        height: '65px',  // Set a fixed height for the banner
                        objectFit: 'cover',  // Ensures the image covers the container without stretching
                        borderRadius: '8px',  // Optional: rounded corners
                    }}
                />
                {/* Upload Button */}
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    color="primary"
                    sx={{ height: '57px', marginLeft: '15px' }}  // Align the button height with the banner
                >
                    Upload Image
                    <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        name="backgroundImage"
                    />
                </Button>
            </Box>
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