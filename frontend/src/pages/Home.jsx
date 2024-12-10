import LoginForm from "../components/LoginForm"

function Home() {  //This will call the Form created in Form.jsx using the following props (properties)
    return <LoginForm route="/api/token/" />
}

export default Home
