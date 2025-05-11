import { useAuth } from "../provider/authProvider";

const Home = () => {
  const { token } = useAuth();
  
  return (
    <div>
      <h1>Welcome User!</h1>
      <p>Your token: {token}</p>
    </div>
  );
};

export default Home;