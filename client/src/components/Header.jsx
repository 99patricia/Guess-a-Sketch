import React from "react";
import styled from "styled-components";

import { SideDrawer } from "components";
import { useUserData } from "hooks";

const StyledHeader = styled.div`
    background-color: var(--primary);
    width: 100%;
    height: 100px;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    margin-bottom: 100px;
    padding: 0 1.8rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);

    display: flex;
    justify-content: center;
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
    const { isLoggedIn, loggedInAsGuest } = useUserData();
    return (
        <>
            <StyledHeader>
                <StyledSiteLink href="/">sketch.guess</StyledSiteLink>
            </StyledHeader>
            {(isLoggedIn || loggedInAsGuest) && <SideDrawer />}
        </>
    );
}

export default Header;
