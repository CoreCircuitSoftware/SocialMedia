import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Post.css"

export default function PostForm() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState([]);
    const [user, setUser] = useState([])
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [description, setDescription] = useState("");

    const createPost = (e) => {
        e.preventDefault();
        if (title) {
            api
            .post("/api/createpost/", {title, description})
            .then((res) => {
                //if (res.status === 201) alert("Post created!");
                //else alert("Failed to create post.");
                //getPosts();
                navigate("/profile")
            })
            .catch((err) => alert(err));
        } else {
            setTitleError(true)
        }
    }

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
            <button className="form-button" type="submit" data-cy="submit-post">
                Submit Post
            </button>
            <button className="form-button" type="button" onClick={handleReturn} data-cy="go-back">
                Go Back
            </button>
        </form>
    );
}