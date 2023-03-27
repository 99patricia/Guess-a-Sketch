import styled from "styled-components";

const CanvasHeaderContainer = styled.div`
    display: grid;
    // grid-template-columns: 200px 200px;
    grid-template-columns: repeat(auto-fill,minmax(200px, 1fr));
    align-items: center;
    // text-align: center;
    margin: 0;

    // outline: 1px solid black;
`;

function GameHeader(props) {

    const { timeLeft, currentTurn, isDrawing, word } = { ...props };

    return (
        <CanvasHeaderContainer>
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