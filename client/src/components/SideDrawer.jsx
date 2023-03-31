import React, { useState } from "react";
import styled from "styled-components";
import IconButton from "./IconButton";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "hooks";
import axios from "axios";

const StyledNavButton = styled(IconButton)`
    background-color: transparent;
    position: fixed;
    top: 30px;
`;

const StyledSideDrawer = styled.div`
    background-color: var(--light-beige);
    height: 100vh;
    padding: 2rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    transition: transform 0.3s ease-in-out;

    display: flex;
    flex-direction: column;

    transform: ${(props) =>
        props.open ? "translateX(0)" : "translateX(-100%)"};
`;

const StyledAvatar = styled.img`
    border-radius: 100%;
`;

function SideDrawer(props) {
    const [open, setOpen] = useState(false);
    const { isLoggedIn, loggedInAsGuest, userData } = useUserData();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (isLoggedIn) {
            await axios
                .post("/logout", {}, { withCredentials: true })
                .then(() => {
                    localStorage.clear();
                    navigate("/login");
                });
        } else if (loggedInAsGuest) {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
        }
    };

    return (
        <>
            <StyledNavButton
                iconClassName={open ? "bi-x-lg" : "bi-list"}
                onClick={() => setOpen(!open)}
            />

            <StyledSideDrawer open={open}>
                {userData && (
                    <>
                        <StyledAvatar src={userData.avatar} />
                        {userData.username}
                    </>
                )}
                <Link to="/">Home</Link>
                <Link to="/">Join a game</Link>
                <Link to="/">Create a room</Link>
                <Link to="/" onClick={handleLogout}>
                    Logout
                </Link>
            </StyledSideDrawer>
        </>
    );
}

export default SideDrawer;
