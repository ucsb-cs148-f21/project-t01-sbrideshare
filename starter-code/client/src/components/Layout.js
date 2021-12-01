import NavBar from "./NavBar";
import Footer from "./Footer";
import "../styles/layout.css";

export default function Layout(props) {
  const user = props.user;
  const navBarActive = props.navBarActive;
  const thisBackground = props.background;

  return (
    <div>
      <NavBar user={user} navBarActive={navBarActive}/>
      {props.children}

    </div>
  );
}
