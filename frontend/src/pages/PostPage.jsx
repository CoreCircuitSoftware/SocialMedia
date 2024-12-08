import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import Menu from '../components/Menu';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import CommentDisplay from "../components/CommentsDisplay";
import "../styles/Post.css";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ChatBubble from "@mui/icons-material/ChatBubble";
import Share from "@mui/icons-material/Share";
import ThumbDown from "@mui/icons-material/ThumbDown";
import ThumbDownAltOutlined from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUp from "@mui/icons-material/ThumbUp";
import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";

import logo from '../assets/csbutwhiteoutlined.png'
import Avatar from '@mui/material/Avatar';
import { AppBar, Toolbar, Typography, Container, Grid2, Paper, Box } from "@mui/material";

export default function PostPage() {
    const { postid } = useParams()
    const [post, setPost] = useState([])
    const [thisUser, setThisUser] = useState([])
    const [isMyPost, setIsMyPost] = useState(false)
    const [commentContent, setcommentContent] = useState('')
    const [comments, setComments] = useState([])
    const [media, setMedia] = useState([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [myProfile, setMyProfile] = useState([]);
    // const formattedDate = new Date(post.postDate).toLocaleDateString("en-US")
    const formattedDate = new Date(post.postDate).toLocaleString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const formattedEditDate = new Date(post.editDate).toLocaleString("en-US", {
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
                setIsMyPost(res.data.id === post.user)
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
        api.get(`/api/posts/${postid}/`)
            .then((res) => res.data)
            .then((data) => {
                setPost(data)
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
    }, [postid])

    useEffect(() => {
        if (post.user === undefined) return
        api
            .get(`/api/profile/getuserdata2/${post.user}/`)
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
    }, [post])

    const handleCommentSubmit = (e) => {
        console.log("submitting comment")
        api
            .post('/api/comment/submit/', { commentContent: commentContent, post: post.postID })
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
        if (typeof (post.postID) == "number") {
            api
                .get(`/api/comment/get/from-post/${post.postID}/`)
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

    const fetchMedia = async () => {
        console.log("Fetching media data for post:", post.postID);
        api
            .get(`/api/posts/media/${post.postID}/`)
            .then((res) => {
                setMedia(res.data);
                console.log("Media data fetched:" + post.postID, res.data);
                console.log("Post ID:", post.postID);
            })
            .catch((err) => console.error("Error fetching media data:", err));
    };


    useEffect(() => {
        getComments()
        getMyProfile()
        if (post.hasMedia) { fetchMedia() }
    }, [post])


    const navigate = useNavigate()
    const handleProfileClick = () => navigate(`/profile/${thisUser.username}`)
    const handleShare = async () => {
        event.preventDefault()
        try {
            await navigator.clipboard.writeText(`http://circuitsocial.tech/post/view/${post.postID}`);
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
    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? media.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === media.length - 1 ? 0 : prevIndex + 1));
    };


    return (
        <main>
            <AppBar position="fixed">
                <Toolbar sx={{ display: 'flex', alignItems: 'center', width: '102%' }}>

                    {/* Logo - Aligned to the left */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 1 }}>
                        <Link to="/home"> {/* Redirect to the home page */}
                            <img
                                src={logo} // Path to your logo
                                alt="Logo"
                                style={{
                                    width: 85,  // Adjust size of the logo
                                    height: 60,
                                    marginRight: '1px',
                                    cursor: 'pointer', // Make it clear that the logo is clickable
                                }}
                            />
                        </Link>
                    </Box>

                    {/* Centered Text and SearchBar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Typography variant="h6" sx={{ textAlign: 'center', marginRight: 1 }}>
                            CircuitSocial
                        </Typography>
                        <SearchBar />
                    </Box>

                    {/* Avatar - Aligned to the right */}
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                        <Link to={`/profile/${myProfile.username}`}> {/* Navigate to the user's profile */}
                            <Avatar
                                src={myProfile.profilePicture} // Path to the avatar image
                                alt={`${myProfile.username}'s Avatar`}
                                sx={{
                                    width: 40, // Adjust avatar size
                                    height: 40,
                                    cursor: 'pointer', // Make it clickable
                                    marginRight: 3, // Add space between avatar and username
                                }}
                            />
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>
            <Menu />
            <div className="content">
                <div className="main-post">
                    <div className="post-page-options-buttons">
                        <button className="pfp-post-main-btn" onClick={handleProfileClick} data-cy="profile-picture"><img className="pfp-post-main" src={thisUser.profilePicture} /></button>

                        <ButtonGroup variant="contained" >
                            <Button startIcon=<ShareIcon /> onClick={handleShare}>share</Button>
                            {isMyPost && <Button startIcon=<EditIcon /> onClick={() => navigate(`/post/edit/${post.postID}`)}> Edit</Button>}
                        </ButtonGroup>
                    </div>
                    <h1 className="post-title" data-cy="post-title">{post.title}</h1>
                    <p className="post-description" data-cy="post-description">{post.description}</p>

                    {post.hasMedia && media.length > 0 && (
                        <div className="post-media">
                            {media.length > 1 && (<KeyboardArrowLeftIcon onClick={handlePrevImage} style={{ cursor: 'pointer' }} />)}
                            <img
                                key={media[currentImageIndex].mediaID}
                                src={media[currentImageIndex].image}
                                alt={`Post image ${currentImageIndex + 1}`}
                                className="post-image"
                            />
                            {media.length > 1 && (<KeyboardArrowRightIcon onClick={handleNextImage} style={{ cursor: 'pointer' }} />)}
                        </div>
                    )}

                    <h5 className="post-date" data-cy="post-date">{formattedDate}</h5>
                    {post.hasEdit && (<h6 className="edit-date">Edited: {formattedEditDate}</h6>)}
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
