/**
 * FR2 - Draw.User.Avatar
 * FR6 - Draw.Guest.Avatar
 * FR12 - Draw.Canvas
 * FR13 - Request.Tool
 * FR14 - Clean.Canvas
 */

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { playSound } from "service/playSound";
import selectSound from "assets/select.m4a";
import eraseSound from "assets/erase.m4a";

import { IconButton } from "components";
import { Desktop } from "service/mediaQueries";

const StyledCanvasFooter = styled.div`
    background-color: var(--beige);
    padding: 1rem;
    border-radius: ${(props) =>
        props.inGame && !props.isDesktop ? "0" : "0 0 1rem 1rem"};
    width: ${(props) => props.width};

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
`;

const StyledToolbar = styled.div`
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-items: center;
`;

const StyledColor = styled.button`
    width: 20px;
    height: 20px;
    margin: 0.2rem;
    border-radius: 100%;
    padding: 0;
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
    const isDesktop = Desktop();
    const {
        canvasRef,
        sendToSocket,
        isDrawing,
        inGame,
        penSizeChoices,
        colorChoices,
    } = { ...props };

    const drawingInGame = isDrawing || !sendToSocket;

    const clearButtonRef = useRef();

    const [penColor, setPenColor] = useState(
        localStorage.getItem("penColor") || "black"
    );
    const [showPenSize, setShowPenSize] = useState();
    const [penSizeIndex, setPenSizeIndex] = useState(0);
    const [width, setWidth] = useState("auto");

    const handleChangePenSize = (e) => {
        if (!drawingInGame) return;
        e.preventDefault();
        setPenSizeIndex(e.target.value);
        localStorage.setItem("penSize", penSizeChoices[e.target.value]);
    };

    const handleChangeColor = (e) => {
        if (!drawingInGame) return;
        e.preventDefault();
        playSound(selectSound);
        setPenColor(e.target.getAttribute("color"));
        localStorage.setItem("penColor", e.target.getAttribute("color"));
    };

    const handlePenTool = (e) => {
        if (!drawingInGame) return;
        e.preventDefault();
        playSound(selectSound);
        if (penColor === "white") {
            setPenColor("black");
            localStorage.setItem("penColor", "black");
        }
        setShowPenSize(!showPenSize);
    };

    const handleEraserTool = (e) => {
        if (!drawingInGame) return;
        e.preventDefault();
        playSound(selectSound);
        setPenColor("white");
        localStorage.setItem("penColor", "white");
        setShowPenSize(!showPenSize);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const clearButton = clearButtonRef.current;

        // Resize footer to fit canvas
        setWidth(canvas.width + "px");

        const clearCanvas = () => {
            ctx.clearRect(0, 0, 450, 450);
        };

        const handleClearCanvas = (e) => {
            if (!drawingInGame) return;
            e.preventDefault();
            playSound(eraseSound);
            clearCanvas();
            // Tell socket to clear the canvas
            if (sendToSocket) socket.emit("clear-canvas");
        };

        clearButton.addEventListener("click", handleClearCanvas);
        canvas.addEventListener("click", () => setShowPenSize(false));
        // If we receive clear-canvas from socket, clear the canvas
        if (sendToSocket) {
            socket.on("clear-canvas", clearCanvas);
        }

        return () => {
            //Socket cleanup
            socket.off("clear-canvas");
            // Event listener cleanup
            clearButton.removeEventListener("click", handleClearCanvas);
        };
    }, [canvasRef, sendToSocket, isDrawing, drawingInGame, width]);

    return (
        <StyledCanvasFooter isDesktop={isDesktop} width={width} inGame={inGame}>
            <StyledToolbar isDesktop={isDesktop}>
                <div>
                    <IconButton
                        ref={clearButtonRef}
                        iconClassName="bi-trash-fill"
                    />
                    <IconButton
                        iconClassName="bi-eraser-fill"
                        onClick={handleEraserTool}
                        className={
                            localStorage.getItem("penColor") === "white" &&
                            "active"
                        }
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
                            type="button"
                            className={
                                localStorage.getItem("penColor") === color &&
                                "active"
                            }
                        />
                    ))}
                </div>
            </StyledToolbar>
        </StyledCanvasFooter>
    );
}

export default CanvasFooter;
