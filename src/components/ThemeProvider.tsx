"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
    theme: "dark",
    toggle: () => {},
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");

    // Sync initial value from localStorage, fall back to browser preference
    useEffect(() => {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") {
            setTheme(stored);
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            setTheme("light");
        }
    }, []);

    // Apply class + persist whenever theme changes
    useEffect(() => {
        document.documentElement.classList.toggle("light", theme === "light");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggle = useCallback(() => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}
