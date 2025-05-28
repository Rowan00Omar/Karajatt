import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const withAuthProtection = (WrappedComponent, allowedRoles = []) => {
  return function ProtectedComponent(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        try {
          const response = await axios.get("/api/auth/userInfo", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userRole = response.data.role;

          if (allowedRoles.includes(userRole)) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          setIsAuthorized(false);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return isAuthorized ? <WrappedComponent {...props} /> : <Navigate to="/login" />;
  };
};

export default withAuthProtection;
