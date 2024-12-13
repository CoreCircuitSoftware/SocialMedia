import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate, useParams } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Post.css"
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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

export default function PostForm() {
    const navigate = useNavigate();
    const { communityID } = useParams();
    const [communityName, setCommunityName] = useState()
    const [profile, setProfile] = useState([]);
    const [user, setUser] = useState([])
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [age, setAge] = React.useState(communityID); //rename and change to later
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    //Here to check the user is signed in, returns them to login if not
    useEffect(() => {
        api
            .get(`/api/profile/`)
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    navigate("/404");
                } else if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    alert(err);
                }
            })
        if (communityID) {
            api
            .get(`api/community/getdataid/${communityID}/`)
            .then((res) => {
                setCommunityName(res.data.name) 
            })
        }
    })

    //path('community/getdataid/<int:communityID>/', CommunityReadByID.as_view(), name='Community-ReadBy-Name' ),

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Set selected image files
        setImages(files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const createPost = async (e) => {
        e.preventDefault();
        
        if (!title) {
            setTitleError(true);
            return;
        }        
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if(age != null){
        formData.set("community", age);  // Add community ID (age) to formData
        }
        images.forEach((image) => {
            formData.append("media", image);
        });
    
        try {
            await api.post("/api/createpost/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (communityName) {
                navigate(`/community/view/${communityName}`)
            } else {
                navigate("/profile");
            }
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            }
        }
    };

    
    


    const handleReturn = async (e) => {
        e.preventDefault();
        if (communityName) {
            navigate(`/community/view/${communityName}`)
        } else {
            navigate("/profile")
        }
    }
    
    return (
        
        <form onSubmit={createPost} className="post-submit-container">
            <h2>Create Post</h2>
            <label htmlFor="title">Title:</label>
            {titleError && (
                <h5 data-cy="title-error">Error: Title required for post</h5>
            )}
            <input id="post_title"
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Post Title"
                data-cy="post-title"
            />
            <label htmlFor="description">Description:</label>
            <input id="post_description"
                className="form-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Post Description"
                data-cy="post-description"
            />
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="CommunityDropDown">Community</InputLabel>
                    <Select
                        labelId="CommunityDropDown-label"
                        id="demo-simple-select"
                        value={age}
                        label="Community"
                        onChange={handleChange}
                    >
                        {/* Value = community ID */}
                        <MenuItem value={null}>None</MenuItem>
                        <MenuItem value={3}>Linux</MenuItem>
                        <MenuItem value={4}>Hardware</MenuItem>
                        <MenuItem value={5}>Gaming</MenuItem>
                        <MenuItem value={6}>Funny</MenuItem>
                        <MenuItem value={7}>Development</MenuItem>
                        <MenuItem value={8}>Pets</MenuItem>
                        <MenuItem value={9}>Cyber Security</MenuItem>
                        <MenuItem value={10}>News</MenuItem>

                    </Select>
                </FormControl>
            </Box>
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                fullWidth
                style={{ width: '360px', marginBottom: '16px' }}  // Set width here
                color="customGreen"
            >
                Upload Image
                <VisuallyHiddenInput type="file" accept="image/*" multiple onChange={handleFileChange} />
            </Button>
            
            {imagePreviews.length > 0 && (
                <div className="image-preview">
                    {imagePreviews.map((preview, index) => (
                        <img key={index} src={preview} alt={`Preview ${index + 1}`} style={{ width: '90%', margin: '5px', height: '90%' }} />
                    ))}
                </div>
            )}
            <Button
                variant="contained"
                type="submit"
                data-cy="submit-post"
                style={{ width: '360px', marginBottom: '16px' }}
                color="customGreen"
            >
                Submit Post
            </Button>
            <Button
                //className="form-button" 
                type="button"
                variant="contained"
                onClick={handleReturn}
                data-cy="go-back"
                style={{ width: '360px' }}
                color="customGreen"
            >
                Go Back
            </Button>

            
        </form>
        
    );
}