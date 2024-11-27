import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"
import "../styles/Message.css"

export default function MessageDisplay(slug) {
    const [username, setUsername] = useState([]);
    const [message, setMessage] = useState(slug.message.message)
    const [pfp, setPfp] = useState([]);

    const getProfile2 = () => {
        api
            .get(`/api/profile/getuserdata2/${slug.message.sender}/`)
            .then((res) => res.data)
            .then((data) => {
                setUsername(data.username)
                setPfp(data.profilePicture)
            })
            .catch((err) => console.log('h'));
    }

    useEffect(() => {
        getProfile2()
    }, [slug.message.sender])

    const navigate = useNavigate()

    const navigateToProfile = () => {navigate(`/profile/${username}`)}

    return (
        <p data-cy="message-display"><img className="pfp_icon" src={pfp} onClick={navigateToProfile} alt="profile"/> {username}: {message}</p>
    )
}