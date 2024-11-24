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
            {thisUser.profilePicture ?
                (<img className="friendlistimage" src={thisUser.profilePicture} alt="profile" />)
                : (<img className="friendlistimage" src={thisUser.profilePicture} alt="profile" />)}
            <button className="user-rec" onClick={handleGoToAccount} data-cy="rec">{thisUser.username}</button>
            <a href={`/profile/${thisUser.username}/message`}>
                <img className="friendlistimage" src="https://icons.veryicon.com/png/o/miscellaneous/official-icon-of-flying-pig/mailbox-82.png"></img>
            </a>
        </div>
    );
}