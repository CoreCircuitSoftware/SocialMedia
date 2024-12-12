/* eslint-disable react/prop-types */
import { useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"

function RegisterForm({ route }) {
    const [username, setUsername] = useState("");    //These are the fields that must be filled out by the form
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const sendWebhook = () => {
        const date = new Date();
        const formattedDate = date.toISOString();
        const content = {
            "embeds": [{
                "title": "New account registered!",
                "url": `http://circuitsocial.tech/profile/${username}`,
                "fields": [
                    {
                        "name": "Username:",
                        "value": username,
                        "inline": true
                    },
                    {
                        "name": "Display name:",
                        "value": displayName,
                        "inline": true
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

    const handleSubmit = async (e) => {
        setLoading(true);       //Start loading while the form is processed
        e.preventDefault();
    
        try {
            await api.post(route, { username, password, email, displayName })   //Set res variable to response from backend after sending form data
            sendWebhook()
            navigate("/login")   //Send to Profile page to finish setup? or back to login?
        } catch (error) {
            alert(error)
        } finally { //Eventually, no matter what happens, loading must stop at the end
            setLoading(false)
        }
    }
    const handleLogin = () => {   //Will send user to login form
        navigate("/login");
    }

    //This is the basic format of a form, note that 'name' is the const declared above and dictates the form's name
    return (
        <>  
            <img
                src="src/assets/login images/peakpx.jpg" // Replace with the actual image path
                alt="Login Illustration"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "70%", // Position image separately from the form
                    transform: "translate(-50%, -50%)",
                    width: "955px",
                    height: "930px",
                    objectFit: "cover",
                }}
            />
            <img
                src="src/assets/csbutwhiteoutlined.png" // Path to your logo
                alt="Logo"
                style={{
                    width: 85,
                    height: 70,
                    position: "absolute",
                    top: "14%",
                    left: "12%", 
                    transform: "translate(-50%, -50%)",
                    objectFit: "cover",
                   
                }}
            />
            <div className="Login Header" 
                style={{
                width:"300px",
                position: "absolute",
                top: "5%",
                left: "15%",
                }}>
                <h5 style={{ fontSize: "35px", fontWeight: "bold", marginLeft: "0px"}}> 
                    Circuit Social
                </h5>
            </div>

            <form 
                onSubmit={handleSubmit} 
                className="form-container"
                style={{
                    display: "flex",
                    marginTop: "120px",
                    marginLeft: "100px"
                    }}
                >
                <h1>Register</h1>
                <input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    data-cy="username"
                    style={{marginBottom: "-18px"}}
                />
                 <h5 style={{marginRight: "225px", marginBottom: "-1px", fontSize: "12px"}}> Required Field*</h5>
                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    data-cy="password"
                    style={{marginBottom: "-18px"}}
                />
                 <h5 style={{marginRight: "225px", marginBottom: "-1px", fontSize: "12px"}}> Required Field*</h5>
                <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    data-cy="email"
                    style={{marginBottom: "-18px"}}
                />
                <h5 style={{marginRight: "225px", marginBottom: "-1px", fontSize: "12px"}}> Required Field*</h5>
                <input
                    className="form-input"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display Name"
                    data-cy="display-name"
                   
                />
                <button className="form-button" type="submit" data-cy="register">
                    Register
                </button>
                <button className="form-button" type="button" onClick={handleLogin} data-cy="login">
                    Login
                </button>
            </form>
        </>
       
    );
}

export default RegisterForm