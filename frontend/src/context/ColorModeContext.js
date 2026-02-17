import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getTheme from '../theme';

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => {
    return useContext(ColorModeContext);
};

export const ColorModeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        // Check localStorage or system preference
        const savedMode = localStorage.getItem('colorMode');
        if (savedMode) return savedMode;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        localStorage.setItem('colorMode', mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            mode,
        }),
        [mode],
    );

    const theme = useMemo(() => createTheme(getTheme(mode)), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
