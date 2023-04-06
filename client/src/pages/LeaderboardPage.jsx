import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
    Container,
    FlexContainer,
    Header,
    Leaderboard,
} from "components";

function LeaderboardPage() {

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
                        leaderboardData={leaderboardData} 
                    />
                </FlexContainer>
            </Container>
        </>
    )
}

export default LeaderboardPage;
