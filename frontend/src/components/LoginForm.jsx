/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
// import "../styles/Form.css"


function LoginForm({ route }) {
    const [username, setUsername] = useState("");    //These are the fields that must be filled out by the form
    const [password, setPassword] = useState("");
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [missingUsername, setMissingUsername] = useState(false);
    const [missingPassword, setMissingPassword] = useState(false);
    const [accountError, setAccountError] = useState(false);
    const navigate = useNavigate();

    const sendWebhook = () => {
        const date = new Date();
        const formattedDate = date.toISOString();
        const content = {
            "embeds": [{
                "title": "New login",
                "url": `http://circuitsocial.tech/profile/${username}`,
                "fields": [
                    {
                        "name": "Username:",
                        "value": username,
                    },
                ],
                "timestamp": formattedDate
            }]
        }
        fetch('INSERTWEBHOOKHERE', {
            method: 'POST',
            body: JSON.stringify(content),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    useEffect(() => { 
        if (username.length > 5) {
            setMissingUsername(false);
        }
        if (password.length > 5) {
            setMissingPassword(false);
        }
    },[username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username) {setMissingUsername(true)}
        if (!password) {setMissingPassword(true)}
        if (!missingPassword || !missingUsername) {
            if (username.length > 0 && password.length > 0) {
                setMissingPassword(false);
                setMissingUsername(false);
            } else {
                return;
            }
        }
        setLoading(true);       //Start loading while the form is processed
        if (key == "CS4800" ) {   //If the key is correct and the fields are filled out
            setMissingPassword(false);
            setMissingUsername(false);
            try {
                console.log("password: ", password)
                console.log("username: ", username)
                const res = await api.post(route, { username, password })   //Set res variable to response from backend after sending form data
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                //navigate("/")
                sendWebhook()
                navigate("/profile");   //Should eventually just navigate to / (home) once that's set up
            } catch (error) {
                console.log(error)
                setAccountError(true)
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
            {accountError && (
                <h5 data-cy="acc-error">Error: Incorrect Account Credentials</h5> 
            )}
            {missingUsername && (
                <h5 data-cy="username-error">Error: Enter a username</h5> 
            )}
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                data-cy="username"
            />
            {missingPassword && (
                <h5 data-cy="password-error">Error: Enter a password</h5> 
            )}
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                data-cy="password"
            />
            <input
                className="form-input"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter login key"
                data-cy="key"
            />
            <button className="form-button" type="submit" data-cy="login">
                Login
            </button>
            <button className="form-button" type="button" data-cy="register" onClick={handleRegister}>
                Register
            </button>
        </form>
    );
}

export default LoginForm