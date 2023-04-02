import styled from "styled-components";

const CanvasHeaderContainer = styled.div`
    display: grid;
    // grid-template-columns: 150px 50px 150px;
    grid-template-columns: repeat(auto-fit,minmax(100px, 1fr));
    align-items: center;
    // text-align: center;
    margin: 0;

    // outline: 1px solid black;
`;

function GameHeader(props) {

    const { timeLeft, gameData, isDrawing, word } = { ...props };

    const currentTurn = gameData.currentTurn;
    const numRounds = gameData.numberOfRounds;
    const currentRound = gameData.currentRound;

    return (
        <CanvasHeaderContainer>
            <p style={{textAlign:'left'}}>Round {currentRound} of {numRounds}</p>
            <p style={{textAlign:'left'}}>Time Left: {timeLeft}</p>
            {isDrawing && 
                <p style={{textAlign:'right'}}>Your word is {word}.</p>
            }
            {!isDrawing &&
                <p style={{textAlign:'right'}}>{currentTurn} is drawing...</p>
            }
        </CanvasHeaderContainer>
    )
}

export default GameHeader