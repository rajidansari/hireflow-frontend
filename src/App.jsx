import { useEffect, useState } from "react";
import { refreshApi } from "./api/auth";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "./store/authStore";

function App() {
  const [loader, setLoader] = useState(true);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setUserId = useAuthStore((state) => state.setUserId);

  useEffect(() => {
    (async () => {
      try {
        const response = await refreshApi();

        const accessToken = response.data.accessToken;

        const decoded = jwtDecode(accessToken);

        setAccessToken(accessToken);
        setRole(decoded.role);
        setUserId(decoded.userId);
      } catch (err) {
        console.error(`Refresh :: ${err}`);
      } finally {
        setLoader(false);
      }
    })();
  }, []);

  return <>{loader ? <p>Loading...</p> : <main className="bg-white"></main>}</>;
}

export default App;
