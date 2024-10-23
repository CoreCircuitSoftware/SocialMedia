import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";  
import Menu from '../components/Menu'; 
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer'; 
import '../styles/FriendsList.css'

export default function FriendsList() {
    const { username } = useParams();  // Get the username from the URL
    const [friends, setFriends] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Fetch profile ID based on username
        api.get(`/api/profile/getuserdata/${username}/`)
            .then((res) => res.data)
            .then((data) => {
                if (data && data.length > 0) {
                    setUserId(data[0].id);
                } else {
                    console.error("No profile data found.");
                }
            })
            .catch((err) => console.log(err));
    }, [username]);

    useEffect(() => {
        // Fetch friends once userId is set
        if (userId) {
            api.get(`/api/friends/${userId}/`)
                .then((res) => {
                    console.log(res.data); 
                    setFriends(res.data)
                })
                .catch((err) => console.log(err));
        }
    }, [userId]);
    
    return (
        <main>
            
            <SearchBar />
            
            
            <Menu />
            
            
            <div className="content">
                <h1>{username}'s Friends</h1>
                <ul>
                    {friends.length > 0 ? friends.map((friend) => {
                        const friendUser = friend.user1.id === userId ? friend.user2 : friend.user1;
                        console.log(friendUser);
                        return (
                            <li key={friend.friendShipID}>
                                <img className="friendlistimage" src={friendUser.profilePicture} alt="profile" />
                                <a href={`/profile/${friendUser.username}`}>{friendUser.username}</a>
                                <a href={`/profile/${friendUser.username}/message`}>
                                    <img className="friendlistimage" src="https://icons.veryicon.com/png/o/miscellaneous/official-icon-of-flying-pig/mailbox-82.png"></img>
                                </a>
                            </li>
                        );
                    }) : (
                        <p>No friends found.</p>
                    )}
                </ul>
            </div>
            <Footer />
        </main>
    );    
}

