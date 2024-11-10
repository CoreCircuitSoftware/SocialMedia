import { useEffect, useState } from "react";
import api from "../api"
import { useParams, useNavigate } from "react-router-dom";

export default function CommentEdit() {
    const { commentID } = useParams()
    const navigate = useNavigate()
    const [comment, setComment] = useState()
    const [ID, setID] = useState()

    useEffect(() => { 
        api.get(`/api/comment/${commentID}/`)
            .then((res) => res.data)
            .then((data) => {
                setComment(data.commentContent)
                setID(data.commentID)
            })
            .catch((err) => console.log("Error LOL"))
    }, [commentID])

    const handleCancel = async (e) => {
        e.preventDefault();
        navigate(`/comment/view/${ID}`)
    }

    const handleSubmit = () => {
        event.preventDefault()
        console.log("submitting edit")
        api
            .patch(`/api/comment/edit/${ID}/`, {commentContent: comment})
            .then((res) => {
                navigate(`/comment/view/${ID}`)
            })
            .catch((err) => console.log("errorrrrr"))
    }

    return (
        <form className="edit-comment" onSubmit={handleSubmit}>
            <h1>Edit Comment</h1>
            <label htmlFor="comment-content">Comment content</label>
            <input id="comment-content"
                className="form-input"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={comment}
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