import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    // Show confirmation toast
    const toastId = toast.info(
      <div className="text-center">
        <p className="mb-3">هل أنت متأكد من تسجيل الخروج؟</p>
        <div className="flex justify-center space-x-2 space-x-reverse">
          <button
            onClick={() => {
              toast.dismiss(toastId);
              performLogout();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            نعم، تسجيل خروج
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        closeButton: false,
        style: {
          minWidth: "300px",
        },
      }
    );
  };

  const performLogout = async () => {
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
        // Dispatch custom event to notify App component
        window.dispatchEvent(new Event('authChange'));
        toast.success("تم تسجيل الخروج بنجاح");
        navigate("/login");
      } else {
        console.error("Logout failed:", await response.text());
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        // Dispatch custom event to notify App component
        window.dispatchEvent(new Event('authChange'));
        toast.error("حدث خطأ أثناء تسجيل الخروج");
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("userRole");
      // Dispatch custom event to notify App component
      window.dispatchEvent(new Event('authChange'));
      toast.error("حدث خطأ أثناء تسجيل الخروج");
      navigate("/login");
    }
  };

  return logout;
};

export default useLogout; 