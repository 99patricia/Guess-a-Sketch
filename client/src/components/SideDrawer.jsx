import React, { useState } from "react";
import styled from "styled-components";
import IconButton from "./IconButton";
import { Link } from "react-router-dom";
import { useUserData } from "hooks";

const StyledSideDrawer = styled.div`
    background-color: var(--primary-dark);
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
    const userData = useUserData();

    return (
        <>
            <IconButton
                iconClassName="bi-list"
                onClick={() => setOpen(!open)}
            ></IconButton>

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
                <Link to="/">Logout</Link>
            </StyledSideDrawer>
        </>
    );
}

export default SideDrawer;
