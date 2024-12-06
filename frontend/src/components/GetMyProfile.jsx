import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js"

export default function GetMyProfile() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        getProfile();

        if (profile.username) {
            navigate(`/profile/${profile.username}/`)
        }

    }, [profile])

    const getProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => {
                setProfile(data)
            })
            .catch((err) => alert(err));
    }

    return (
        <></>
    )
}