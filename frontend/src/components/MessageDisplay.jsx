import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Message.css"; // Add the provided CSS here.

export default function MessageDisplay({ message, myProfileId}) {
    const [username, setUsername] = useState("");
    const [pfp, setPfp] = useState("");
    const navigate = useNavigate();

    const getProfile = () => {
        api
            .get(`/api/profile/getuserdata2/${message.sender}/`)
            .then((res) => res.data)
            .then((data) => {
                setUsername(data.username);
                setPfp(data.profilePicture);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getProfile();
    }, [message.sender]);

    const navigateToProfile = () => {
        navigate(`/profile/${username}`);
    };

    // Determine if the message is from "me" or "them"
    const isMe = message.sender === myProfileId;

    return (
        <section className="message-bubble-page">
            <section className={isMe ? "me" : "them"}>
                {!isMe && (
                    <img
                        src={pfp}
                        alt={`${username}'s Avatar`}
                        className="pfp_icon"
                        onClick={navigateToProfile}
                    />
                )}
                <section className="msgs">
                    <p>{message.message}</p>
                </section>
        </section>
    </section>
    );
}
