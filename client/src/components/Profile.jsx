import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import "components/Profile/profile.css";
import {
    ProfileInfo,
    Friends,
    Games,
    CustomWordbanks,
} from "components/Profile/";
import { Desktop } from "service/mediaQueries";
import EditAvatar from "./EditAvatar";

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
    const [update, updateState] = useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const { viewingOwnProfile, userData, profileData } = {
        ...props,
    };

    const [gameHistory, setGameHistory] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [friendRequestList, setFriendRequestList] = useState([]);
    const [wordbanks, setWordbanks] = useState([]);

    const [editAvatar, setEditAvatar] = useState(false);

    useEffect(() => {
        const fetchGames = async () => {
            if (gameHistory.length > 0) {
                return;
            }
            await axios.get(`/profile/games/${userData.id}`).then((res) => {
                setGameHistory(res.data.games);
            });
        };

        const fetchFriendRequests = async () => {
            let friendRequests = [];
            await axios.get(`/friend_requests/${userData.id}`).then((res) => {
                friendRequests = res.data;
            });
            if (friendRequests) {
                var i;
                for (i = 0; i < friendRequests.length; i++) {
                    await axios
                        .get(`/profile/${friendRequests[i].sender_id}`)
                        .then((res) => {
                            friendRequests[i].sender_id = {
                                sender_id: friendRequests[i].sender_id,
                                username: res.data.username,
                                avatar: res.data.avatar,
                            };
                        });
                }
                setFriendRequestList(friendRequests);
            }
        };

        const fetchFriends = async () => {
            await axios.get(`/users/friends/${userData.id}`).then((res) => {
                setFriendList(res.data.friends);
            });
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

        if (userData.id) {
            fetchFriendRequests();
            fetchGames().catch(console.error);
            fetchWordbanks().catch((error) => console.error(error));
            fetchFriends();
        }
    }, [profileData, update, userData.id]);

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
            {editAvatar ? (
                <EditAvatar setEditAvatar={setEditAvatar} userData={userData} />
            ) : (
                <ProfileContainer isDesktop={isDesktop}>
                    <ProfileInfo
                        viewingOwnProfile={viewingOwnProfile}
                        userData={userData}
                        profileData={profileData}
                        setEditAvatar={setEditAvatar}
                    />
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
                            {viewingOwnProfile && (
                                <StyledNavLink
                                    isDesktop={isDesktop}
                                    onClick={(e) => {
                                        openTab(e, "friends");
                                    }}
                                >
                                    FRIENDS
                                </StyledNavLink>
                            )}
                            <StyledNavLink
                                isDesktop={isDesktop}
                                onClick={(e) => {
                                    openTab(e, "games");
                                }}
                            >
                                GAMES
                            </StyledNavLink>
                            {viewingOwnProfile && (
                                <StyledNavLink
                                    isDesktop={isDesktop}
                                    onClick={(e) => {
                                        openTab(e, "customWordbanks");
                                    }}
                                >
                                    CUSTOM WORDBANKS
                                </StyledNavLink>
                            )}
                        </NavBar>
                        <ProfileNavContainer>
                            <div id="recentActivity" className="tabcontent">
                                <Games gameHistory={gameHistory} />
                            </div>
                            {viewingOwnProfile && (
                                <div
                                    id="friends"
                                    className="tabcontent"
                                    style={{ display: "none" }}
                                >
                                    <Friends
                                        viewingOwnProfile={viewingOwnProfile}
                                        friendList={friendList}
                                        friendRequestList={friendRequestList}
                                        forceUpdate={forceUpdate}
                                    />
                                </div>
                            )}
                            <div
                                id="games"
                                className="tabcontent"
                                style={{ display: "none" }}
                            >
                                <Games gameHistory={gameHistory} />
                            </div>
                            {viewingOwnProfile && (
                                <div
                                    id="customWordbanks"
                                    className="tabcontent"
                                    style={{ display: "none" }}
                                >
                                    <CustomWordbanks
                                        viewingOwnProfile={viewingOwnProfile}
                                        userData={userData}
                                        wordbanks={wordbanks}
                                    />
                                </div>
                            )}
                        </ProfileNavContainer>
                    </>
                </ProfileContainer>
            )}
        </>
    );
}

export default Profile;
