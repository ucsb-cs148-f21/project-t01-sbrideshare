// import getUser from "./get-user";

export default function ucsbAccount(user){
  if(user){
    if(user.email.substr(-8) == "ucsb.edu"){
      return true;
    }
  }
  return false;
}