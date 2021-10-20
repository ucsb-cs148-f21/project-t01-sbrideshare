
export default function getBackendURL() {
    var backend_url;
    if(process.env.NODE_ENV === "development"){
        backend_url = "http://localhost:9000"; 
    }
    else{
        backend_url = "https://sb-rideshare-backend.herokuapp.com";
    }
    return backend_url;
}
