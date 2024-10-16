import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";  // Assume you have an API setup
import Menu from '../components/Menu'; // Adjust the path as needed
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer'; // If you want to include the footer too


export default function FriendsList() {
    const { username } = useParams();  // Get the username from the URL
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        api.get(`/api/friends/${username}/`)  // Use the username to fetch friends
           .then(response => setFriends(response.data))
           .catch(err => console.log(err));
    }, [username]);

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
                    {friends.map((friend) => (
                        <li key={friend.id}>{friend.name}</li> // Display each friend's name
                    ))}
                </ul>
            </div>

            {/* Optional Footer */}
            <Footer />
        </main>
    );
}
