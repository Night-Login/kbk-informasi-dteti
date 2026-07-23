import { Login, LoginForm } from "react-admin";
import { Box, Typography } from "@mui/material";

export function AdminLogin() {
  return (
    <Login
      backgroundImage="/images/hero-campus.jpg"
      sx={{
        "& .RaLogin-card": {
          borderRadius: 2,
          borderTop: "6px solid #e3b23c",
          boxShadow: "0 4px 8px rgba(15, 39, 61, 0.16)",
        },
      }}
    >
      <Box sx={{ px: 3, pt: 3 }}>
        <Typography variant="h5" color="primary.dark">
          KBK Informasi DTETI
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Sign in to manage lecturer, research, project, and publication data.
        </Typography>
      </Box>
      <LoginForm />
    </Login>
  );
}
