import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { IconButton } from "components";

const StyledCanvasFooter = styled.div`
    background-color: var(--beige);
    padding: 1rem;
    margin-bottom: 1rem;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
`;

const StyledToolbar = styled.div`
    display: grid;
    grid-auto-flow: column;
`;

const StyledColor = styled.button`
    width: 20px;
    height: 20px;
    margin: 0.2rem;
    border-radius: 100%;
    border: none;
    cursor: pointer;
    background-color: ${(props) => props.color};
`;

const StyledRangeInputContainer = styled.div`
    background-color: var(--beige);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    padding: 1rem 0.5rem;
    height: 30px;
    margin-top: -120px;
    position: absolute;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

const StyledRangeInput = styled.input`
    -webkit-appearance: none;

    width: 100%;
    height: 5px;
    border-radius: 5px;
    background: var(--white);
    outline: none;

    ::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;

        width: ${(props) => props.size}px;
        height: ${(props) => props.size}px;
        border-radius: 50%;
        background: ${(props) => props.penColor};
        cursor: pointer;
    }

    ::-moz-range-thumb {
        width: ${(props) => props.size}px;
        height: ${(props) => props.size}px;
        border-radius: 50%;
        background: ${(props) => props.penColor};
        cursor: pointer;
    }
`;

function CanvasFooter(props) {
    const { canvasRef, sendToSocket, isDrawing, penSizeChoices, colorChoices } =
        { ...props };

    const drawingInGame = isDrawing || !sendToSocket;

    const clearButtonRef = useRef();

    const [penColor, setPenColor] = useState("black");
    const [showPenSize, setShowPenSize] = useState();
    const [penSizeIndex, setPenSizeIndex] = useState(0);

    const handleChangePenSize = (e) => {
        if (!drawingInGame) return;
        e.preventDefault();
        setPenSizeIndex(e.target.value);
        localStorage.setItem("penSize", penSizeChoices[e.target.value]);
    };

    const handleChangeColor = (e) => {
        if (!drawingInGame) return;
        e.preventDefault();
        setPenColor(e.target.getAttribute("color"));
        localStorage.setItem("penColor", e.target.getAttribute("color"));
    };

    const handlePenTool = (e) => {
        if (!drawingInGame) return;
        e.preventDefault();
        if (penColor === "white") {
            setPenColor("black");
            localStorage.setItem("penColor", "black");
        }
        setShowPenSize(!showPenSize);
    };

    const handleEraserTool = (e) => {
        if (!drawingInGame) return;
        e.preventDefault();
        setPenColor("white");
        localStorage.setItem("penColor", "white");
        setShowPenSize(!showPenSize);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const clearButton = clearButtonRef.current;

        const clearCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        const handleClearCanvas = (e) => {
            if (!drawingInGame) return;
            e.preventDefault();
            clearCanvas();
            // Tell socket to clear the canvas
            if (sendToSocket) socket.emit("clear-canvas");
        };

        clearButton.addEventListener("click", handleClearCanvas);
        canvas.addEventListener("click", () => setShowPenSize(false));
        // If we receive clear-canvas from socket, clear the canvas
        if (sendToSocket) {
            socket.off("clear-canvas");
            socket.on("clear-canvas", clearCanvas);
        }
        return () => {
            clearButton.removeEventListener("click", handleClearCanvas);
        };
    }, [canvasRef, sendToSocket, isDrawing, drawingInGame]);

    return (
        <StyledCanvasFooter>
            <StyledToolbar>
                <div>
                    <IconButton
                        ref={clearButtonRef}
                        iconClassName="bi-trash-fill"
                    />
                    <IconButton
                        iconClassName="bi-eraser-fill"
                        onClick={handleEraserTool}
                    />
                    <IconButton
                        iconClassName="bi-pencil-fill"
                        onClick={handlePenTool}
                    />
                    {showPenSize && (
                        <StyledRangeInputContainer>
                            <p>{penSizeChoices[penSizeIndex]}</p>
                            <StyledRangeInput
                                penColor={penColor}
                                min={0}
                                max={penSizeChoices.length - 1}
                                step={1}
                                value={penSizeIndex}
                                size={penSizeChoices[penSizeIndex]}
                                onChange={handleChangePenSize}
                                type="range"
                            />
                        </StyledRangeInputContainer>
                    )}
                </div>
                <div>
                    {colorChoices.map((color) => (
                        <StyledColor
                            key={color}
                            color={color}
                            onClick={handleChangeColor}
                        />
                    ))}
                </div>
            </StyledToolbar>
        </StyledCanvasFooter>
    );
}

export default CanvasFooter;
