import { useEffect, useState } from "react";
import api from "../api"
import react from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { ButtonGroup } from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

export default function CommentDisplay(slug) {
    const [comment, setComment] = useState(slug.comment);
    const [thisUser, setThisUser] = useState();
    const [commentVote, setCommentVote] = useState();
    const [isMyComment, setIsMyComment] = useState(false);
    const [numOfReplies, setNumOfReplies] = useState(0);
    const [votes, setVotes] = useState({upvotes: 0, downvotes: 0, total: 0});
    const formattedDate = new Date(comment.commentDate).toLocaleString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const formattedEditDate = new Date(comment.editDate).toLocaleString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const getUser = async () => {
        api
            .get(`/api/profile/getuserdata2/${slug.comment.user}/`)
            .then((res) => res.data)
            .then((data) => {
                setThisUser(data)
            })
            .catch((err) => alert(err));
    }

    const getVoteTotals = async () => {
        api
            .get(`api/comment/vote/gettotal/${comment.commentID}/`)
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

    const getVote = async () => {
        api
            .get(`api/comment/vote/get/${comment.commentID}/`)
            .then((res) => setCommentVote(res.data.vote))
            .catch((err) => setCommentVote(-1))
    }

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => setIsMyComment(res.data.id === thisUser.id))
    };

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
        if (commentVote == -1) {
            changeVoteCountLocally(voteType, 0)
            api
                .post('/api/comment/vote/new/', {vote: voteType, comment: comment.commentID, user: thisUser.id})
                .catch((err) => console.log(err))
                setCommentVote(voteType)
        } else if (commentVote == voteType) {
           changeVoteCountLocally(voteType, 1)
            api
                .delete(`api/comment/vote/delete/${comment.commentID}/`)
                .catch((err) => console.log(err))
                setCommentVote(-1)
        } else {
            changeVoteCountLocally(voteType, 2)
            api
                .patch(`api/comment/vote/update/${comment.commentID}/`, {vote: voteType})
                .catch((err) => console.log(err))
                setCommentVote(voteType)
        }
    }

    const getCommentRepliesTotal = async () => {
        api
            .get(`/api/comment/replies/gettotal/${comment.commentID}/`)
            .then((res) => res.data)
            .then((data) => {
                setNumOfReplies(data.length)
            })
            .catch((err) => console.log(err))
    }

    const handleCommentDelete = () => {
        api
            .delete(`/api/comment/delete/${comment.commentID}/`)
            .then((res) => {
                window.location.reload();
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {getUser(), getVoteTotals(), getCommentRepliesTotal()}, [])
    useEffect(() => {getVote(), getMyProfile()}, [thisUser])

    const navigate = useNavigate();
    const handleProfileClick = () => navigate(`/profile/${thisUser.username}`);
    const handleCommentClick = () => navigate(`/comment/view/${comment.commentID}`);
    const handleCommentsShare = async () => {
        event.preventDefault()
        try {
            await navigator.clipboard.writeText(`http://circuitsocial.tech/comment/view/${comment.commentID}`);
        } catch (err) {
            console.log('Error copying profile link')
        }
    }

    return (
        <div className="comment_main">
            {thisUser ? (
                <div className="comment_container">
                    <div className="comment-display-top">
                        {(thisUser.profilePicture === "") ? (
                            <img className="friendlistimage" src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" alt="profile"></img>
                        ) : (
                            <img className="friendlistimage" src={thisUser.profilePicture} alt="profile" />
                        )}
                        <h3>{thisUser.displayName} @{thisUser.username}</h3>
                    </div>              
                    <p>{comment.commentContent}</p>
                    <h6 className="comment-date">{formattedDate}</h6>
                    {comment.hasEdit && (<h6 className="comment-date">Edited: {formattedEditDate}</h6>)}
                    <div className="comment-stats">
                        {votes ? <h5>{votes.total} votes</h5> : <p>No votes yet</p>}
                    </div>
                    <div className="comment-options">
                        <ButtonGroup variant="contained" >
                            {commentVote == 1 ? <Button startIcon=<ThumbUpAltIcon/> onClick={() => handleVote(true)}>Upvoted</Button> : <Button startIcon=<ThumbUpOffAltIcon/> onClick={() => handleVote(true)}>Upvote</Button>}
                            {commentVote == 0 ? <Button startIcon=<ThumbDownAltIcon/> onClick={() => handleVote(false)}>Downvoted</Button> : <Button startIcon=<ThumbDownOffAltIcon/> onClick={() => handleVote(false)}>Downvote</Button>}
                            {!comment.replyTo ? <Button startIcon=<ChatBubbleIcon/> onClick={handleCommentClick}>{numOfReplies} replies</Button> : null}
                        </ButtonGroup>
                    </div>
                    <div class="comment-dropdown-content">
                        {(isMyComment) ? 
                            (<div>
                                <ButtonGroup variant="contained" >
                                    <Button startIcon=<EditIcon/> onClick={() => navigate(`/comment/edit/${comment.commentID}`)}>Edit</Button>
                                    <Button startIcon=<DeleteIcon/> onClick={handleCommentDelete}> Delete</Button>
                                    {!comment.replyTo ? <Button startIcon=<ShareIcon/> onClick={handleCommentsShare}>share</Button> : null}
                                </ButtonGroup>
                            </div>) : (!comment.replyTo ? <Button variant="contained" startIcon=<ShareIcon/> onClick={handleCommentsShare}>share</Button> : null)}
                    </div>              
                </div>
            ) : comment.user}
        </div>
    )
}