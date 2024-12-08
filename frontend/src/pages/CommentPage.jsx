import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import Menu from '../components/Menu';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import CommentDisplay from "../components/CommentsDisplay";
import "../styles/CommentPage.css";
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";

export default function CommentPage() {
    const { commentID } = useParams()
    const [mainComment, setMainComment] = useState([])
    const [thisUser, setThisUser] = useState([])
    const [commentContent, setcommentContent] = useState('')
    const [comments, setComments] = useState([])
    const [isMyComment, setIsMyComment] = useState(false)
    // const formattedDate = new Date(post.postDate).toLocaleDateString("en-US")
    const formattedDate = new Date(mainComment.commentDate).toLocaleString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const formattedEditDate = new Date(mainComment.editDate).toLocaleString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => {
                setIsMyComment(res.data.id === mainComment.user)
            }
            )
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    navigate("/404");
                } else if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    alert(err);
                }
            })
    }

    useEffect(() => {
        api.get(`/api/comment/${commentID}/`)
            .then((res) => res.data)
            .then((data) => {
                setMainComment(data)
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    navigate("/404");
                } else if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    alert(err);
                }
            })
    }, [commentID])

    useEffect(() => {
        if (mainComment.user === undefined) return
        api
            .get(`/api/profile/getuserdata2/${mainComment.user}/`)
            .then((res) => res.data)
            .then((data) => {
                setThisUser(data)
                setcommentContent('')
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    navigate("/404");
                } else if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    alert(err);
                }
            })
    }, [mainComment])

    const handleCommentSubmit = (e) => {
        console.log("submitting comment")
        api
            .post('/api/comment/submit/', { commentContent: commentContent, post: mainComment.post, replyTo: mainComment.commentID })
            .then((res) => {
                window.location.reload();
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    navigate("/404");
                } else if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    alert(err);
                }
            })
    }

    const getComments = () => {
        if (typeof (mainComment.commentID) == "number") {
            api
                .get(`/api/comment/get/replies/${mainComment.commentID}/`)
                .then((res) => res.data)
                .then((data) => {
                    setComments(data.reverse())
                })
                .catch((err) => {
                    if (err.response && err.response.status === 404) {
                        navigate("/404");
                    } else if (err.response && err.response.status === 401) {
                        navigate("/login");
                    } else {
                        alert(err);
                    }
                })
        }
    }

    useEffect(() => {
        getComments()
        getMyProfile()
    }, [mainComment])

    const navigate = useNavigate()
    const handleProfileClick = () => navigate(`/profile/${thisUser.username}`)
    const handleCommentShare = async () => {
        event.preventDefault()
        try {
            await navigator.clipboard.writeText(`http://circuitsocial.tech/comment/view/${mainComment.commentID}`);
        } catch (err) {
            console.log('Error copying profile link')
        }
    }
    const submitDisable = () => {
        if (commentContent.length > 0 && commentContent.length < 255) {
            return false
        } else {
            return true
        }
    }

    return (
        <main>
            <SearchBar />
            <Menu />
            <div className="content">
                <div className="main-post">
                    <div className="post-page-options-buttons">
                        <button className="pfp-post-main-btn" onClick={handleProfileClick} data-cy="profile-picture"><img className="pfp-post-main" src={thisUser.profilePicture} /></button>
                        {/* <button className="comment-share-button" onClick={handleCommentShare} data-cy="share">Share</button>
                        {isMyComment && (<button className="comment-edit-button" onClick={() => navigate(`/comment/edit/${mainComment.commentID}`)}>edit</button>)} */}
                        <ButtonGroup variant="contained" >
                            <Button startIcon=<ShareIcon /> onClick={handleCommentShare}>share</Button>
                            {isMyComment && <Button startIcon=<EditIcon /> onClick={() => navigate(`/comment/edit/${mainComment.commentID}`)}> Edit</Button>}
                        </ButtonGroup>
                    </div>

                    <h1 className="comment">{mainComment.commentContent}</h1>
                    <h5 className="comment-date">{formattedDate}</h5>
                    {mainComment.hasEdit && (<h6 className="edit-date">Edited: {formattedEditDate}</h6>)}
                    {/* <button onClick={() => navigate(`/post/view/${mainComment.post}`)}>Go back</button> */}
                    <Button variant="contained" startIcon=<KeyboardReturnIcon /> onClick={() => navigate(`/post/view/${mainComment.post}`)}>Go Back</Button>
                </div>
                <div className="comments-textbox">
                    <form>
                        <textarea
                            className="comment-input"
                            value={commentContent}
                            onChange={(e) => setcommentContent(e.target.value)}
                            placeholder="Write a comment..."
                            rows={4}
                            style={{ resize: 'none' }}
                            data-cy="comment-input"
                        />
                        {(commentContent.length > 0 || commentContent.length < 255) ? (
                            // <button
                            //     type="button"
                            //     className="comment-submit"
                            //     disabled={submitDisable()}
                            //     onClick={handleCommentSubmit}
                            //     data-cy="comment-submit"
                            // >
                            //     Post Comment
                            // </button>
                            <Button variant="contained" onClick={handleCommentSubmit} disabled={submitDisable()} data-cy="comment-submit">Post Comment</Button>
                        ) : (
                            <button
                                className="comment-submit-disabled"
                                disabled={true}
                                data-cy="comment-submit-disabled"
                                Post Comment />
                        )}
                    </form>
                </div>
                <div className="comments">
                    {comments.length > 0 ? (
                        comments.map((comment) => (<CommentDisplay comment={comment} key={comment.commentID} />))
                    ) : (
                        <p className="no-comments">No comments yet</p>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}