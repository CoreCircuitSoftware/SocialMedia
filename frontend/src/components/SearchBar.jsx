import { useNavigate } from "react-router-dom";

import { useState } from "react";

export default function SearchBar() {
    const navigate = useNavigate();
    const [userChunk, setUserChunk] = useState("");

    const handleSearch = async () => {
        if (userChunk.length > 0) {
            console.log(`Searching for user "${userChunk}"`)
            navigate(`/search/profile/${userChunk}`)
        }
        else {
            console.log(`Loading all users`)
            navigate(`/search/profile`)
        }
    }

    return (
        <div className="search-bar">
            <input
                className="search-input"
                type="text"
                value={userChunk}
                onChange={(e) => setUserChunk(e.target.value)}
                placeholder="Find users"
            />
            <button className="form-button" onClick={handleSearch}>
                Search
            </button>
        </div>
    );
}