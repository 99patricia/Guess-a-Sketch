import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledToolbar = styled.div``;

const StyledColor = styled.button`
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
    border: none;
    cursor: pointer;
    background-color: ${(props) => props.color};
`;

function Toolbar(props) {
    const penSizeRef = useRef();

    useEffect(() => {
        const penSizeRange = penSizeRef.current;

        penSizeRange.addEventListener("change", (e) => {
            e.preventDefault();
            localStorage.setItem("penSize", e.target.value);
        });
    }, []);

    const handleChangeColor = (e) => {
        e.preventDefault();
        localStorage.setItem("penColor", e.target.getAttribute("color"));
    };

    return (
        <StyledToolbar>
            <div>
                <i className="bi bi-pencil-fill"></i>
                <input
                    min={5}
                    max={25}
                    step={5}
                    ref={penSizeRef}
                    type="range"
                ></input>
            </div>
            <div>
                <StyledColor color="green" onClick={handleChangeColor} />
                <StyledColor color="black" onClick={handleChangeColor} />
                <StyledColor color="white" onClick={handleChangeColor} />
                <StyledColor color="blue" onClick={handleChangeColor} />
                <StyledColor color="red" onClick={handleChangeColor} />
                <StyledColor color="orange" onClick={handleChangeColor} />
            </div>
        </StyledToolbar>
    );
}

export default Toolbar;
