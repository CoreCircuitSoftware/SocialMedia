import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";  
import Menu from '../components/Menu'; 
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import CommentDisplay from "../components/CommentsDisplay";
import "../styles/Post.css";

export default function PostPage() {
    const { postid } = useParams()
    const [post, setPost] = useState([])
    const [thisUser, setThisUser] = useState([])
    const [isMyPost, setIsMyPost] = useState(false)
    const [commentContent, setcommentContent] = useState('')
    const [comments, setComments] = useState([])
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
    )}

    useEffect(() => { 
        api.get(`/api/posts/${postid}/`)
            .then((res) => res.data)
            .then((data) => {
                setPost(data)
            })
            .catch((err) => console.log("Error LOL"))
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
            .catch((err) => alert("error"));
    }, [post])

    const handleCommentSubmit = (e) => {
        console.log("submitting comment")
        api
            .post('/api/comment/submit/', {commentContent: commentContent, post: post.postID})
            .then((res) => {
                window.location.reload();
            })
            .catch((err) => console.log(err))
    }

    const getComments = () => {
        if (typeof(post.postID) == "number") {
            api
            .get(`/api/comment/get/from-post/${post.postID}/`)
            .then((res) => res.data)
            .then((data) => {
                setComments(data.reverse())
            })
            .catch((err) => console.log(err))
        }
    }

    useEffect(() => {
        getComments()
        getMyProfile()
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

    return(
        <main>
            <SearchBar />
            <Menu />
            <div className="content">
                <div className="main-post">
                <button onClick={handleProfileClick} data-cy="profile-picture"><img className="pfp" src={thisUser.profilePicture} /></button>
                <div>
                    <button className="share-post-button" onClick={handleShare} data-cy="share-post">Share</button>
                    {isMyPost && (<button className="post-edit-button" onClick={() => navigate(`/post/edit/${thisPost.postID}`)}>edit</button>)}
                </div>  
                <h1 className="post-title" data-cy="post-title">{post.title}</h1>
                <p className="post-description" data-cy="post-description">{post.description}</p>
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
                            <button
                            type="button" 
                            className="comment-submit"
                            disabled={submitDisable()}
                            onClick={handleCommentSubmit}
                            data-cy="comment-submit"
                            >
                                Post Comment
                            </button>
                        ) : (
                            <button 
                            className="comment-submit-disabled"
                            disabled= {true}
                            data-cy="comment-submit-disabled"
                            Post Comment/>
                        )} 
                    </form>
                </div>
                <div className="comments">
                    {comments.length > 0 ? (
                        comments.map((comment) => (<CommentDisplay comment={comment} key={comment.commentID}/>))
                    ) : (
                        <p className="no-comments">No comments yet</p>  
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}