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
} from "components/Profile/"

const ProfileContainer = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    padding-top: 0.5rem;
    border-radius: 1rem;
    // min-width: 600px;
    max-width: 700px;
    width: 100vw;
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
        background-color: #AAAAAA;
        border-radius: 9999px;
        border: 4px solid rgba(0, 0, 0, 0);
    }
`;

const NavBar = styled.div`
    padding-bottom: 1rem;
    // border: 1px solid purple;
`;

const StyledNavLink = styled.a`
    margin: 1rem;
    padding-bottom: 0.2rem;
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

    const { userData, profileData, loggedInAsGuest, addFriendButtonRef } = { ...props };

    const [ gameHistory, setGameHistory ] = useState([]);

    useEffect(() => {
        const games = profileData.gamehistory;
        if (games) {
            var i;
            setGameHistory([]);
            for (i=0; i<games.length; i++) {
                axios
                    .get(`/games/${games[i]}`)
                    .then((res) => {
                        setGameHistory(oldArray => [...oldArray, res.data]);
                    });
            }
        }
    }, [profileData]);

    // https://www.w3schools.com/howto/howto_js_tabs.asp
    function openTab(e, tabName ) {
        var i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName('tabcontent');
        for (i=0; i<tabcontent.length; i++) {
            tabcontent[i].style.display = 'none';
        }

        tablinks = document.getElementsByClassName(StyledNavLink.styledComponentId);
        for (i=0; i<tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" selected", "");
        }

        document.getElementById(tabName).style.display = "block";
        e.currentTarget.className += " selected";
    }
    
    return (
        <>
            <ProfileContainer>
                <ProfileInfo 
                    userData={userData}
                    profileData={profileData}
                    loggedInAsGuest={loggedInAsGuest}
                    addFriendButtonRef={addFriendButtonRef}
                />
                {!loggedInAsGuest && 
                <>
                <NavBar>
                    <StyledNavLink className="selected" onClick={(e) => {openTab(e, 'recentActivity')}}>
                        RECENT ACTIVITY
                    </StyledNavLink>
                    <StyledNavLink onClick={(e) => {openTab(e, 'friends')}}>
                        FRIENDS
                    </StyledNavLink>
                    <StyledNavLink onClick={(e) => {openTab(e, 'games')}}>
                        GAMES
                    </StyledNavLink>
                    <StyledNavLink onClick={(e) => {openTab(e, 'customWordbanks')}}>
                        CUSTOM WORDBANKS
                    </StyledNavLink>
                </NavBar>
                <ProfileNavContainer>

                    <div id="recentActivity" className="tabcontent">
                        <RecentActivity />
                    </div>
                    <div id="friends" className="tabcontent" style={{display:'none'}}>
                        <Friends />
                    </div>
                    <div id="games" className="tabcontent" style={{display:'none'}}>
                        <Games gameHistory={gameHistory} />
                    </div>
                    <div id="customWordbanks" className="tabcontent" style={{display:'none'}}>
                        <CustomWordbanks />
                    </div>
                </ProfileNavContainer>
                </>
                }
            </ProfileContainer>
        </>
    )
}

export default Profile