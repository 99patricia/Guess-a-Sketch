import React from "react";
import styled from "styled-components";

const LeaderboardContainer = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    padding-top: 0.5rem;
    border-radius: 1rem;
    width: 500px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-flow: column;
`;

const LeaderboardHeader = styled.div`
    text-align: center;
    text-transform: uppercase;
    font-size: 2rem;
    line-height: 3rem;
    color: var(--secondary);
`;

const LeaderboardTableDiv = styled.div`
    border-radius: 1rem;
    border: 2px solid var(--primary);
    overflow: hidden;
    height: 100%;
    overflow-y: auto;

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

const LeaderboardTable = styled.table`
    text-align: left;
    border-collapse: collapse;
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
    position: sticky;
    padding: 0.5rem;
    color: var(--secondary);
    background-color: var(--primary);
`;

const TD = styled.td`
    // border: 1px solid black;
    padding-left: 0.5rem;
`;

function Leaderboard(props) {

    const { leaderboardData } = { ...props };

    return (
        <>
            <LeaderboardContainer>
                <LeaderboardHeader>
                    Leaderboard
                </LeaderboardHeader>
                <LeaderboardTableDiv>
                    <LeaderboardTable>
                        <THead>
                            <TR>
                                <TH>username</TH>
                                <TH>wins</TH>
                                <TH>losses</TH>
                                <TH>W/L</TH>
                            </TR>
                        </THead>
                        {leaderboardData.map(({ username, wins, losses }) => (
                            <TR>
                                <TD>
                                    {username}
                                </TD>
                                <TD>
                                    {wins}
                                </TD>
                                <TD>
                                    {losses}
                                </TD>
                                <TD>
                                    {wins/losses}
                                </TD>
                            </TR>
                        ))}
                    </LeaderboardTable>
                </LeaderboardTableDiv>
            </LeaderboardContainer>
        </>
    )
}

export default Leaderboard;
