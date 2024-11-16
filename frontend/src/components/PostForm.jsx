import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Post.css"
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

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

    const [profile, setProfile] = useState([]);
    const [user, setUser] = useState([])
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

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
        images.forEach((image) => {
            formData.append("media", image);
        });

        try {
            await api.post("/api/createpost/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/profile");
        } catch (error) {
            console.error("There was an error creating the post!", error);
        }
    };


    const handleReturn = async (e) => {
        e.preventDefault();
        navigate("/profile")
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
                         <img key={index} src={preview} alt={`Preview ${index + 1}`} style={{ width: '90%', margin: '5px', height:'90%' }} />
                    ))}
                </div>
            )}
            <Button 
                variant="contained" 
                type="submit" 
                data-cy="submit-post"
                style={{ width: '360px', marginBottom: '16px'}}
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
                    style={{ width: '360px'}}
                    color="customGreen"
                    >
                    Go Back
            </Button>
        </form>
    );
}