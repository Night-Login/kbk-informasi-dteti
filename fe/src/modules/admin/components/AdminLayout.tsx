import type { ComponentProps } from "react";
import { AppBar, Layout, Menu } from "react-admin";
import { Box, Typography } from "@mui/material";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";

function CustomAppBar() {
  return (
    <AppBar
      sx={{
        bgcolor: "#255b88",
        borderBottom: "3px solid #e3b23c",
        "& .RaAppBar-title": {
          fontWeight: 750,
          letterSpacing: "-0.01em",
        },
      }}
    />
  );
}

function AdminMenu() {
  return (
    <Box sx={{ width: "100%", py: 1 }}>
      <Box sx={{ px: 2, py: 1.5, mb: 1, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#255b88" }}>
          KBK INFORMASI
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
          DTETI FT UGM Admin
        </Typography>
      </Box>
      <Menu>
        <Menu.DashboardItem />
        <Menu.ResourceItems />
        <Menu.Item
          to="/trash"
          primaryText="Trash & Restore"
          leftIcon={<RestoreFromTrashIcon />}
        />
      </Menu>
    </Box>
  );
}

export function AdminLayout(props: ComponentProps<typeof Layout>) {
  return (
    <Layout
      {...props}
      appBar={CustomAppBar}
      menu={AdminMenu}
      sx={{
        "& .RaLayout-content": {
          minWidth: 0,
          p: { xs: 1.5, sm: 3 },
          bgcolor: "#f5f7f9",
          overflowX: "auto",
        },
      }}
    />
  );
}

