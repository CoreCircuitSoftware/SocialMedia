import { useEffect, useState } from "react";
import api from "../api"
import { useParams, useNavigate } from "react-router-dom";

export default function PostEdit() {
    const { postid } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => { 
        api.get(`/api/posts/${postid}/`)
            .then((res) => res.data)
            .then((data) => {
                setPost(data)
                setTitle(data.title)
                setDescription(data.description)
            })
            .catch((err) => console.log("Error LOL"))
    }, [postid])

    const handleSubmit = () => {
        event.preventDefault()
        api
            .patch(`/api/posts/edit/${postid}/`, {title, description})
            .then((res) => {
                navigate(`/post/view/${postid}`)
            })
            .catch((err) => console.log("errorrrrr"))
    }

    const handleCancel = (e) => {
        e.preventDefault()
        navigate(`/post/view/${postid}`)
    }

    return (
        <form className="edit-post" onSubmit={handleSubmit}>
            <h1>Edit Post</h1>
            <label htmlFor="post-title">Post Title</label>
            <input id="post-title"
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={title}
                data-cy="display-name"
            />
            <label htmlFor="post-description">Post Description</label>
            <input id="post-description"
                className="form-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={title}
                data-cy="display-name"
            />
            <button className="form-button" type="submit" data-cy="confirm">
                Confirm
            </button>
            <button className="form-button" type="button" onClick={handleCancel} data-cy="cancel">
                Cancel
            </button>
        </form>
    )
}