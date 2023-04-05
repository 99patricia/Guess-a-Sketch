import { useEffect, useState } from "react";

function useUserData() {
    const [userData, setUserData] = useState({});
    const isLoggedIn = document.cookie.includes("token");
    const loggedInAsGuest = sessionStorage.getItem("guestLoggedIn");

    useEffect(() => {
        if (localStorage.getItem("userData")) {
            setUserData(JSON.parse(localStorage.getItem("userData")));
        } else if (loggedInAsGuest) {
            const nickname = sessionStorage.getItem("username");
            const guestAvatar = sessionStorage.getItem("guestAvatar");
            localStorage.setItem("username", nickname);

            setUserData({ username: nickname, avatar: guestAvatar });
        }
    }, [loggedInAsGuest]);

    return { isLoggedIn, loggedInAsGuest, userData };
}

export default useUserData;
