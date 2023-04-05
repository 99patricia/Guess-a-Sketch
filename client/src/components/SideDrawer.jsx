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
    margin: 0;

    transition: transform 0.3s ease-in-out;
    transform: ${(props) =>
        props.open ? "translateX(300px)" : "translateX(0)"};
`;

const StyledSideDrawer = styled.div`
    z-index: 1;
    background-color: var(--light-beige);
    height: 100vh;
    padding: 3rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 350px;
    transition: transform 0.3s ease-in-out;
    box-shadow: ${(props) =>
        props.open ? "0px 4px 4px rgba(0, 0, 0, 0.1)" : "none"};

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    transform: ${(props) =>
        props.open ? "translateX(0)" : "translateX(-100%)"};
`;

const StyledAvatar = styled.img`
    border-radius: 100%;
    margin: 1rem;
`;

const StyledUsername = styled.div`
    text-transform: uppercase;
    text-align: center;
    font-size: 1.2rem;
`;

const StyledNavLink = styled(Link)`
    padding: 1rem;
    margin: 0.25rem 0;
    border-radius: 0.5rem;
    background: var(--white);
    color: var(--primary);
    text-transform: uppercase;
    font-size: 1.2rem;
    text-align: center;
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
                open={open}
            />

            <StyledSideDrawer open={open}>
                {userData && (
                    <div className="flex column">
                        <StyledAvatar src={userData.avatar} />
                        <StyledUsername>{userData.username}</StyledUsername>
                    </div>
                )}
                <div className="flex column">
                    <StyledNavLink to="/leaderboard">Leaderboard</StyledNavLink>
                    <StyledNavLink to="/">Join a game</StyledNavLink>
                    <StyledNavLink to="/createRoom">
                        Create a room
                    </StyledNavLink>
                    {isLoggedIn || loggedInAsGuest ? (
                        <StyledNavLink onClick={handleLogout}>
                            Logout
                        </StyledNavLink>
                    ) : (
                        <>
                            <StyledNavLink to="/login">Login</StyledNavLink>
                            <StyledNavLink to="/register">Signup</StyledNavLink>
                        </>
                    )}
                </div>
            </StyledSideDrawer>
        </>
    );
}

export default SideDrawer;
