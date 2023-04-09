import React, { useState } from "react";
import styled from "styled-components";
import { Desktop } from "service/mediaQueries";
import Button from "components/Button";

const ToolContainer = styled.div`
    display: grid;
    grid-template-columns: ${(props) =>
        props.isDesktop ? "repeat(3, 1fr)" : "1fr"};
    grid-gap: 2rem;
`;

const ToolItemContainer = styled.div`
    position: relative;
    display: inline-block;

    :hover {
        outline: 3px solid var(--secondary);
        border-radius: 1rem;
    }

    :hover button {
        opacity: 1;
    }

    :hover::after {
        opacity: 0.5;
    }

    ::after {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: var(--secondary);
        border-radius: 1rem;
        opacity: 0;
    }

    transition: opacity 0.3s ease-in-out;
`;

const BuyPerkButton = styled(Button)`
    transition: opacity 0.1s ease-in-out;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 2;
`;

const ToolItem = styled.div`
    background-color: var(--beige);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    opacity: 1;
    height: 100%;

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

const BuyDialog = styled.div``;

function Tool(props) {
    const isDesktop = Desktop();
    const { perks } = { ...props };

    const [showBuyDialog, setShowBuyDialog] = useState(false);
    const [item, setItem] = useState("");
    const handleShowBuyDialog = (e) => {
        let itemName = e.target.id;
        setItem(perks.find((perk) => perk.perkname === itemName));
        setShowBuyDialog(true);
    };

    return (
        <>
            {showBuyDialog ? (
                <BuyDialog>
                    Are you sure you want to redeem {item.perkname} for{" "}
                    {item.price} points?
                    <Button secondary onClick={() => setShowBuyDialog(false)}>
                        Back
                    </Button>
                    <Button>Buy</Button>
                </BuyDialog>
            ) : (
                <>
                    <ToolContainer isDesktop={isDesktop}>
                        {perks.map((perk) => (
                            <ToolItemContainer key={perk.perk_id}>
                                <BuyPerkButton
                                    secondary
                                    id={perk.perkname}
                                    onClick={(e) => handleShowBuyDialog(e)}
                                >
                                    Redeem
                                </BuyPerkButton>
                                <ToolItem>
                                    <div className="perkname">
                                        {perk.perkname}
                                    </div>
                                    <div className="description">
                                        {perk.description}
                                    </div>
                                    <div className="colors">
                                        {perk.colors.map((color) => (
                                            <ColorChoices
                                                key={color}
                                                color={color}
                                            />
                                        ))}
                                    </div>
                                    <div className="pensizes">
                                        {perk.pen_sizes
                                            .sort((a, b) => a - b)
                                            .map((size) => (
                                                <PenSizes
                                                    key={size}
                                                    size={size}
                                                />
                                            ))}
                                    </div>
                                    <div className="price">
                                        {perk.price} pts
                                    </div>
                                </ToolItem>
                            </ToolItemContainer>
                        ))}
                    </ToolContainer>
                </>
            )}
        </>
    );
}

export default Tool;
