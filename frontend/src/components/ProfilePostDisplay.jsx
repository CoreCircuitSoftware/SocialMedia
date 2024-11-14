import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/PostProfile.css"


export default function PostDisplay(slug) {
    const [thisUser, setThisUser] = useState();
    const [thisPost, setThisPost] = useState(slug.post)
    const [postVote, setPostVote] = useState(-1)
    const [isMyPost, setIsMyPost] = useState(slug.post.user == slug.curUser.id);
    const [votes, setVotes] = useState({upvotes: 0, downvotes: 0, total: 0})
    const [numOfComments, setNumOfComments] = useState(0)
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
        } else if (e == 1){
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
                .post('/api/posts/vote/new/', {vote: voteType, post: thisPost.postID, user: thisUser.id})
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
                .patch(`api/posts/vote/update/${thisPost.postID}/`, {vote: voteType})
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

    return (
        <div className="post-container" data-cy="post-display">
            {loading ? <h1>Loading Post...</h1> : <div>
            <header>
                <button onClick={handleProfileClick} data-cy="profile-picture"><img className="pfp" src={thisUser.profilePicture} /></button>
                <div className="name-text">
                    <h1>{thisUser.displayName}  @{thisUser.username}</h1>
                </div>
            </header>
            <h2 className="post-title" data-cy="post-title">{thisPost.title}</h2>
            <p className="post-description" data-cy="post-description">{thisPost.description}</p>
            <h5 className="post-date" data-cy="post-date">{formattedDate}</h5>
            {thisPost.hasEdit && (<h6 className="edit-date">Edited: {formattedEditDate}</h6>)}
            <div className="dropdown-content">
                    {isMyPost ? 
                        (<div>
                            <button className="post-edit-button" onClick={() => navigate(`/post/edit/${thisPost.postID}`)}>edit</button>
                            <button className="post-delete-button" onClick={handlePostDelete}>delete</button>
                            <button className="post-share-button" onClick={handlePostShare}>share</button>
                        </div>
                        ) : <button className="post-share-button" onClick={handlePostShare}>share</button>}
            </div>
            <div className="post-stats">
                {votes ? <p>{votes.total} votes</p> : <p>No votes yet</p>}
            </div>
            <div className="post-options">
                <button onClick={() => handleVote(true)}>
                    {postVote == 1 ? <b>Upvoted</b> : "Upvote"}
                </button>
                <button onClick={() => handleVote(false)}>
                    {postVote == 0 ? <b>Downvoted</b> : "Downvote"}
                </button>
                <button onClick={handlePostClick}>{numOfComments} comments</button>
            </div>
            </div>}
        </div>
    );
}