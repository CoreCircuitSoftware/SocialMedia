import { useNavigate } from "react-router-dom";
// Material-UI imports
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Message";

export default function Menu() {
    const navigate = useNavigate();
    // const handleProfile = () => {
    //     navigate("/profile")
    // }
    // const handleHome = () => {
    //     navigate("/home")
    // }
    // const handleCommunities = () => {
    //     navigate("/communities")
    // }
    // const handleMessages = () => {
    //     navigate("/message")
    // }
    const menuItems = [
        { text: "Profile", icon: <PersonIcon />, action: () => navigate("/profile") },
        { text: "Home", icon: <HomeIcon />, action: () => navigate("/home") },
        { text: "Communities", icon: <GroupIcon />, action: () => navigate("/communities") },
        { text: "Messages", icon: <MessageIcon />, action: () => navigate("/message") },
      ];

    return (
        // <div className="menu">
        //     <button className="menu-button" type="button" data-cy="profile" onClick={handleProfile}>Profile</button>
        //     <button className="menu-button" type="button" data-cy="home" onClick={handleHome}>Home</button>
        //     <button className="menu-button" type="button" onClick={handleCommunities}>Communities</button>
        //     <button className="menu-button" type="button" onClick={handleMessages}>Messages</button>
        //     {/* <h1>Profile</h1>
        //     <h1>Home</h1>
        //     <h1>Communities</h1>
        //     <h1>Messages</h1> */}
        // </div>
        // <List>
        // {menuItems.map((item) => (
        //     <ListItem disablePadding key={item.text}>
        //     <ListItemButton onClick={item.action}>
        //         <ListItemIcon>{item.icon}</ListItemIcon>
        //         <ListItemText primary={item.text} />
        //     </ListItemButton>
        //     </ListItem>
        // ))}
        // </List>
        <Paper elevation={3}
        sx={{
            position: "fixed",       // Fixes the sidebar on the left side
            top: 83,
            left: 0,
            height: "calc(100vh - 83px)",
            width: 250,
            backgroundColor: "#ffffff",
            borderRadius: 0,         // Removes border radius for a more solid look
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",  // Adds a slight shadow
            display: "flex",
            flexDirection: "column",
            padding: "20px 0",
        }}
        >
            <List sx={{ padding: 0 }}>
                {menuItems.map((item) => (
                    <ListItem
                        disablePadding
                        key={item.text}
                        sx={{
                            border: "none",
                            "&:not(:last-child)": {
                                borderBottom: "1px solid #e0e0e0", // Add divider between items
                            },
                        }}
                    >
                        <ListItemButton
                            onClick={item.action}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                borderRadius: 1,
                                padding: "10px 16px",
                                "&:hover": {
                                    backgroundColor: "#e0e0e0",
                                }
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
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
