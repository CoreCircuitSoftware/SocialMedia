import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Material-UI imports
import { TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        // <div className="search-bar">
        //     <input
        //         className="search-input"
        //         type="text"
        //         value={userChunk}
        //         onChange={(e) => setUserChunk(e.target.value)}
        //         placeholder="Find users"
        //     />
        //     <button className="form-button" onClick={handleSearch}>
        //         Search
        //     </button>
        // </div>
        <TextField
            variant="outlined"
            size="small"
            placeholder="Find users"
            value={userChunk}
            onChange={(e) => setUserChunk(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{
                endAdornment: (
                <IconButton onClick={handleSearch}>
                    <SearchIcon />
                </IconButton>
                ),
            }}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
        />
    );
}