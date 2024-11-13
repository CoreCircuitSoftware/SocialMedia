import { useNavigate } from "react-router-dom";
import React from 'react';

export default function Menu() {
    const navigate = useNavigate();
    const handleProfile = () => {
        navigate("/profile")
    }
    const handleHome = () => {
        navigate("/home")
    }
    const handleCommunities = () => {
        navigate("/communities")
    }
    const handleMessages = () => {
        navigate("/message")
    }

    return (
        <div className="menu">
            <button className="menu-button" type="button" data-cy="profile" onClick={handleProfile}>Profile</button>
            <button className="menu-button" type="button" data-cy="home" onClick={handleHome}>Home</button>
            <button className="menu-button" type="button" onClick={handleCommunities}>Communities</button>
            <button className="menu-button" type="button" onClick={handleMessages}>Messages</button>
            {/* <h1>Profile</h1>
            <h1>Home</h1>
            <h1>Communities</h1>
            <h1>Messages</h1> */}
        </div>
    );
}
// import { useNavigate } from "react-router-dom";
// import { Navbar, Nav, Container } from 'react-bootstrap';  // Import Bootstrap components

// export default function Menu() {
//     const navigate = useNavigate();

//     const handleProfile = () => {
//         navigate("/profile/");
//     };
//     const handleHome = () => {
//         navigate("/");
//     };
//     const handleCommunities = () => {
//         navigate("/communities");
//     };
//     const handleMessages = () => {
//         navigate("/messages");
//     };

//     return (
//         <Navbar bg="light" expand="lg" fixed="top">
//             <Container>
//                 <Navbar.Brand href="/">SocialMediaApp</Navbar.Brand>
//                 <Navbar.Toggle aria-controls="basic-navbar-nav" />
//                 <Navbar.Collapse id="basic-navbar-nav">
//                     <Nav className="me-auto">
//                         <Nav.Link onClick={handleHome}>Home</Nav.Link>
//                         <Nav.Link onClick={handleProfile}>Profile</Nav.Link>
//                         <Nav.Link onClick={handleCommunities}>Communities</Nav.Link>
//                         <Nav.Link onClick={handleMessages}>Messages</Nav.Link>
//                     </Nav>
//                 </Navbar.Collapse>
//             </Container>
//         </Navbar>
//     );
// }
