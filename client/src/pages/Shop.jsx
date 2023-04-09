import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Container, Header } from "components";
import { useUserData } from "hooks";
import { Tools } from "components/Shop/";
import { Desktop } from "service/mediaQueries";
import axios from "axios";

const StyledShopContainer = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    padding-top: 0.5rem;
    border-radius: 1rem;
    width: 90vw;
    height: 80vh;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-flow: column;
`;

const NavBar = styled.div`
    padding-bottom: 1rem;
    margin: 2rem 0;
`;

const StyledNavLink = styled.a`
    margin: 1rem;
    padding-bottom: 0.2rem;
    color: var(--primary);
    cursor: pointer;
    display: ${(props) => (props.isDesktop ? "unset" : "block")};

    :hover {
        color: var(--secondary);
    }
    :active {
        color: var(--primary);
    }
`;

const TabContainer = styled.div`
    height: 80vh;
    padding: 0 1rem;
    height: 100%;
    overflow-y: auto;

    ::-webkit-scrollbar {
        width: 14px;
    }

    ::-webkit-scrollbar-thumb {
        background-clip: padding-box;
        background-color: #aaaaaa;
        border-radius: 9999px;
        border: 4px solid rgba(0, 0, 0, 0);
    }

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
`;

const TabContentContainer = styled.div``;

function Shop(props) {
    const isDesktop = Desktop();
    const { userData, loggedInAsGuest } = useUserData();

    const [userPerks, setUserPerks] = useState([]);
    const [allPerks, setAllPerks] = useState([]);

    function openTab(tabName, e) {
        var i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName(
            StyledNavLink.styledComponentId
        );
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(
                " selected",
                ""
            );
        }

        document.getElementById(tabName).style.display = "block";
        e.currentTarget.className += " selected";
    }

    useEffect(() => {
        if (!loggedInAsGuest && userData.id) {
            axios.get("/perks").then((res) => {
                setAllPerks(res.data);
            });

            axios.get(`/user_perks/${userData.id}`).then((res) => {
                setUserPerks(res.data.userPerks);
            });
        }
    }, [loggedInAsGuest, userData]);

    return (
        <>
            <Header />
            <Container>
                <StyledShopContainer>
                    {loggedInAsGuest ? (
                        "Create an account to redeem items!"
                    ) : (
                        <TabContainer>
                            <NavBar>
                                <StyledNavLink
                                    isDesktop={isDesktop}
                                    className="selected"
                                    onClick={(e) => {
                                        openTab("Tools and Colors", e);
                                    }}
                                >
                                    TOOLS AND COLORS
                                </StyledNavLink>
                                <StyledNavLink
                                    isDesktop={isDesktop}
                                    onClick={(e) => {
                                        openTab("My Inventory", e);
                                    }}
                                >
                                    MY INVENTORY
                                </StyledNavLink>
                            </NavBar>
                            <TabContentContainer>
                                <div
                                    id="Tools and Colors"
                                    className="tabcontent"
                                >
                                    <Tools
                                        perks={allPerks}
                                        userData={userData}
                                    />
                                </div>
                                <div
                                    id="My Inventory"
                                    className="tabcontent"
                                    style={{ display: "none" }}
                                >
                                    <Tools
                                        userPerks={userPerks}
                                        userData={userData}
                                    />
                                </div>
                            </TabContentContainer>
                        </TabContainer>
                    )}
                </StyledShopContainer>
            </Container>
        </>
    );
}

export default Shop;
