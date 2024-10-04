import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/PostProfile.css"


export default function PostDisplay(slug) {
    const [user, setUser] = useState([]);
    const [thisUser, setThisUser] = useState(slug.profile);
    // const thisUser = slug.user
    const thisPost = slug.post
    const formattedDate = new Date(thisPost.postDate).toLocaleDateString("en-US")


    // useEffect(() => {
    //     console.log(slug.profile)
    //     getUser()
    //     console.log(user.id)
    // }, [])


    // const getUser = async () => {
    //     api
    //         .get(`/api/profile/getuserdata/${thisUser.id}/`)
    //         .then((res) => res.data)
    //         .then((data) => {
    //             setUser(data[0])
    //         })
    //         .catch((err) => alert(err));
    // }

    return (
        <div className="post-container">
            <header>
                <img className="pfp" src={thisUser.profilePicture} />
                <div className="name-text">
                    <h1>{thisUser.displayName}  @{thisUser.username}</h1>
                </div>
            </header>
            <h2 className="post-title">{thisPost.title}</h2>
            <p className="post-description">{thisPost.description}</p>
            <h5 className="post-date">{formattedDate}</h5>
        </div>
    );
}