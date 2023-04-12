import React, { useEffect, useState } from "react";
import axios from "axios";

import { useUserData } from "hooks";

import { Container, FlexContainer, Header, Profile } from "components";
import { useParams } from "react-router-dom";

function UserProfile(props) {
    const { userId } = useParams();
    const { userData } = useUserData();

    const [profileData, setProfileData] = useState({});
    const [profileUserData, setProfileUserData] = useState({});
    const [viewingOwnProfile, setViewingOwnProfile] = useState(false);

    useEffect(() => {
        if (userId) {
            if (userId === userData.id) {
                setViewingOwnProfile(true);
                setProfileUserData(userData);
            } else {
                axios.get(`/users/${userId}`).then((res) => {
                    setProfileUserData(res.data);
                });
            }

            axios.get(`/profile/${userId}`).then((res) => {
                setProfileData(res.data);
            });
        }
    }, [userId, userData.id]);

    return (
        <>
            <Header />
            <Container>
                <FlexContainer>
                    <Profile
                        viewingOwnProfile={viewingOwnProfile}
                        userData={profileUserData}
                        profileData={profileData}
                    />
                </FlexContainer>
            </Container>
        </>
    );
}

export default UserProfile;
