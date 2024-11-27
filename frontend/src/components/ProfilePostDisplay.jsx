import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/PostProfile.css"
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ChatBubble, Share, ThumbDown, ThumbDownAltOutlined, ThumbUp, ThumbUpAltOutlined } from "@mui/icons-material";
import Button from "@mui/material/Button";

export default function PostDisplay(slug) {
    // const [user, setUser] = useState([]);
    const [thisUser, setThisUser] = useState(slug.post.user);
    const [thisPost, setThisPost] = useState(slug.post)
    const [postVote, setPostVote] = useState(-1)
    const [isMyPost, setIsMyPost] = useState(false);
    const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0, total: 0 })
    const [numOfComments, setNumOfComments] = useState(0)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const envURL = 'https://django-s3-4800.s3.us-east-2.amazonaws.com/'



    const [media, setMedia] = useState([]);

    //Media event handlers
    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? media.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === media.length - 1 ? 0 : prevIndex + 1));
    };


    useEffect(() => {
        // Fetch media data for the post
        const fetchMedia = async () => {
            api
                .get(`/api/posts/media/${thisPost.postID}/`)
                .then((res) => {
                    setMedia(res.data);
                    console.log("Media data fetched:" + thisPost.postID, res.data);
                    console.log("Post ID:", thisPost.postID);
                })
                .catch((err) => console.error("Error fetching media data:", err));
        };

        fetchMedia();
    }, [thisPost.postID]);

    // const formattedDate = new Date(thisPost.postDate).toLocaleDateString("en-US"
    const formattedDate = new Date(thisPost.postDate).toLocaleString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const formattedEditDate = new Date(thisPost.editDate).toLocaleString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const getUser = async () => {
        api
            .get(`/api/profile/getuserdata2/${thisUser}/`)
            .then((res) => res.data)
            .then((data) => {
                setThisUser(data)
            })
            .catch((err) => alert(err));
    }

    const getCommentsTotal = async () => {
        api
            .get(`api/posts/comments/gettotal/${thisPost.postID}/`)
            .then((res) => {
                const comments = res.data;
                setNumOfComments(comments.length)
            })
            .catch((err) => console.log(err))
    }

    const getVoteTotals = async () => { //get all votes for this post
        api
            .get(`api/posts/vote/gettotal/${thisPost.postID}/`)
            .then((res) => {
                const votes = res.data;
                const upvotes = votes.filter(vote => vote.vote === true).length;
                const downvotes = votes.filter(vote => vote.vote === false).length;
                setVotes({
                    upvotes: upvotes,
                    downvotes: downvotes,
                    total: upvotes - downvotes
                });
            })
            .catch((err) => console.log(err))
    }

    const getVote = async () => { //get vote for this post from current user
        api
            .get(`api/posts/vote/get/${thisPost.postID}/`)
            .then((res) => setPostVote(res.data.vote))
            .catch((err) => setPostVote(-1))
    }

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => {
                setIsMyPost(res.data.id === thisUser.id)
            }
            )
    }

    const changeVoteCountLocally = (voteType, e) => { // 0=add, 1=remove, 2=change
        if (e == 0) {
            if (voteType) {
                setVotes({
                    upvotes: votes.upvotes + 1,
                    downvotes: votes.downvotes,
                    total: votes.total + 1
                })
            } else {
                setVotes({
                    upvotes: votes.upvotes,
                    downvotes: votes.downvotes + 1,
                    total: votes.total - 1
                })
            }
        } else if (e == 1) {
            if (voteType) {
                setVotes({
                    upvotes: votes.upvotes - 1,
                    downvotes: votes.downvotes,
                    total: votes.total - 1
                })
            } else {
                setVotes({
                    upvotes: votes.upvotes,
                    downvotes: votes.downvotes + 1,
                    total: votes.total + 1
                })
            }
        } else if (e == 2) {
            if (voteType) {
                setVotes({
                    upvotes: votes.upvotes + 1,
                    downvotes: votes.downvotes - 1,
                    total: votes.total + 2
                })
            } else {
                setVotes({
                    upvotes: votes.upvotes - 1,
                    downvotes: votes.downvotes + 1,
                    total: votes.total - 2
                })
            }
        }
    }

    const handleVote = (voteType) => {
        if (postVote == -1) {
            changeVoteCountLocally(voteType, 0)
            api
                .post('/api/posts/vote/new/', { vote: voteType, post: thisPost.postID, user: thisUser.id })
                .catch((err) => console.log(err))
            setPostVote(voteType)
        } else if (postVote == voteType) {
            changeVoteCountLocally(voteType, 1)
            api
                .delete(`api/posts/vote/delete/${thisPost.postID}/`)
                .catch((err) => console.log(err))
            setPostVote(-1)
        } else {
            changeVoteCountLocally(voteType, 2)
            api
                .patch(`api/posts/vote/update/${thisPost.postID}/`, { vote: voteType })
                .catch((err) => console.log(err))
            setPostVote(voteType)
        }
    }

    const handlePostDelete = () => {
        api
            .delete(`api/posts/delete/${thisPost.postID}/`)
            .then(() => window.location.reload())
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getUser()
        getVoteTotals()
        getVote()
        getCommentsTotal()
    }, [])

    useEffect(() => { if (thisUser.id) { getMyProfile() } }, [thisUser])

    const navigate = useNavigate();
    const handleProfileClick = () => navigate(`/profile/${thisUser.username}`);
    const handlePostClick = () => navigate(`/post/view/${thisPost.postID}`);
    const handlePostShare = async () => {
        event.preventDefault()
        try {
            await navigator.clipboard.writeText(`http://circuitsocial.tech/post/view/${thisPost.postID}`);
        } catch (err) {
            console.log('Error copying profile link')
        }
    }

    return (
        <div className="post-container">
            <header>
                <button onClick={handleProfileClick}><img className="pfp" src={thisUser.profilePicture} /></button>
                <div className="name-text">
                    <h1>{thisUser.displayName}  @{thisUser.username}</h1>
                </div>
            </header>
            {/* <h2 className="post-title">{thisPost.title}</h2>
            <p className="post-description">{thisPost.description}</p>
            <h5 className="post-date">{formattedDate}</h5> */}
            {thisPost && (
                <>
                    <h2 className="post-title">{thisPost.title}</h2>
                    <p className="post-description">{thisPost.description}</p>

                    {/* Display post media */}
                    {thisPost.hasMedia && media.length > 0 && (
                        <div className="post-media">
                            <KeyboardArrowLeftIcon onClick={handlePrevImage} style={{ cursor: 'pointer' }} />
                            <img
                                key={media[currentImageIndex].mediaID}
                                src={media[currentImageIndex].image}
                                alt={`Post image ${currentImageIndex + 1}`}
                                className="post-image"
                            />
                            <KeyboardArrowRightIcon onClick={handleNextImage} style={{ cursor: 'pointer' }} />
                        </div>
                    )}

                    <h5 className="post-date">{formattedDate}</h5>
                </>
            )}
            {thisPost.hasEdit && (<h6 className="edit-date">Edited: {formattedEditDate}</h6>)}
            <div className="dropdown-content">
                {isMyPost ?
                    (<div>
                        <button className="post-edit-button" onClick={() => navigate(`/post/edit/${thisPost.postID}`)}>edit</button>
                        <button className="post-delete-button" onClick={handlePostDelete}>delete</button>
                        <Button variant='contained' color='primary' startIcon={<Share />} onClick={() => handlePostShare} data-cy="share">Share</Button>
                    </div>
                    ) : <Button variant='contained' color='primary' startIcon={<Share />} onClick={() => handlePostShare} data-cy="share">Share</Button>}
            </div>
            <div className="post-stats">
                {votes ? <p>{votes.total} votes</p> : <p>No votes yet</p>}
            </div>
            <div className="post-options">
                <Button variant='contained' color='primary' startIcon={postVote == 1 ? <ThumbUp /> : < ThumbUpAltOutlined />} onClick={() => handleVote(true)} data-cy="upvote"></Button>
                <Button variant='contained' color='primary' startIcon={postVote == 0 ? <ThumbDown /> : < ThumbDownAltOutlined />} onClick={() => handleVote(false)} data-cy="downvote"></Button>
                <Button variant='contained' color='primary' startIcon={<ChatBubble />} onClick={() => navigate(`/post/view/${thisPost.postID}`)} data-cy="comments">{numOfComments} comments</Button>
            </div>
        </div>
    );
}