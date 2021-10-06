var url = ""

/* 
ISSUE: Heroku doesn't seem to set NODE_ENV to production. Logging process.env.NODE_ENV outputs "development" 
Manually change url for now
*/
// if (process.env.NODE_ENV === 'production') {
//     url = "https://sb-rideshare-backend.herokuapp.com"
// } else {
//     url = "http://localhost:9000"
// }
url = "https://sb-rideshare-backend.herokuapp.com"
//url = "http://localhost:9000"

export const API_URL = url