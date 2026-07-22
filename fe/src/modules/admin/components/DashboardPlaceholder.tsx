import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { Title } from "react-admin";

export const DashboardPlaceholder: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Title title="Portal Manajemen KBK Informasi DTETI" />

      <Card sx={{ p: 4, mb: 4, bgcolor: "#1E3A8A", color: "white", borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          KBK Informasi DTETI Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Portal manajemen untuk Kelompok Bidang Keahlian (KBK) Informasi DTETI FT UGM.
        </Typography>
      </Card>
    </Box>
  );
};
