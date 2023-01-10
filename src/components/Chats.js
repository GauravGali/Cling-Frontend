import React, {useRef, useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";
import {useAuth} from "../contexts/AuthContext";
import axios from "axios";

const Chats = () => {
    const history = useHistory();
    const {user} = useAuth();
    const [loading, setLoading] = useState(true);
    const [navHeight, setNavHeight] = useState('10');

    const handleLogout = async () => {
        await auth.signOut();

        history.push('/');
    }

    const getFile = async (url) => {
        const response = await fetch(url);
        const data = await response.blob();

        return new File([data], "userPhoto.jpg", {type: 'image/jpeg'});
    }

    useEffect(() => {
        if(!user) {
            history.push('/');

            return;
        }

        axios.post('http://localhost:8000/users/create',
                    {
                        email: user.email,
                        avatarUrl: user.photoURL,
                        userName: user.displayName
                    },
                    {headers: { 'Content-Type': 'application/json' }}
                    ).catch((error) => console.log(error))

        axios.get('https://api.chatengine.io/users/me', {
            headers: {
                "project-id": "ecde96c6-9926-42a0-870f-0941f9dd67b3",
                "user-name": user.email,
                "user-secret": user.uid,
            }
        })
        .then(() => {
            setLoading(false);
        })
        .catch(() => {
            let formData = new FormData();
            formData.append('email', user.email);
            formData.append('username', user.email);
            formData.append('secret', user.uid);

            getFile(user.photoURL)
                .then((avatar) => {
                    formData.append('avatar', avatar, avatar.name)

                    axios.post('https://api.chatengine.io/users', 
                        formData,
                        {headers: {"private-key": "caff6ecc-fdf2-487c-96c4-9c70f7209279" } }
                    )
                    .then(() => setLoading(false))
                    .catch((error) => console.log(error))
                })
        })
    }, [user, history]);

    if(!user || loading) {
        return (
            <span className="loader" id="loader-span"></span>
        );
    }

    return (
        <div className="chats-page">
            <div className="nav-bar"
            onMouseEnter={() => setNavHeight(40)}
            onMouseLeave={() => setNavHeight(10)}
            >
                <div className="logo-tab">CLING</div>
                <div onClick={handleLogout} className="logout-tab">
                    Logout
                </div>
            </div>

            <ChatEngine height={`calc(100vh - ${navHeight}px)`}
            projectID="ecde96c6-9926-42a0-870f-0941f9dd67b3"
            userName={user.email}
            userSecret={user.uid}
            />
        </div>
    );
}

export default Chats;