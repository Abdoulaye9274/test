import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Button, Box, Avatar, IconButton, Tooltip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../context/ColorModeContext";
import { motion, AnimatePresence } from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DescriptionIcon from "@mui/icons-material/Description";
import BuildIcon from "@mui/icons-material/Build";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const drawerWidth = 240;

export default function DashboardLayout() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useColorMode();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "none"
          }
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={require("../assets/logo.png")}
            alt="Logo"
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'background.paper',
              borderRadius: '50%',
              p: 0.5
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "inherit" }}>
            ClientFlow
          </Typography>
        </Toolbar>

        <List sx={{ px: 2 }}>
          {[
            { text: "Tableau de bord", icon: <DashboardIcon />, path: "/dashboard" },
            { text: "Clients", icon: <PeopleIcon />, path: "/dashboard/clients" },
            { text: "Contrats", icon: <DescriptionIcon />, path: "/dashboard/contracts" },
            { text: "Services", icon: <BuildIcon />, path: "/dashboard/services" },
            { text: "Assistant IA", icon: <SmartToyIcon />, path: "/dashboard/ai" },
            { text: "Paramètres", icon: <SettingsIcon />, path: "/dashboard/settings" }
          ].map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                mb: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            fullWidth
            onClick={handleLogout}
            sx={{ color: "inherit", borderColor: "rgba(255,255,255,0.5)" }}
          >
            Déconnexion
          </Button>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 0, bgcolor: "background.default", minHeight: "100vh" }}>
        {/* Glassmorphism Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "rgba(255,255,255,0.8)", // Semi-transparent
            backdropFilter: "blur(12px)", // Flou "verre dépoli"
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            color: "text.primary",
            zIndex: (theme) => theme.zIndex.drawer + 1
          }}
        >
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold", background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Tableau de bord
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title={theme.palette.mode === 'dark' ? "Passer en mode clair" : "Passer en mode sombre"}>
                <IconButton
                  onClick={colorMode.toggleColorMode}
                  color="inherit"
                  aria-label={theme.palette.mode === 'dark' ? "Activer le mode clair" : "Activer le mode sombre"}
                >
                  {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {JSON.parse(localStorage.getItem('user') || '{}').login || 'Utilisateur'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
                onClick={() => navigate("/dashboard/settings")}
              >
                {(JSON.parse(localStorage.getItem('user') || '{}').login || 'U')[0].toUpperCase()}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Zone de contenu avec transition fluide */}
        <Box sx={{ p: 3 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
