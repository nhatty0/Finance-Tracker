import React, { useEffect } from "react";
import "./styles.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from "../../assets/user.svg";

function Header() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutFunc() {
    try {
      signOut(auth)
        .then(() => {
          // SignOut successful
          toast.success("Logged Out Successfully.");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div className="navbar">
      <p className="logo">Finance Tracker</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            alt="Profile"
            src={user.photoURL ? user.photoURL : userImg}
            style={{ borderRadius: "50%", height: "2rem", width: "2rem" }}
          />
          <p className="logo link" onClick={logoutFunc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
