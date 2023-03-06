import React from "react";
import styled from "styled-components";
import Button from "./Button.js";

const StyledHeader = styled.div`
    background-color: var(--primary);
    width: 100%;
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
    font-weight: 900;
    text-transform: uppercase;
`;

function Header(props) {
    return (
        <StyledHeader>
            <StyledSiteLink href="/">sketch.guess</StyledSiteLink>
            <div className="flex">
                <Button>Login</Button>
                <Button>Signup</Button>
            </div>
        </StyledHeader>
    );
}

export default Header;
