import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Button, SideDrawer } from "components";

const StyledHeader = styled.div`
    background-color: var(--primary);
    width: 100%;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    margin-bottom: 100px;
    padding: 1.5rem 1.8rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);

    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
`;

const StyledSiteLink = styled.a`
    color: var(--secondary);
    font-size: 2rem;
    text-transform: uppercase;
`;

function Header(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(
        document.cookie.includes("token")
    );
    const loggedInAsGuest = sessionStorage.getItem("guestLoggedIn");

    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios
            .post("/logout", {}, { withCredentials: true })
            .then((res) => {
                localStorage.clear();
                setIsLoggedIn(false);
                navigate("/");
            });
    };

    return (
        <>
            <StyledHeader>
                <StyledSiteLink href="/">sketch.guess</StyledSiteLink>
                <div className="flex">
                    {isLoggedIn ? (
                        <Button onClick={handleLogout} secondary>
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={() => navigate("/login")}
                                secondary
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => navigate("/register")}
                                secondary
                            >
                                Signup
                            </Button>
                        </>
                    )}
                </div>
            </StyledHeader>
            {(isLoggedIn || loggedInAsGuest) && <SideDrawer />}
        </>
    );
}

export default Header;
