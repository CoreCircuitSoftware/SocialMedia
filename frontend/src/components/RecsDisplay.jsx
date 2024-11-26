import { useEffect, useState } from "react";
import api from "../api"
import React from "react";
import { useNavigate } from "react-router-dom";
// Material-UI imports
import { Card, CardHeader, Avatar, Button, CardActions } from "@mui/material";


export default function RecsDisplay(slug) {
    const navigate = useNavigate()
    const [thisUser, setThisUser] = useState(slug.rec);

    const handleGoToAccount = () => {
        navigate(`/profile/${thisUser.username}/`)
    }

    return (
        // <div className="recs-container">
        //     <button className="user-rec" onClick={handleGoToAccount}>{thisUser.username}</button>
        // </div>
        <Card sx={{ mb: 2 }}>
            <CardHeader
                avatar={<Avatar src={thisUser.profilePicture} alt={thisUser.displayName} />}
                title={thisUser.displayName}
                subheader={`@${thisUser.username}`}
            />
            <CardActions>
                <Button size="small" color="primary" onClick={handleGoToAccount}>
                View Profile
                </Button>
            </CardActions>
        </Card>
    );
}