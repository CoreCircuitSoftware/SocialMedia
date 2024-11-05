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
    const [commentContent, setcommentContent] = useState('')
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

    useEffect(() => { 
        api.get(`/api/posts/${postid}/`)
            .then((res) => res.data)
            .then((data) => {
                setPost(data)
                console.log(data)
            })
            .catch((err) => console.log("Error LOL"))
    }, [postid])

    // useEffect(() => { 
    //     console.log(typeof(commentContent))
    // }, [commentContent])

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
                console.log("success")
            })
            .catch((err) => console.log(err))
    };
    

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
                <button className="logout-button" onClick={handleShare} data-cy="share">Share</button> 
                <h1 className="post-title" data-cy="post-title">{post.title}</h1>
                <p className="post-description" data-cy="post-description">{post.description}</p>
                <h5 className="post-date" data-cy="post-date">{formattedDate}</h5>
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
                    <CommentDisplay />
                </div>
            </div>
            <Footer />
        </main>
    );
}