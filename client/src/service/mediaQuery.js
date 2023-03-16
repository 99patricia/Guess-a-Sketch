import { useMediaQuery } from "react-responsive";

export const MediaQuery = () => {
    const isBigScreen = useMediaQuery({ query: "(min-width: 769px)" });
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

    return { isBigScreen, isTabletOrMobile };
};
