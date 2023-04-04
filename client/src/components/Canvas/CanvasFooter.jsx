import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { IconButton } from "components";
import { Toolbar } from "components/Canvas/";

const StyledCanvasFooter = styled.div`
    background-color: var(--beige);
    padding: 1rem;
    margin-bottom: 1rem;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
`;

function CanvasFooter(props) {
    const { canvasRef, sendToSocket, isDrawing } = { ...props };
    const clearButtonRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const clearButton = clearButtonRef.current;

        const clearCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        const handleClearCanvas = (e) => {
            if (!isDrawing && sendToSocket) {
                return;
            }
            e.preventDefault();
            clearCanvas();
            // Tell socket to clear the canvas
            if (sendToSocket) socket.emit("clear-canvas");
        };

        clearButton.addEventListener("click", handleClearCanvas);

        // If we receive clear-canvas from socket, clear the canvas
        if (sendToSocket) {
            socket.off("clear-canvas");
            socket.on("clear-canvas", clearCanvas);
        }
        return () => {
            clearButton.removeEventListener("click", handleClearCanvas);
        };
    }, [canvasRef, sendToSocket, isDrawing]);

    return (
        <StyledCanvasFooter>
            <IconButton ref={clearButtonRef} iconClassName="bi-eraser-fill" />
            <Toolbar />
        </StyledCanvasFooter>
    );
}

export default CanvasFooter;
