import { useEffect, useState } from "react";
import axios from "axios";

function useUserData() {
    const [userData, setUserData] = useState({});

    const loggedInAsGuest = sessionStorage.getItem("guestLoggedIn");
    const uid = localStorage.getItem("uid");

    useEffect(() => {
        if (uid) {
            axios.get(`/users/${uid}`).then((res) => {
                setUserData(res.data);
            });
        } else if (loggedInAsGuest) {
            const nickname = localStorage.getItem("username");
            const guestAvatar = localStorage.getItem("guestAvatar");

            setUserData({ username: nickname, avatar: guestAvatar });
        }
    }, [uid, loggedInAsGuest]);

    return userData;
}

export default useUserData;
