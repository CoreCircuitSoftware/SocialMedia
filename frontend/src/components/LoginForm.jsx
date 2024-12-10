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
        // if (key == "CS4800" ) {   //If the key is correct and the fields are filled out
        //     setMissingPassword(false);
        //     setMissingUsername(false);
        //     try {
        //         console.log("password: ", password)
        //         console.log("username: ", username)
        //         const res = await api.post(route, { username, password })   //Set res variable to response from backend after sending form data
        //         localStorage.setItem(ACCESS_TOKEN, res.data.access);
        //         localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        //         //navigate("/")
        //         sendWebhook()
        //         navigate("/profile");   //Should eventually just navigate to / (home) once that's set up
        //     } catch (error) {
        //         console.log(error)
        //         setAccountError(true)
        //     } finally { //Eventually, no matter what happens, loading must stop at the end
        //         setLoading(false)
        //     }
        // } else {
        //     alert("Invalid Key")
        //     setLoading(false)
        // }
        try {
            console.log("password: ", password);
            console.log("username: ", username);
    
            const res = await api.post(route, { username, password }); // Set res variable to response from backend after sending form data
    
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
    
            sendWebhook();
            navigate("/profile"); // Navigate to profile
        } catch (error) {
            console.log(error);
            setAccountError(true);
            alert("Invalid Credentials")
        } finally {
            setLoading(false); // Loading must stop at the end
        }
    }
    const handleRegister = () => {   //Will send user to alternate form (logout->register and vice versa)
        navigate("/register");
    }

    //This is the basic format of a form, note that 'name' is the const declared above and dictates the form's name
    return (
        <>
            {/* Image positioned separately */}
            <img
                src="src/assets/login images/pexels-photo-6432056.jpeg" // Replace with the actual image path
                alt="Login Illustration"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "30%", // Position image separately from the form
                    transform: "translate(-50%, -50%)",
                    width: "905px",
                    height: "830px",
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
                    right: "26%", 
                    transform: "translate(-50%, -50%)",
                    objectFit: "cover",
                   
                }}
            />
           
        <div className="Login Header" 
            style={{
             width:"300px",
             position: "absolute",
             top: "5%",
             left: "72%",
             }}>
            <h5 style={{ fontSize: "35px", fontWeight: "bold", marginLeft: "0px"}}> 
                Circuit Social
            </h5>
        </div>
             {/* Form */}
            <form 
                onSubmit={handleSubmit} 
                className="form-container"
                style={{
                    display: "flex",
                    marginTop: "120px",
                    marginRight: "100px",
                    flexDirection: "column"
                    }}>

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
                    style={{marginBottom: "-18px"}}
                />
                <h5 style={{marginRight: "225px", marginBottom: "1px", fontSize: "12px"}}> Required Field*</h5>
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
                    style={{marginBottom: "-18px"}}
                />
                <h5 style={{marginRight: "225px", marginBottom: "-1px", fontSize: "12px"}}> Required Field*</h5>
                {/* <input
                    className="form-input"
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter login key"
                    data-cy="key"
                /> */}
                <button className="form-button" type="submit" data-cy="login">
                    Login
                </button>
                <button className="form-button" type="button" data-cy="register" onClick={handleRegister}>
                    Register
                </button>
            </form>
        </>
        
    );
}

export default LoginForm