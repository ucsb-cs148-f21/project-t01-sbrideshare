import NavBar from "./NavBar";

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
