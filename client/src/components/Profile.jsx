import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import "components/Profile/profile.css";
import {
    ProfileInfo,
    RecentActivity,
    Friends,
    Games,
    CustomWordbanks,
} from "components/Profile/";
import { Desktop } from "service/mediaQueries";

const ProfileContainer = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    padding-top: 0.5rem;
    border-radius: 1rem;
    width: 80vw;
    max-width: 800px;
    height: 80vh;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-flow: column;
`;

const ProfileNavContainer = styled.div`
    display: block;
    height: 100%;
    overflow: auto;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1) inset;
    border-radius: 1rem;

    ::-webkit-scrollbar {
        width: 14px;
    }

    ::-webkit-scrollbar-thumb {
        background-clip: padding-box;
        background-color: #aaaaaa;
        border-radius: 9999px;
        border: 4px solid rgba(0, 0, 0, 0);
    }
`;

const NavBar = styled.div`
    padding-bottom: 1rem;
    width: 80vw;
    max-width: 800px;
    word-wrap: break-word;
    // border: 1px solid purple;
`;

const StyledNavLink = styled.a`
    margin: 1rem;
    padding-bottom: 0.2rem;
    display: ${(props) => (props.isDesktop ? "unset" : "block")};
    color: var(--primary);
    cursor: pointer;

    :hover {
        color: var(--secondary);
    }

    :active {
        color: var(--primary);
    }
`;

function Profile(props) {
    const isDesktop = Desktop();
    const { userData, profileData, loggedInAsGuest, addFriendButtonRef } = {
        ...props,
    };

    const [gameHistory, setGameHistory] = useState([]);
    const [wordbanks, setWordbanks] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            const games = profileData.gamehistory;
            if (games) {
                var i;
                setGameHistory([]);
                for (i = 0; i < games.length; i++) {
                    await axios.get(`/games/${games[i]}`).then((res) => {
                        setGameHistory((oldArray) => [...oldArray, res.data]);
                    });
                }
            }
        };

        const fetchWordbanks = async () => {
            if (userData.id) {
                // Fetch user's wordbanks
                await axios
                    .get(`/wordbank/${userData.id}`)
                    .then((res) =>
                        setWordbanks(
                            res.data.filter((wordbank) => !wordbank.isGlobal)
                        )
                    );
            }
        };

        fetchGames().catch(console.error);
        fetchWordbanks().catch((error) => console.error(error));
    }, [profileData, userData.id]);

    // https://www.w3schools.com/howto/howto_js_tabs.asp
    function openTab(e, tabName) {
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

    return (
        <>
            <ProfileContainer isDesktop={isDesktop}>
                <ProfileInfo
                    userData={userData}
                    profileData={profileData}
                    loggedInAsGuest={loggedInAsGuest}
                    addFriendButtonRef={addFriendButtonRef}
                />
                {!loggedInAsGuest && (
                    <>
                        <NavBar>
                            <StyledNavLink
                                isDesktop={isDesktop}
                                className="selected"
                                onClick={(e) => {
                                    openTab(e, "recentActivity");
                                }}
                            >
                                RECENT ACTIVITY
                            </StyledNavLink>
                            <StyledNavLink
                                isDesktop={isDesktop}
                                onClick={(e) => {
                                    openTab(e, "friends");
                                }}
                            >
                                FRIENDS
                            </StyledNavLink>
                            <StyledNavLink
                                isDesktop={isDesktop}
                                onClick={(e) => {
                                    openTab(e, "games");
                                }}
                            >
                                GAMES
                            </StyledNavLink>
                            <StyledNavLink
                                isDesktop={isDesktop}
                                onClick={(e) => {
                                    openTab(e, "customWordbanks");
                                }}
                            >
                                CUSTOM WORDBANKS
                            </StyledNavLink>
                        </NavBar>
                        <ProfileNavContainer>
                            <div id="recentActivity" className="tabcontent">
                                <RecentActivity />
                            </div>
                            <div
                                id="friends"
                                className="tabcontent"
                                style={{ display: "none" }}
                            >
                                <Friends />
                            </div>
                            <div
                                id="games"
                                className="tabcontent"
                                style={{ display: "none" }}
                            >
                                <Games gameHistory={gameHistory} />
                            </div>
                            <div
                                id="customWordbanks"
                                className="tabcontent"
                                style={{ display: "none" }}
                            >
                                <CustomWordbanks userData={userData} wordbanks={wordbanks} />
                            </div>
                        </ProfileNavContainer>
                    </>
                )}
            </ProfileContainer>
        </>
    );
}

export default Profile;
