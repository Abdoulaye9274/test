import React, { useEffect, useState } from "react";
import api from "../api";
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  Card,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Skeleton,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatCard({ title, value, icon, color, featured = false }) {
  const theme = useTheme(); // ✅ Ajout du hook useTheme

  return (
    <Card
      elevation={featured ? 6 : 1}
      sx={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        p: featured ? 4 : 3,
        height: "100%",
        borderRadius: 4,
        background: featured
          ? `linear-gradient(135deg, ${color} 0%, ${theme.palette.secondary.main} 100%)`
          : `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`, // Gradient subtil
        color: "#fff",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid rgba(255,255,255,0.1)",
        "&:hover": {
          transform: "translateY(-5px) scale(1.02)",
          boxShadow: featured
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        }
      }}
    >
      {/* Texture de fond (Cercle décoratif) */}
      <Box
        sx={{
          position: "absolute",
          right: -20,
          top: -20,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          mr: 3,
          p: featured ? 2 : 1.5,
          borderRadius: "16px",
          backdropFilter: "blur(4px)",
          bgcolor: "rgba(255,255,255,0.2)",
          display: "flex",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
        }}
      >
        {React.cloneElement(icon, { fontSize: featured ? "large" : "medium" })}
      </Box>
      <Box sx={{ zIndex: 1 }}>
        <Typography
          variant={featured ? "h6" : "body2"}
          sx={{
            opacity: 0.9,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: featured ? "0.9rem" : "0.75rem",
            mb: 0.5
          }}
        >
          {title}
        </Typography>
        <Typography
          variant={featured ? "h3" : "h5"}
          sx={{
            fontWeight: 800,
            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {value}
        </Typography>
      </Box>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const statsRes = await api.get('/stats/dashboard');

        setStats({
          clientCount: statsRes.data.clientCount,
          contractCount: statsRes.data.contractCount,
          revenue: parseFloat(statsRes.data.revenue),
          contractsHistory: statsRes.data.contractsHistory
        });

        try {
          const activitiesRes = await api.get('/activities/recent');
          setActivities(activitiesRes.data || []);
        } catch (err) {
          console.log('Activités non disponibles');
          setActivities([]);
        }

      } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <Box>
        {/* Skeleton Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            bgcolor: "rgba(0,0,0,0.05)", // Placeholder gris clair
          }}
        >
          <Skeleton variant="text" width="40%" height={50} animation="wave" />
          <Skeleton variant="text" width="60%" height={30} animation="wave" />
        </Paper>

        {/* Skeleton Key Stats */}
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card elevation={0} sx={{ p: 3, borderRadius: 2, height: 100, display: "flex", alignItems: "center" }}>
                <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
                <Box sx={{ width: "100%" }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" height={40} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Skeleton Chart */}
        <Box sx={{ mt: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
          </Paper>
        </Box>

        {/* Skeleton Table */}
        <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
          <Skeleton variant="text" width="25%" height={40} sx={{ mb: 3 }} />
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Skeleton variant="text" width="20%" />
              <Skeleton variant="text" width="15%" />
              <Skeleton variant="text" width="15%" />
              <Skeleton variant="text" width="10%" />
              <Skeleton variant="text" width="30%" />
            </Box>
          ))}
        </Paper>
      </Box>
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          borderRadius: 2,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(120deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.background.paper} 100%)`
            : `linear-gradient(120deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "#fff",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Bienvenue sur ClientFlow
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Voici ce qui se passe aujourd'hui dans votre entreprise.
        </Typography>
      </Paper>

      {/* Statistiques clés */}
      <Grid container spacing={3}>
        {/* CARTE CHIFFRE D'AFFAIRES (Mise en avant - Featured) */}
        <Grid item xs={12} md={5}>
          <StatCard
            title="💰 Chiffre d'affaires Global"
            value={`${stats?.revenue || 0} €`}
            icon={<MonetizationOnIcon sx={{ fontSize: 40 }} />}
            color={theme.palette.warning.main}
            featured={true}
          />
        </Grid>

        {/* Autres KPI */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="👥 Base Clients"
                value={stats?.clientCount || 0}
                icon={<PeopleIcon />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="📝 Contrats Signés"
                value={stats?.contractCount || 0}
                icon={<DescriptionIcon />}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="🚀 Croissance"
                value="+15%"
                icon={<TrendingUpIcon />}
                color={theme.palette.info.main}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Graphique */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Évolution des contrats
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={stats?.contractsHistory || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="contracts"
                stroke={theme.palette.primary.main}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Activités récentes */}
      <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
          📋 Activités Récentes
        </Typography>
        {activities.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Heure</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Responsable</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Détails</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((act, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {new Date(act.timestamp).toLocaleDateString('fr-FR')} - {new Date(act.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{act.type}</TableCell>
                    <TableCell>{act.user || 'Système'}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: act.status === 'terminé' ? `${theme.palette.success.light}20` : act.status === 'en cours' ? `${theme.palette.warning.light}20` : `${theme.palette.error.light}20`,
                          color: act.status === 'terminé' ? 'success.main' : act.status === 'en cours' ? 'warning.main' : 'error.main',
                        }}
                      >
                        {act.status || 'terminé'}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{act.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <Typography>Aucune activité récente</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
