import { useEffect, useState } from "react";
import api from "../api"

export default function MessageDisplay(slug) {
    const [username, setUsername] = useState([]);
    const [message, setMessage] = useState(slug.message.message)

    const getProfile2 = () => {
        api
            .get(`/api/profile/getuserdata2/${slug.message.sender}/`)
            .then((res) => res.data)
            .then((data) => {
                setUsername(data.username)
            })
            .catch((err) => console.log('h'));
    }

    useEffect(() => {
        getProfile2()
    }, [slug.message.sender])

    return (
        <p>{username}: {message}</p>
    )
}