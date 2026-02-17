const getTheme = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light Mode
                primary: {
                    main: "#2563EB",
                    light: "#60A5FA",
                    dark: "#1E40AF",
                    contrastText: "#ffffff",
                },
                secondary: {
                    main: "#475569",
                },
                background: {
                    default: "#F8FAFC",
                    paper: "#FFFFFF",
                },
                text: {
                    primary: "#1E293B",
                    secondary: "#64748B",
                },
            }
            : {
                // Dark Mode ("True Dark")
                primary: {
                    main: "#3B82F6",
                    light: "#60A5FA",
                    dark: "#2563EB",
                    contrastText: "#ffffff",
                },
                secondary: {
                    main: "#A1A1AA", // Zinc 400
                },
                background: {
                    default: "#09090b", // Zinc 950 (Quasi noir)
                    paper: "#18181b",   // Zinc 900 (Gris très foncé)
                },
                text: {
                    primary: "#FAFAFA", // Blanc cassé
                    secondary: "#A1A1AA",
                },
            }),
        success: { main: "#10B981" },
        warning: { main: "#F59E0B" },
        error: { main: "#EF4444" },
        info: { main: "#3B82F6" },
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        h1: { fontWeight: 700, letterSpacing: "-0.025em" },
        h2: { fontWeight: 600, letterSpacing: "-0.025em" },
        h3: { fontWeight: 600, letterSpacing: "-0.025em" },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { letterSpacing: "0.01em" },
        button: {
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: "0.01em",
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    padding: "8px 16px",
                    "&:hover": {
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    },
                },
                containedPrimary: {
                    "&:hover": {
                        backgroundColor: mode === 'light' ? "#1D4ED8" : "#2563EB",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: mode === 'light'
                        ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
                        : "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
                    border: mode === 'light' ? "1px solid #E2E8F0" : "1px solid rgba(255, 255, 255, 0.1)",
                    backgroundImage: "none",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: mode === 'light' ? "#F8FAFC" : "#18181b", // Zinc 900 en dark
                    color: mode === 'light' ? "#475569" : "#A1A1AA",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: mode === 'light' ? "#2563EB" : "#09090b", // Noir profond en Dark Mode
                    color: mode === 'light' ? "#ffffff" : "#FAFAFA",
                    borderRight: mode === 'light' ? "none" : "1px solid rgba(255,255,255,0.08)", // Légère bordure en dark pour séparer
                }
            }
        }
    },
});

export default getTheme;
