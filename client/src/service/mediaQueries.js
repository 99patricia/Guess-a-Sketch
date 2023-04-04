import { useMediaQuery } from "react-responsive";

const useDesktopMediaQuery = () =>
    useMediaQuery({ query: "(min-width: 769px)" });

const useTabletAndBelowMediaQuery = () =>
    useMediaQuery({ query: "(max-width: 768px)" });

const useMobileMediaQuery = () =>
    useMediaQuery({ query: "(max-width: 380px)" });

export const Desktop = () => {
    return useDesktopMediaQuery();
};

export const TabletAndBelow = () => {
    return useTabletAndBelowMediaQuery();
};

export const Mobile = () => {
    return useMobileMediaQuery();
};
