import React, { useState } from "react";
import styled from "styled-components";
import { Desktop } from "service/mediaQueries";

import { Button, IconButton } from "components";

const StyledHeader = styled.div`
    background-color: var(--primary);
    width: 100%;
    position: absolute;
    top: 0;
    padding: 1.5rem 1.8rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);

    z-index: 1;
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

const StyledHeaderMobile = styled(StyledHeader)`
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    padding: 3rem 0 0;
    position: relative;
    z-index: 2;
`;

const StyledNavMenu = styled.div`
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;

    transform: ${(props) =>
        props.showNavMenu ? "translateY(0)" : "translateY(-100%)"};
    transition: all 0.1s linear;

    > a {
        text-transform: uppercase;
        color: var(--primary);
        display: block;
        padding: 1rem 1.2rem;
        background-color: var(--light-beige);
    }
`;

function Header(props) {
    const [showNavMenu, setShowNavMenu] = useState(false);
    const isDesktop = Desktop();

    return (
        <>
            {isDesktop ? (
                <StyledHeader>
                    <StyledSiteLink href="/">sketch.guess</StyledSiteLink>
                    <div className="flex">
                        <Button secondary>Login</Button>
                        <Button secondary>Signup</Button>
                    </div>
                </StyledHeader>
            ) : (
                <>
                    <StyledHeaderMobile>
                        <IconButton
                            iconClassName="bi-list"
                            noBackground
                            onClick={() => setShowNavMenu(!showNavMenu)}
                        />
                        <StyledSiteLink href="/">sketch.guess</StyledSiteLink>
                    </StyledHeaderMobile>
                    <NavMenu
                        showNavMenu={showNavMenu}
                        setShowNavMenu={setShowNavMenu}
                    />
                </>
            )}
        </>
    );
}

function NavMenu(props) {
    return (
        <StyledNavMenu showNavMenu={props.showNavMenu}>
            <a href="/">Login</a>
            <a href="/">Signup</a>
        </StyledNavMenu>
    );
}

export default Header;
