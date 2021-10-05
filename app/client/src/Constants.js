var url = ""

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    url = "http://localhost:9000"
} else {
    url = "https://sb-rideshare-backend.herokuapp.com"
}


export const API_URL = url