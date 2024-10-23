import react from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import UserProfile from "./pages/UserProfile"
import Notes from "./pages/Notes"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import ProfileForm from "./components/ProfileForm"
import PostForm from "./components/PostForm"
import PostDisplay from "./components/ProfilePostDisplay"
import GetMyProfile from "./components/GetMyProfile"
import MessagePage from "./pages/Message"
import FriendsList from "./pages/FriendsList"; // Adjust path if necessary
import ProfileSearch from "./pages/ProfileSearch";


function Logout() { //Clear local storage of any tokens and redirect to login screen
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {  //Clear local storage to prevent token mixup with new account, direct to Register page
  localStorage.clear()
  return <Register />
}

//Will default to home if logged in and authorized (checked via protected route). Otherwise will route to Login.
//Register and other pages may be accessed through links, redirects, or modifying the url directory
//If no directory exists, it will default to the NotFound page
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <GetMyProfile />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="register" element={<RegisterAndLogout />} />
        <Route path="home" element={<Home />} />
        <Route path="profile/:username" element={<UserProfile />} />
        <Route path="profile/:username/message" element={<MessagePage />} />
        <Route path="profile/" element={<GetMyProfile />} />
        <Route path="profile/edit" element={<ProfileForm />} />
        <Route path="notes" element={<Notes />} />
        <Route path="post/create" element={<PostForm />} />
        <Route path="post/view" element={<PostDisplay />} />
        <Route path="message/" element={<PostForm />} />
        <Route path="profile/:username/friends" element={<FriendsList />} />
        <Route path="search/profile/:userchunk?" element={<ProfileSearch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
