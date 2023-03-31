import { useEffect, useState } from "react";
import axios from "axios";

function useUserData() {
    const [userData, setUserData] = useState({});
    const isLoggedIn = document.cookie.includes("token");
    const loggedInAsGuest = sessionStorage.getItem("guestLoggedIn");
    const uid = localStorage.getItem("uid");

    useEffect(() => {
        if (uid) {
            axios.get(`/users/${uid}`).then((res) => {
                setUserData(res.data);
            });
        } else if (loggedInAsGuest) {
            const nickname = sessionStorage.getItem("username");
            const guestAvatar = sessionStorage.getItem("guestAvatar");
            localStorage.setItem("username", nickname);

            setUserData({ username: nickname, avatar: guestAvatar });
        }
    }, [uid, loggedInAsGuest]);

    return { isLoggedIn, loggedInAsGuest, userData };
}

export default useUserData;
