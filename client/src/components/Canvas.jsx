import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { CanvasFooter } from "components/Canvas/";

const StyledCanvasContainer = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    border-radius: 1rem;
    width: 500px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

const StyledCanvas = styled.canvas`
    background-color: var(--white);
    vertical-align: bottom;
`;

const Canvas = React.forwardRef((props, ref) => {
    const canvasRef = ref;
    const sendToSocket = props.sendToSocket;

    useEffect(() => {
        var drawing = false;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const mainWindow = document.querySelector("html");

        // Stores the initial position of the cursor
        let coord = { x: 0, y: 0 };
        let lastCoord = { x: 0, y: 0 };

        // Update the position of the cursor on canvas
        const updateCoords = (e) => {
            coord.x = (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
            coord.y = (e.clientY || e.touches[0].clientY) - canvas.offsetTop;
        };

        const draw = (x0, y0, x1, y1, emit) => {
            y0 = y0 + mainWindow.scrollTop;
            y1 = y1 + mainWindow.scrollTop;
            ctx.beginPath();
            // Size and colour of pen
            ctx.lineCap = "round";
            ctx.lineWidth = 5;
            ctx.strokeStyle = "green";
            // Starting coordinate of path
            ctx.moveTo(x0, y0);
            // Ending coordinate of path
            ctx.lineTo(x1, y1);
            // Draw the path
            ctx.stroke();
            ctx.closePath();

            if (emit) {
                const w = canvas.width;
                const h = canvas.height;
                // Emit the coords
                socket.emit("draw", {
                    x0: x0 / w,
                    x1: x1 / w,
                    y0: y0 / h,
                    y1: y1 / h,
                });
            } else return;
        };

        const onMouseDown = (e) => {
            // Mouse is clicked, set drawing flag to true and update current coordinates
            drawing = true;
            updateCoords(e);
        };

        const onMouseUp = (e) => {
            // Mouse is up, set drawing flag to false
            if (!drawing) return;
            drawing = false;

            // Draw the path from current coordinates to final mouse position
            draw(
                coord.x,
                coord.y,
                lastCoord.x ||
                    (e.clientX || e.touches[0].clientX) - canvas.offsetLeft,
                lastCoord.y ||
                    (e.clientY || e.touches[0].clientY) - canvas.offsetTop,
                sendToSocket
            );
        };

        const onMouseMove = (e) => {
            if (!drawing) return;

            // Draw the path from current coordinates to mouse position while mouse is moving
            draw(
                coord.x,
                coord.y,
                (e.clientX || e.touches[0].clientX) - canvas.offsetLeft,
                (e.clientY || e.touches[0].clientY) - canvas.offsetTop,
                sendToSocket
            );
            // Update coordinates as mouse is moving
            updateCoords(e);
            lastCoord.x =
                (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
            lastCoord.y =
                (e.clientY || e.touches[0].clientY) - canvas.offsetTop;
        };

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
                draw(data.x0, data.y0, data.x1, data.y1);
            });
        }
    }, []);

    return (
        <StyledCanvasContainer>
            <StyledCanvas
                width="500"
                height="400"
                ref={canvasRef}
            ></StyledCanvas>
            <CanvasFooter canvasRef={canvasRef} sendToSocket={sendToSocket} />
        </StyledCanvasContainer>
    );
});

export default Canvas;
