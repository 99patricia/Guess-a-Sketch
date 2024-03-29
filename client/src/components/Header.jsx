import React from "react";
import styled from "styled-components";

import { SideDrawer } from "components";
import { useUserData } from "hooks";
import { Desktop } from "service/mediaQueries";

const StyledHeader = styled.div`
    background-color: var(--primary);
    width: 100%;
    height: ${(props) => (props.isDesktop ? "100px" : "60px")};
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);

    z-index: 3;
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
    const isDesktop = Desktop();
    const { isLoggedIn, loggedInAsGuest } = useUserData();
    return (
        <>
            <StyledHeader isDesktop={isDesktop}>
                <StyledSiteLink href="/">sketch.guess</StyledSiteLink>
            </StyledHeader>
            {(isLoggedIn || loggedInAsGuest) && <SideDrawer />}
        </>
    );
}

export default Header;
