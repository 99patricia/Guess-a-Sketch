import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useUserData } from "hooks";

import {
    Container,
    FlexContainer,
    Header,
    Leaderboard,
} from "components";

function LeaderboardPage() {
    const { userData, loggedInAsGuest } = useUserData();

    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        axios
            .get("/leaderboard")
            .then((res) => setLeaderboardData(res.data));
    }, [setLeaderboardData]);


    return (
        <>
            <Header />
            <Container>
                <FlexContainer>
                    <Leaderboard
                        leaderboardData={leaderboardData} userData={userData} loggedInAsGuest={loggedInAsGuest}
                    />
                </FlexContainer>
            </Container>
        </>
    )
}

export default LeaderboardPage;
