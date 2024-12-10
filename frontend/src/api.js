import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({  //With this, we no longer need to include the base URL in our paths, we can just put the appropriate path instead
    baseURL: '127.0.0.1'
    //baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);       //This will access local storage for the access token. 
        if (token) {                                            //If there is a token, add the token to the header of the request
            config.headers.Authorization = `Bearer ${token}`    //This is how you pass a JWT access token. NOTE, these are backticks (`, above tab) NOT single quotes (')
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);

export default api
