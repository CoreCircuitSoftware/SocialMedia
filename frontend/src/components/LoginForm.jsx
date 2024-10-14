/* eslint-disable react/prop-types */
import { useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"

function LoginForm({ route }) {
    const [username, setUsername] = useState("");    //These are the fields that must be filled out by the form
    const [password, setPassword] = useState("");
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);       //Start loading while the form is processed
        e.preventDefault();
        if (key == "CS4800") { 
            try {
                const res = await api.post(route, { username, password })   //Set res variable to response from backend after sending form data
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                //navigate("/")
                navigate("/profile");   //Should eventually just navigate to / (home) once that's set up
            } catch (error) {
                alert(error)
            } finally { //Eventually, no matter what happens, loading must stop at the end
                setLoading(false)
            }
        } else {
            alert("Invalid Key")
            setLoading(false)
        }
    }
    const handleRegister = () => {   //Will send user to alternate form (logout->register and vice versa)
        navigate("/register");
    }

    //This is the basic format of a form, note that 'name' is the const declared above and dictates the form's name
    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Login</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                className="form-input"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter login key"
            />
            <button className="form-button" type="submit">
                Login
            </button>
            <button className="form-button" type="button" onClick={handleRegister}>
                Register
            </button>
        </form>
    );
}

export default LoginForm