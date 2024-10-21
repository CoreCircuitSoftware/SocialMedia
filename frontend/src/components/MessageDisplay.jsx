import { useEffect, useState } from "react";
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
                console.log(data)
                setUsername(data.username)
                setPfp(data.profilePicture)
            })
            .catch((err) => console.log('h'));
    }

    useEffect(() => {
        getProfile2()
    }, [slug.message.sender])

    return (
        <p><img className="pfp_icon" src={pfp} alt="profile" /> {username}: {message}</p>
    )
}