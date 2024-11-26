import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
// import "../styles/PostProfile.css"
import MessageListDisplay from "../components/MessageListDisplay";
import "../styles/MessageListDisplay.css"
import SearchBar from "../components/SearchBar";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

export default function MessageListPage() { 
    const [myProfile, setMyProfile] = useState([]);
    const [conversations, setConversations] = useState([]);

    const getMyProfile = () => {
        api
            .get(`/api/profile/`)
            .then((res) => res.data)
            .then((data) => setMyProfile(data))
            .catch((err) => alert(err));
    };

    const findConvos = () => {
        api
            .get(`/api/message/findconvos/${myProfile.id}/`)
            .then((res) => res.data)
            .then((data) => setConversations(data))
            .catch((err) => alert)
    }

    useEffect(() => { 
        if (myProfile) {
            findConvos()
        }
    }, [myProfile])

    useEffect(() => { 
        getMyProfile()
    }, [])

    return (
        <main>
            <SearchBar />
            <Menu />
            <Footer />
            <div className="MessageListPage">
                <h1>Your Conversations:</h1>
                <div>
                    {(conversations.length > 0) ? (
                        <div>
                            {conversations.map((convo) => {
                                return (
                                    <div>
                                        <MessageListDisplay convo={convo} myProfile={myProfile} key={convo.convo} />
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div>
                            <h1>No Conversations :&#40;</h1>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}