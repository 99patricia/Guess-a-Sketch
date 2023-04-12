import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const LeaderboardContainer = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    padding-top: 0.5rem;
    border-radius: 1rem;
    width: 85vw;
    max-width: 800px;
    height: 70vh;
    display: flex;
    flex-flow: column;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

const LeaderboardHeader = styled.div`
    text-align: center;
    text-transform: uppercase;
    font-size: 2rem;
    line-height: 3rem;
    color: var(--secondary);
`;

const LeaderboardTableDiv = styled.div`
    overflow: hidden;
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
`;

const LeaderboardTable = styled.table`
    text-align: center;
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
`;

const THead = styled.thead`
    position: sticky;
    top: 0;
`;

const TR = styled.tr`
    :nth-child(even) {
        background-color: var(--light-beige);
    }
    :nth-child(odd) {
        background-color: var(--beige);
    }
`;

const TH = styled.th`
    text-transform: uppercase;
    position: sticky;
    padding: 0.5rem;
    color: var(--secondary);
    background-color: var(--primary);
`;

const TD = styled.td`
    padding: 0.5rem 0;
`;

function Leaderboard(props) {
    const { leaderboardData, userData, loggedInAsGuest } = { ...props };

    return (
        <>
            <LeaderboardContainer>
                <LeaderboardHeader>Leaderboard</LeaderboardHeader>
                <LeaderboardTableDiv>
                    <LeaderboardTable>
                        <THead>
                            <TR>
                                <TH>Rank</TH>
                                <TH>Username</TH>
                                <TH>Wins</TH>
                                <TH>Losses</TH>
                                <TH>W/L</TH>
                            </TR>
                        </THead>
                        <tbody>
                            {leaderboardData.map(
                                ({ id, username, wins, losses }, index) => (
                                    <TR
                                        key={username}
                                        style={
                                            userData.username === username &&
                                            !loggedInAsGuest
                                                ? { color: "var(--secondary)" }
                                                : { color: "var(--primary)" }
                                        }
                                    >
                                        <TD>{index + 1}</TD>
                                        <TD>
                                            <Link to={`/profile/${id}`}>
                                                {username}
                                            </Link>
                                        </TD>
                                        <TD>{wins}</TD>
                                        <TD>{losses}</TD>
                                        <TD>
                                            {isFinite(wins / losses)
                                                ? (
                                                      Math.round(
                                                          (wins / losses) * 100
                                                      ) / 100
                                                  ).toFixed(2)
                                                : wins}
                                        </TD>
                                    </TR>
                                )
                            )}
                        </tbody>
                    </LeaderboardTable>
                </LeaderboardTableDiv>
            </LeaderboardContainer>
        </>
    );
}

export default Leaderboard;
