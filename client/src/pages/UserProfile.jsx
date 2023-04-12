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

    useEffect(() => {
        if (!loggedInAsGuest && userData.id) {
            axios
                .get(`/profile/${userData.id}`)
                .then((res) => {
                    setProfileData(res.data);
                });
        }
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
                    />
                </FlexContainer>
            </Container>
        </>
    )
}

export default UserProfile;
