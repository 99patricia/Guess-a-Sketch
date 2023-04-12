import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

import { useUserData } from "hooks";

import { Container, FlexContainer, Header, Profile } from "components";
import { useParams } from "react-router-dom";

function UserProfile(props) {
    const { userId } = useParams();
    const { loggedInAsGuest } = useUserData();

    const [profileData, setProfileData] = useState({});
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (!loggedInAsGuest && userId) {
            axios.get(`/users/${userId}`).then((res) => {
                setUserData(res.data);
            });
            axios.get(`/profile/${userId}`).then((res) => {
                setProfileData(res.data);
            });
        }
    }, [userId]);

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
    );
}

export default UserProfile;
