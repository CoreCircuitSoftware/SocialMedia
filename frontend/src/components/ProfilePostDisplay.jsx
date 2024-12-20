import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/PostProfile.css"
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ChatBubble from "@mui/icons-material/ChatBubble";
import Share from "@mui/icons-material/Share";
import ThumbDown from "@mui/icons-material/ThumbDown";
import ThumbDownAltOutlined from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUp from "@mui/icons-material/ThumbUp";
import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";


export default function PostDisplay(slug) {
    const [thisUser, setThisUser] = useState(slug.post.user);
    const [thisPost, setThisPost] = useState(slug.post)
    //const [thisComm, setThisCommunity] = useState(slug)
    const [postVote, setPostVote] = useState(-1)
    const [isMyPost, setIsMyPost] = useState(false);
    const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0, total: 0 })
    const [numOfComments, setNumOfComments] = useState(0)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const envURL = 'https://django-s3-4800.s3.us-east-2.amazonaws.com/'



    const [media, setMedia] = useState([]);
    const [community, setCommunity] = useState([]);

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
                })
                .catch((err) => console.error("Error fetching media data:", err));
        };
        const fetchCommunity = async () => {
            api
                .get(`/api/community/getdataid/${thisPost.community}/`)
                .then((res) => {
                    setCommunity(res.data);
                })  
                .catch((err) => console.error("Error fetching community data:", err));

        }

        if (thisPost.hasMedia) {
            fetchMedia();
        }
        if (thisPost.community != null){
            fetchCommunity();
        }
        
    }, [thisPost.postID]);

    // const formattedDate = new Date(thisPost.postDate).toLocaleDateString("en-US"
    const [loading, setLoading] = useState(true)
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
            .get(`/api/profile/getuserdata2/${slug.post.user}/`)
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
            setPostVote(voteType)
        } else if (postVote == voteType) {
            changeVoteCountLocally(voteType, 1)
            api
                .delete(`api/posts/vote/delete/${thisPost.postID}/`)
            setPostVote(-1)
        } else {
            changeVoteCountLocally(voteType, 2)
            api
                .patch(`api/posts/vote/update/${thisPost.postID}/`, { vote: voteType })
            setPostVote(voteType)
        }
    }

    const handlePostDelete = () => {
        api
            .delete(`api/posts/delete/${thisPost.postID}/`)
            .then(() => window.location.reload())
    }

    useEffect(() => {
        getUser()
        getVoteTotals()
        getVote()
        getCommentsTotal()
    }, [])

    useEffect(() => { if (thisUser.id) { getMyProfile() } }, [thisUser])
    useEffect(() => {
        if (thisUser && thisPost && slug.post) {
            setLoading(false)
        }
    }, [thisUser])

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
    const goToCommunity = () => navigate(`/community/view/${community.name}`)

    return (
        <div className="post-container" data-cy="post-display">
            {loading ? <h1>Loading Post...</h1> : <div>
            <header>
                <button onClick={handleProfileClick}><img className="pfp" src={thisUser.profilePicture} /></button>
                <div className="name-text">
                    {(thisPost.community != null) ? (
                        <h1 onClick={goToCommunity}>{community.name}  @{thisUser.username}</h1> 
                    ):(
                        <h1>{thisUser.displayName}  @{thisUser.username}</h1>
                    )}    
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

                    <h5 className="post-date">{formattedDate}</h5>
                </>
            )}
            {thisPost.hasEdit && (<h6 className="edit-date">Edited: {formattedEditDate}</h6>)}
            <div className="dropdown-content">
                {isMyPost ?
                    (<div>
                        <ButtonGroup variant="contained">
                            <Button onClick={() => navigate(`/post/edit/${thisPost.postID}`)}>edit</Button>
                            <Button onClick={handlePostDelete}>delete</Button>
                            <Button variant='contained' color='primary' startIcon={<Share />} onClick={handlePostShare} data-cy="share">Share</Button>
                        </ButtonGroup>
                    </div>
                    ) : <Button variant='contained' color='primary' startIcon={<Share />} onClick={handlePostShare} data-cy="share">Share</Button>}
            </div>
            <div className="post-stats">
                {votes ? <p>{votes.total} votes</p> : <p>No votes yet</p>}
            </div>
            <div className="post-options">
                <ButtonGroup variant="contained" >
                    {postVote == 1 ? <Button startIcon={<ThumbUp />} onClick={() => handleVote(true)}>Upvoted</Button> : <Button startIcon={<ThumbUpAltOutlined />} onClick={() => handleVote(true)}>Upvote</Button>}
                    {postVote == 0 ? <Button startIcon={<ThumbDown />} onClick={() => handleVote(false)}>Downvoted</Button> : <Button startIcon={<ThumbDownAltOutlined />} onClick={() => handleVote(false)}>Downvote</Button>}
                    <Button startIcon={<ChatBubble />} onClick={handlePostClick}>{numOfComments} comments</Button>
                </ButtonGroup>
            </div>
            </div>}
        </div>
    );
}