import NavBar from "./NavBar";

export default function Layout(props) {
  const user = props.user;
  const navBarActive = props.navBarActive;
  let thisBackground = props.background;

  if(thisBackground === "none") {
    thisBackground = "linear-gradient(to bottom, #1a8ce9 10%, #2196f3 45%, #f7bf259f 97%) left 100%"
  }

  return (
    <div>
      <NavBar user={user} navBarActive={navBarActive}/>
      {props.children}

    </div>
  );
}
