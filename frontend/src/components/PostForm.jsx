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
    const [description, setDescription] = useState("");
    //const [community, setCommunity] = useState("");

    // useEffect(() => {
    //     getProfile();
    //     setUser(profile.id)
    // }, [])
    // const getProfile = () => {
    //     api
    //         .get(`/api/profile/`)
    //         .then((res) => res.data)
    //         .then((data) => {
    //             console.log(data)
    //             setProfile(data)
    //         })
    //         .catch((err) => alert(err));
    // }

    // useEffect(() => {
    //     getProfile(); // Fetch profile when component mounts
    // }, []);

    // const getProfile = async () => {
    //     try {
    //         const res = await api.get(`/api/profile/`);
    //         const data = res.data;
    //         console.log(data);
    //         setProfile(data); // Set profile data
    //         setUser(data.id); // Set user ID based on profile data
    //     } catch (err) {
    //         alert("Failed to load profile: " + err);
    //     }
    // };

    const createPost = (e) => {
        e.preventDefault();
        api
            .post("/api/createpost/", {title, description})
            .then((res) => {
                //if (res.status === 201) alert("Post created!");
                //else alert("Failed to create post.");
                //getPosts();
                navigate("/profile")
            })
            .catch((err) => alert(err));
    }

    const handleReturn = async (e) => {
        e.preventDefault();
        navigate("/profile")
    }

    return (
        <form onSubmit={createPost} className="post-submit-container">
            <h2>Create Post</h2>
            <label htmlFor="title">Title:</label>
            <input id="post_title"
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Post Title"
                />
            <label htmlFor="description">Description:</label>
            <input id="post_description"
                className="form-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Post Description"
                />
            <button className="form-button" type="submit">
                Submit Post
            </button>
            <button className="form-button" type="button" onClick={handleReturn}>
                Go Back
            </button>
        </form>
    );
}