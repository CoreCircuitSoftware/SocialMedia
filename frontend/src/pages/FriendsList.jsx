import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";  // Assume you have an API setup
import Menu from '../components/Menu'; // Adjust the path as needed
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer'; // If you want to include the footer too


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
                    setUserId(data[0].id);  // Set the user ID here
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
                    console.log(res.data);  // Log the response to see if data is correct
                    setFriends(res.data)
                })
                .catch((err) => console.log(err));
        }
    }, [userId]);
    
    return (
        <main>
            {/* Add the search bar at the top */}
            <SearchBar />
            
            {/* Add the menu bar */}
            <Menu />
            
            {/* The friends list content */}
            <div className="content">
                <h1>{username}'s Friends</h1>
                <ul>
                    {friends.length > 0 ? friends.map((friend) => {
                        const friendUser = friend.user1.id === userId ? friend.user2 : friend.user1;
                        console.log(friendUser);
                        return (
                            <li key={friend.friendShipID}>
                                <a href={`/profile/${friendUser.username}`}>{friendUser.username}</a>
                            </li>
                        );
                    }) : (
                        <p>No friends found.</p>
                    )}
                </ul>
            </div>
    
            {/* Optional Footer */}
            <Footer />
        </main>
    );    
}

