import axios from 'axios'

const request = axios.create({
    baseURL: 'http://127.0.0.1:8080/api',
    timeout: 5000,
    headers: {
        // Authorization: 'Bearer YOUR_TOKEN_HERE'
    }
})

export default request
