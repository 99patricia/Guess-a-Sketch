import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

import { Button, IconButton } from "components";

const StyledHeader = styled.div`
    background-color: var(--primary);
    width: 100%;
    position: absolute;
    top: 0;
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

const StyledHeaderMobile = styled(StyledHeader)`
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    padding: 0;
    padding-top: 2rem;
`;

const StyledNavMenu = styled.div`
    padding: 1rem;
    margin-top: 72px;
    position: absolute;
    width: 100%;
    background-color: var(--light-beige);

    > li {
        display: block;
    }
`;

function Header(props) {
    const navButtonRef = useRef();
    const [showNavMenu, setShowNavMenu] = useState(false);
    const isBigScreen = useMediaQuery({
        query: "(min-width: 769px)",
    });
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

    useEffect(() => {
        const navButton = navButtonRef.current;

        if (isTabletOrMobile) {
            navButton.addEventListener("click", () => {
                setShowNavMenu(!showNavMenu);
            });
        }
    }, [showNavMenu, isTabletOrMobile]);

    return (
        <>
            {showNavMenu && <NavMenu />}
            {isBigScreen && (
                <StyledHeader>
                    <StyledSiteLink href="/">sketch.guess</StyledSiteLink>
                    <div className="flex">
                        <Button secondary>Login</Button>
                        <Button secondary>Signup</Button>
                    </div>
                </StyledHeader>
            )}
            {isTabletOrMobile && (
                <StyledHeaderMobile>
                    <IconButton
                        iconClassName="bi-list"
                        noBackground
                        ref={navButtonRef}
                    />
                    <StyledSiteLink href="/">sketch.guess</StyledSiteLink>
                </StyledHeaderMobile>
            )}
        </>
    );
}

function NavMenu() {
    return (
        <StyledNavMenu>
            <li>
                <a href="/">Login</a>
            </li>
            <li>
                <a href="/">Signup</a>
            </li>
        </StyledNavMenu>
    );
}

export default Header;
