import axios from 'axios'

const http = axios.create({
    baseURL:'http://localhost:8800'
    // baseURL:'http://39.106.186.110:8800'
    // baseURL:'http://101.200.121.0:8800'
})

export default http
