import { IconButton } from "components";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

const StyledToolbar = styled.div`
    display: flex;
    justify-content: space-between;
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

        width: ${(props) => props.value}px;
        height: ${(props) => props.value}px;
        border-radius: 50%;
        background: ${(props) => props.penColor};
        cursor: pointer;
    }

    ::-moz-range-thumb {
        width: ${(props) => props.value}px;
        height: ${(props) => props.value}px;
        border-radius: 50%;
        background: ${(props) => props.penColor};
        cursor: pointer;
    }
`;

function Toolbar(props) {
    const [penSize, setPenSize] = useState(10);
    const [penColor, setPenColor] = useState("black");

    const { canvasRef, sendToSocket, isDrawing } = { ...props };
    const clearButtonRef = useRef();

    const handleChangePenSize = (e) => {
        e.preventDefault();
        setPenSize(e.target.value);
        localStorage.setItem("penSize", e.target.value);
    };

    const handleChangeColor = (e) => {
        e.preventDefault();
        console.log(e.target);
        setPenColor(e.target.getAttribute("color"));
        localStorage.setItem("penColor", e.target.getAttribute("color"));
    };

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
        <StyledToolbar>
            <div>
                <IconButton
                    ref={clearButtonRef}
                    iconClassName="bi-trash-fill"
                />
            </div>
            <div>
                <IconButton
                    iconClassName="bi-eraser-fill"
                    color="white"
                    onClick={handleChangeColor}
                />
            </div>
            <div>
                <i className="bi bi-pencil-fill"></i>
                <StyledRangeInput
                    penColor={penColor}
                    min={10}
                    max={50}
                    step={10}
                    value={penSize}
                    onChange={handleChangePenSize}
                    type="range"
                />
            </div>
            <div>
                <StyledColor color="green" onClick={handleChangeColor} />
                <StyledColor color="black" onClick={handleChangeColor} />
                <StyledColor color="blue" onClick={handleChangeColor} />
                <StyledColor color="red" onClick={handleChangeColor} />
                <StyledColor color="orange" onClick={handleChangeColor} />
            </div>
        </StyledToolbar>
    );
}

export default Toolbar;
