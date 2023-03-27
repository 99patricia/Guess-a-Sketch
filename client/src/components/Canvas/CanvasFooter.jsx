import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { IconButton } from "components";

const StyledCanvasFooter = styled.div`
    background-color: var(--beige);
    padding: 1rem;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
`;

function CanvasFooter(props) {
    const canvasRef = props.canvasRef;
    const clearButtonRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const clearButton = clearButtonRef.current;

        const clearCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        const handleClearCanvas = (e) => {
            e.preventDefault();
            clearCanvas();
            // Tell socket to clear the canvas
            socket.emit("clear-canvas");
        };

        clearButton.addEventListener("click", handleClearCanvas);

        // If we receive clear-canvas from socket, clear the canvas
        socket.on("clear-canvas", clearCanvas);
    }, [canvasRef]);

    return (
        <StyledCanvasFooter>
            <IconButton ref={clearButtonRef} iconClassName="bi-eraser-fill" />
        </StyledCanvasFooter>
    );
}

export default CanvasFooter;
