import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { UserSwitchOutlined } from "@ant-design/icons";

const Chats = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [navHeight, setNavHeight] = useState("10");

  const handleLogout = async () => {
    await auth.signOut();

    history.push("/");
  };

  const getFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();

    return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
  };

  useEffect(() => {
    if (!user) {
      history.push("/");

      return;
    }

    axios
      .post(
        "http://localhost:8000/users/create",
        {
          email: user.email,
          avatarUrl: user.photoURL,
          userName: user.displayName,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .catch((error) => console.log(error));

    axios
      .get("https://api.chatengine.io/users/me", {
        headers: {
          "project-id": "2084a893-bf43-470e-96dc-48b80b5af16b",
          "user-name": user.email,
          "user-secret": user.uid,
        },
      })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        let formData = new FormData();
        formData.append("email", user.email);
        formData.append("username", user.email);
        formData.append("secret", user.uid);

        getFile(user.photoURL).then((avatar) => {
          formData.append("avatar", avatar, avatar.name);

          axios
            .post("https://api.chatengine.io/users", formData, {
              headers: {
                "private-key": "0ab9debe-ca98-4c16-92fd-a9d497022ba9",
              },
            })
            .then(() => setLoading(false))
            .catch((error) => console.log(error));
        });
      });
  }, [user, history]);

  if (!user || loading) {
    return <span className="loader" id="loader-span"></span>;
  }

  return (
    <div className="chats-page">
      <div
        className="nav-bar"
        onMouseEnter={() => setNavHeight(40)}
        onMouseLeave={() => setNavHeight(10)}
      >
        <div className="logo-tab" onClick={() => window.location.reload(true)}>
          CLING
        </div>
        <div onClick={handleLogout} className="logout-tab">
          <UserSwitchOutlined /> &nbsp; {user.displayName}
        </div>
      </div>

      <ChatEngine
        height={`calc(100vh - ${navHeight}px)`}
        projectID="2084a893-bf43-470e-96dc-48b80b5af16b"
        userName={user.email}
        userSecret={user.uid}
        offset={6}
      />
    </div>
  );
};

export default Chats;
