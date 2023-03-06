import React from "react";
import styled from "styled-components";

import { Button } from "components";

const StyledHeader = styled.div`
    background-color: var(--primary);
    width: 100%;
    position: absolute;
    top: 0;
    padding: 1.5rem 1.8rem;

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
    return (
        <StyledHeader>
            <StyledSiteLink href="/">sketch.guess</StyledSiteLink>
            <div className="flex">
                <Button secondary>Login</Button>
                <Button secondary>Signup</Button>
            </div>
        </StyledHeader>
    );
}

export default Header;
