import React, { useEffect, useState } from "react";
import styled from "styled-components";

import default_user_image from '../images/default_user.png'

const ScoreboardContainer = styled.div`
    width: 220px;
`;

const ScoreboardList = styled.div`
    display: grid;
    grid-template-rows: repeat(auto-fill,4rem);
    grid-gap: 0.25rem;
    padding-top: 0.25rem;
    height: 100%;
`;

const ScoreboardCard = styled.div`
    display: grid;
    grid-template-columns: 130px 60px;
    align-items: center;
    text-align: center;
    
    background-color: var(--light-beige);
    border-radius: 0.25rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);

    // outline: 2px solid var(--seconday);
`;

const scoreboardCardStyle = {
    'display': 'grid',
    'grid-template-columns': '130px 60px',
    'align-items': 'center',
    'text-align': 'center',
    
    'background-color': 'var(--light-beige)',
    'border-radius': '0.25rem',
    'box-shadow': '0px 4px 4px rgba(0, 0, 0, 0.1)',
}

const UserImage = styled.img`
    display: block;
    width: 60px;
    border-radius: 50%;

    // border: 1px solid var(--secondary);
`;

function Scoreboard(props) {
    const { gameData, isHost, this_username } = { ...props };

    return (
        <ScoreboardContainer>
            <ScoreboardList>
                {gameData.players.map(({username, score, isHost, hasGuessed}) => (
                    <div style={{...scoreboardCardStyle, ...{outline : username==gameData.currentTurn? '2px solid var(--secondary)' : '0'}}}>
                        {username === this_username && 
                            <div>
                                <p style={{margin: '0', color: 'var(--secondary)'}}>
                                    {username} <br></br>
                                    Score: {score}
                                </p>
                            </div>
                        }
                        {username !== this_username &&
                            <div>
                                <p style={{margin: '0', color: 'var(--primary)'}}>
                                    {username} <br></br>
                                    Score: {score}
                                </p>
                            </div>
                        }
                        <UserImage src={default_user_image} />
                    </div>
                ))}
            </ScoreboardList>
        </ScoreboardContainer>
    )
}

export default Scoreboard;