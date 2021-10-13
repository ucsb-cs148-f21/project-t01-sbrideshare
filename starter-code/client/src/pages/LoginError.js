import Container from "react-bootstrap/Container";
import Layout from "../components/Layout";

export default function LoginError() {
  return (
    <Layout>
      <Container>
        <h1>Error logging you in: please login with your UCSB email!</h1>
      </Container>
    </Layout>
  );
}