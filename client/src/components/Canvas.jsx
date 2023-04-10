import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { CanvasFooter, CanvasHeader, ScoreCard } from "components/Canvas/";
import { Desktop } from "service/mediaQueries";

const StyledCanvasContainer = styled.div`
    ${(props) =>
        !props.noContainer &&
        `
        padding: 1rem;
        padding-top: 0.25rem;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
        border-radius: 1rem;
        `}

    position: relative;
    overflow: hidden;
    background-color: var(--light-beige);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;

    ${(props) =>
        !props.isDesktop &&
        props.inGame &&
        `width: 100vw;
        margin-left: -1rem;
    `}
`;

const StyledCanvas = styled.canvas`
    background-color: var(--white);
    vertical-align: bottom;
    border-radius: ${(props) =>
        props.inGame && !props.isDesktop ? "0" : "1rem 1rem 0 0"};
`;

const Canvas = React.forwardRef((props, ref) => {
    const isDesktop = Desktop();
    const canvasRef = ref;
    const {
        noContainer,
        gameData,
        isDrawing,
        word,
        sendToSocket,
        timeLeft,
        inGame,
        showScoreCard,
        playersData,
        prevWord,
    } = { ...props };

    const penSizeChoices = props.penSizeChoices || [10, 50];
    const colorChoices = props.colorChoices || ["black", "red", "blue"];
    const [width, setWidth] = useState("auto");

    useEffect(() => {
        var drawing = false;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const mainWindow = document.querySelector("html");
        const canDraw = isDrawing;

        // Resize canvas
        if (inGame) {
            // Resize the canvas to fit screen width
            if (window.innerWidth <= 500) {
                canvas.width =
                    !isDesktop || !gameData ? window.innerWidth : 500;
            } else {
                canvas.width = 500;
            }
            canvas.height = 500;
        } else {
            // Resize the draw avatar canvas to fit form
            const canvasParentWidth = canvas.parentElement.clientWidth;
            canvas.width = canvasParentWidth;
            canvas.height = canvasParentWidth;
        }
        // For header CSS
        setWidth(canvas.width + "px");

        // Stores the initial position of the cursor
        let coord = { x: 0, y: 0 };
        let lastCoord = { x: 0, y: 0 };

        // Update the position of the cursor on canvas
        const updateCoords = (e) => {
            coord.x = (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
            coord.y = (e.clientY || e.touches[0].clientY) - canvas.offsetTop;
        };

        const draw = (x0, y0, x1, y1, color, size, emit) => {
            y0 = y0 + mainWindow.scrollTop;
            y1 = y1 + mainWindow.scrollTop;
            ctx.beginPath();

            // Size and colour of pen
            ctx.lineCap = "round";
            ctx.lineWidth = size;
            ctx.strokeStyle = color;
            // Starting coordinate of path
            ctx.moveTo(x0, y0);
            // Ending coordinate of path
            ctx.lineTo(x1, y1);
            // Draw the path
            ctx.stroke();
            ctx.closePath();

            if (emit) {
                // Emit the coords
                socket.emit("draw", {
                    x0: x0,
                    x1: x1,
                    y0: y0,
                    y1: y1,
                    penColor: color,
                    penSize: size,
                });
            } else return;
        };

        const onMouseDown = (e) => {
            e.preventDefault();
            // Mouse is clicked, set drawing flag to true and update current coordinates
            drawing = true;
            updateCoords(e);
            lastCoord.x =
                (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
            lastCoord.y =
                (e.clientY || e.touches[0].clientY) - canvas.offsetTop;
        };

        const onMouseUp = (e) => {
            e.preventDefault();
            // Mouse is up, set drawing flag to false
            if (!drawing) return;
            drawing = false;
            if (canDraw === false) return;
            const penSize = localStorage.getItem("penSize") || 10;
            const penColor = localStorage.getItem("penColor") || "black";
            // Draw the path from current coordinates to final mouse position
            draw(
                coord.x,
                coord.y,
                lastCoord.x ||
                    (e.clientX || e.touches[0].clientX) - canvas.offsetLeft,
                lastCoord.y ||
                    (e.clientY || e.touches[0].clientY) - canvas.offsetTop,
                penColor,
                penSize,
                sendToSocket
            );
        };

        const onMouseMove = (e) => {
            e.preventDefault();
            if (!drawing || canDraw === false) return;
            const penSize = localStorage.getItem("penSize") || 10;
            const penColor = localStorage.getItem("penColor") || "black";
            // Draw the path from current coordinates to mouse position while mouse is moving
            draw(
                coord.x,
                coord.y,
                (e.clientX || e.touches[0].clientX) - canvas.offsetLeft,
                (e.clientY || e.touches[0].clientY) - canvas.offsetTop,
                penColor,
                penSize,
                sendToSocket
            );
            // Update coordinates as mouse is moving
            updateCoords(e);
            lastCoord.x =
                (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
            lastCoord.y =
                (e.clientY || e.touches[0].clientY) - canvas.offsetTop;
        };

        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mouseout", onMouseUp);
        canvas.removeEventListener("mousemove", onMouseMove);

        // Mouse event listeners
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mouseout", onMouseUp);
        canvas.addEventListener("mousemove", onMouseMove);
        // Touch event listeners
        canvas.addEventListener("touchstart", onMouseDown);
        canvas.addEventListener("touchend", onMouseUp);
        canvas.addEventListener("touchcancel", onMouseUp);
        canvas.addEventListener("touchmove", onMouseMove);

        // If we receive coordinates from socket, draw them
        if (sendToSocket) {
            socket.on("draw", (data) => {
                // Only receive if we are not the person currently drawing
                if (!canDraw)
                    draw(
                        data.x0,
                        data.y0,
                        data.x1,
                        data.y1,
                        data.penColor,
                        data.penSize
                    );
            });
        }

        return () => {
            // Socket cleanup
            socket.off("draw");

            // Event listener cleanup
            canvas.removeEventListener("mousedown", onMouseDown);
            canvas.removeEventListener("mouseup", onMouseUp);
            canvas.removeEventListener("mouseout", onMouseUp);
            canvas.removeEventListener("mousemove", onMouseMove);

            canvas.removeEventListener("touchstart", onMouseDown);
            canvas.removeEventListener("touchend", onMouseUp);
            canvas.removeEventListener("touchcancel", onMouseUp);
            canvas.removeEventListener("touchmove", onMouseMove);
        };
    }, [canvasRef, sendToSocket, isDrawing]);

    return (
        <StyledCanvasContainer
            width={props.width}
            isDesktop={isDesktop}
            inGame={inGame}
            noContainer={noContainer}
        >
            <ScoreCard
                showScoreCard={showScoreCard}
                playersData={playersData}
                width={width}
                prevWord={prevWord}
            />
            {sendToSocket && (
                <CanvasHeader
                    gameData={gameData}
                    isDrawing={isDrawing}
                    timeLeft={timeLeft}
                    word={word}
                    width={width}
                />
            )}
            <StyledCanvas
                isDesktop={isDesktop}
                ref={canvasRef}
                inGame={inGame}
            ></StyledCanvas>
            <CanvasFooter
                canvasRef={canvasRef}
                sendToSocket={sendToSocket}
                isDrawing={isDrawing}
                inGame={inGame}
                penSizeChoices={penSizeChoices}
                colorChoices={colorChoices}
            />
        </StyledCanvasContainer>
    );
});

export default Canvas;
