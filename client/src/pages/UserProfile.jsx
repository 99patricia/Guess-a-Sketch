import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

import { useUserData } from "hooks";

import {
    Container,
    FlexContainer,
    Header,
    Profile,
} from "components";

function UserProfile(props) {

    const { userData, loggedInAsGuest } = useUserData();

    const [ profileData, setProfileData ] = useState({});

    const addFriendButtonRef = useRef();

    useEffect(() => {
        if (!loggedInAsGuest && userData.id) {
            axios
                .get(`/profile/${userData.id}`)
                .then((res) => {
                    setProfileData(res.data);
                });
        }
        const button = addFriendButtonRef.current;

        function addFriend(e) {
            console.log("click");
        }

        if (!loggedInAsGuest) {
            button.addEventListener("click", addFriend);
        }

        return () => {
            if (!loggedInAsGuest) {
                button.removeEventListener("click", addFriend);
            }
        };
    }, [userData]);

    return (
        <>
            <Header />
            <Container>
                <FlexContainer>
                    <Profile 
                        userData={userData}
                        profileData={profileData}
                        loggedInAsGuest={loggedInAsGuest}
                        addFriendButtonRef={addFriendButtonRef}
                    />
                </FlexContainer>
            </Container>
        </>
    )
}

export default UserProfile;
