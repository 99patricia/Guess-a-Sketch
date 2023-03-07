import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledCanvasContainer = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    border-radius: 1rem;
    width: 500px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

const StyledCanvas = styled.canvas`
    background-color: var(--white);
`;

function Canvas(props) {
    const { socket } = { ...props };
    const canvasRef = useRef();

    useEffect(() => {
        var drawing = false;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Stores the initial position of the cursor
        let coord = { x: 0, y: 0 };

        // Update the position of the cursor on canvas
        const updateCoords = (e) => {
            coord.x = e.clientX - canvas.offsetLeft;
            coord.y = e.clientY - canvas.offsetTop;
        };

        const draw = (x0, y0, x1, y1, emit) => {
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

            if (!emit) return;
            // Emit the coords
            socket.emit("draw", {
                x0: x0,
                x1: x1,
                y0: y0,
                y1: y1,
            });
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
                e.clientX - canvas.offsetLeft,
                e.clientY - canvas.offsetTop,
                true
            );
        };

        const onMouseMove = (e) => {
            if (!drawing) return;

            // Draw the path from current coordinates to mouse position while mouse is moving
            draw(
                coord.x,
                coord.y,
                e.clientX - canvas.offsetLeft,
                e.clientY - canvas.offsetTop,
                true
            );
            // Update coordinates as mouse is moving
            updateCoords(e);
        };

        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mousemove", onMouseMove);

        // If we receive coordinates from socket, draw them
        socket.on("draw", (data) => {
            draw(data.x0, data.y0, data.x1, data.y1);
        });
    }, [socket]);

    return (
        <StyledCanvasContainer>
            <StyledCanvas
                width="500"
                height="470"
                ref={canvasRef}
            ></StyledCanvas>
        </StyledCanvasContainer>
    );
}

export default Canvas;
