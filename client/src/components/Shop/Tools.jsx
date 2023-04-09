import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUserData } from "hooks";
import axios from "axios";
import { Desktop } from "service/mediaQueries";

const ToolContainer = styled.div`
    display: grid;
    grid-template-columns: ${(props) =>
        props.isDesktop ? "repeat(3, 1fr)" : "1fr"};
    grid-gap: 2rem;
`;

const ToolItem = styled.div`
    background-color: var(--beige);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    > div {
        padding: 1rem 2rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .perkname {
        padding-top: 2rem;
        font-size: 1.2rem;
    }

    .description {
        font-style: italic;
        padding: 0 2rem;
    }

    .colors: {
        padding: 0 2rem;
    }

    .pensizes {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .price {
        background-color: var(--secondary);
        color: var(--white);
        width: 100%;
        border-radius: 0 0 1rem 1rem;
    }
`;

const ColorChoices = styled.div`
    width: 20px;
    height: 20px;
    margin: 0.2rem;
    display: inline-block;
    border-radius: 100%;
    padding: 0;
    background-color: ${(props) => props.color};
`;

const PenSizes = styled.div`
    width: ${(props) => props.size * 0.8}px;
    height: ${(props) => props.size * 0.8}px;
    margin: 0.2rem;
    display: inline-block;
    border-radius: 100%;
    padding: 0;
    background-color: black;
`;

function Tool(props) {
    const isDesktop = Desktop();
    const { loggedInAsGuest } = useUserData();
    const [perksData, setPerksData] = useState([]);

    useEffect(() => {
        if (!loggedInAsGuest) {
            axios.get("/perks").then((res) => {
                setPerksData(res.data);
            });
        }
    }, []);

    return (
        <ToolContainer isDesktop={isDesktop}>
            {perksData.map((perk) => (
                <ToolItem key={perk.perk_id}>
                    <div className="perkname">{perk.perkname}</div>
                    <div className="description">{perk.description}</div>
                    <div className="colors">
                        {perk.colors.map((color) => (
                            <ColorChoices key={color} color={color} />
                        ))}
                    </div>
                    <div className="pensizes">
                        {perk.pen_sizes
                            .sort((a, b) => a - b)
                            .map((size) => (
                                <PenSizes key={size} size={size} />
                            ))}
                    </div>
                    <div className="price">{perk.price} pts</div>
                </ToolItem>
            ))}
        </ToolContainer>
    );
}

export default Tool;
