import { useNavigate } from "react-router-dom";
// Material-UI imports
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Message";
import "../styles/Themes.css";

export default function Menu() {
    const navigate = useNavigate();
    const menuItems = [
        { text: "Profile", icon: <PersonIcon />, action: () => navigate("/profile") },
        { text: "Home", icon: <HomeIcon />, action: () => navigate("/home") },
        // { text: "Communities", icon: <GroupIcon />, action: () => navigate("/communities") },
        { text: "Messages", icon: <MessageIcon />, action: () => navigate("/message") },
      ];

    return (
        
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
                                borderBottom: "0px solid #ffffff", // Add divider between items
                            },
                        }}
                    >
                        <ListItemButton
                            onClick={item.action}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                // Set border color
                                borderRadius: 0,
                                padding: "10px 16px",
                                backgroundColor: "#ffffff",
                                border: "2px solid #ffffff", // Add yellow border explicitly
                                "&:hover": {
                                    backgroundColor: "#f0f0f0", // Slightly darker yellow on hover
                                    border: "2px solid #fffff", // Keep border consistent on hover
                                },
                            
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