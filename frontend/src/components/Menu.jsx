import { useNavigate } from "react-router-dom";

export default function Menu() {
    const navigate = useNavigate();
    const handleProfile = () => {
        navigate("/profile/")
    }
    const handleHome = () => {
        navigate("/")
    }
    const handleCommunities = () => {
        navigate("/communities")
    }
    const handleMessages = () => {
        navigate("/messages")
    }

    return (
        <div className="menu">
            <button className="menu-button" type="button" onClick={handleProfile}>Profile</button>
            <button className="menu-button" type="button" onClick={handleHome}>Home</button>
            <button className="menu-button" type="button" onClick={handleCommunities}>Communities</button>
            <button className="menu-button" type="button" onClick={handleMessages}>Messages</button>
            {/* <h1>Profile</h1>
            <h1>Home</h1>
            <h1>Communities</h1>
            <h1>Messages</h1> */}
        </div>
    );
}