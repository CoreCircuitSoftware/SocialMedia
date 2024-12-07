import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/MessageListDisplay.css"

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
                    <p><b>You said:</b> {latestMessage.message}</p>
                ) : (
                    <p><b>{otherUser.username}</b> said: {latestMessage.message}</p>
                )}
            </div>
        </div>
    )
}
