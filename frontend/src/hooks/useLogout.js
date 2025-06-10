import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
      } else {
        console.error("Logout failed:", await response.text());
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("userRole");
      navigate("/login");
    }
  };

  return logout;
};

export default useLogout;
