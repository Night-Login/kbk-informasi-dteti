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
      <Box sx={{ px: 3, pt: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h5" color="primary.dark" align="center">
          KBK Informasi DTETI
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }} align="justify">
          Sign in to manage lecturer, research, project, and publication data.
        </Typography>
      </Box>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", "& .MuiFormControl-root": { width: "100%", textAlign: "center" }, "& .MuiInputBase-input": { textAlign: "center" }, "& form": { width: "100%", display: "flex", flexDirection: "column", alignItems: "center" } }}>
        <LoginForm />
      </Box>
    </Login>
  );
}
