import useAuthStore from "@/store/authStore";
import { Navigate } from "react-router";

const Home = () => {
  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);

  return isAuthenticated ? <Navigate to={"/jobs"} replace /> : <LandingPage />;
};

function LandingPage() {
  return <main>Home</main>;
}

export default Home;
