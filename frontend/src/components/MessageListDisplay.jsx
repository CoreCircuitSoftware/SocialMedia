import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/MessageListDisplay.css"
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

export default function MessageListDisplay(slug) {
    const [convo, setConvo] = useState(slug.convo)
    const [myProfile, setMyProfile] = useState(slug.myProfile)
    const [otherUser, setOtherUser] = useState([])
    const [latestMessage, setLatestMessage] = useState([])
    
    const getLatestMessage = async () => {
        api
            .get(`/api/message/latest/${convo.convo}/`)
            .then((res) => res.data)
            .then((data) => {
                setLatestMessage(data)
            })
            .catch((err) => setLatestMessage(
                { message: "" }
            ));
    }

    const getUser = async () => {
        api
            .get(`/api/profile/getuserdata2/${convo.user}/`)
            .then((res) => res.data)
            .then((data) => {
                setOtherUser(data)
            })
            .catch((err) => alert(err));
    }

    useEffect(() => {
        getLatestMessage()
        getUser()
    }, [])

    const navigate = useNavigate()

    return (   
            <div className="MessageListDisplayHolder-combined" 
                onClick={() => {
                    slug.getOtherUser(otherUser.username)
                    slug.onConvoSelect(convo.convo)
                    navigate(`/messages`)
                }}>
                <div className="MessageListDisplayHolder-top">
                    {(otherUser.profilePicture === "") ? (
                        <img className="friendlistimage" src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" alt="profile"></img>
                    ) : (
                        <img className="friendlistimage" src={otherUser.profilePicture} alt="profile" />
                    )}
                    <h3>{otherUser.username}</h3>
                </div>
                <div className="MessageListDisplayHolder-bottom">
                    {(latestMessage.sender === myProfile.id) ? (
                        <p style={{ margin: 0 }}>
                            <b>You said:</b> {latestMessage.message.length > 20 ? `${latestMessage.message.slice(0, 20)}...` : latestMessage.message}
                        </p>
                    ) : (
                        <p style={{ margin: 0 }}>
                            <b>{otherUser?.username || "Unknown User"}</b> said: 
                                {latestMessage?.message && latestMessage.message.length > 20 ? `${latestMessage.message.slice(0, 20)}...` : latestMessage?.message || "No message available"}
                        </p>
                    )}
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: "-10px", 
                }}>
                    <ArrowForwardIcon style={{
                        fontSize: "24px",
                        transform: "translateY(-55px)", // Fine-tune the vertical position
                        }}>
                    </ArrowForwardIcon>
                </div>
                
            </div>

       
    )
}
