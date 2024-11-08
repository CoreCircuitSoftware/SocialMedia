import { useEffect, useState } from "react";
import api from "../api"
import React from "react";
import { useNavigate } from "react-router-dom";


export default function RecsDisplay(slug) {
    const navigate = useNavigate()
    const [thisUser, setThisUser] = useState(slug.rec);

    const handleGoToAccount = () => {
        navigate(`/profile/${thisUser.username}/`)
    }

    return (
        <div className="recs-container">
            <button className="user-rec" onClick={handleGoToAccount}>{thisUser.username}</button>
        </div>
    );
}