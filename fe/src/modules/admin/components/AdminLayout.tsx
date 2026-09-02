import type { ComponentProps } from "react";
import { AppBar, Layout, Menu, Sidebar } from "react-admin";
import { Box, Typography } from "@mui/material";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";

function CustomAppBar() {
  return (
    <AppBar
      sx={{
        bgcolor: "#255b88",
        color: "#fff",
        borderBottom: "3px solid #e3b23c",
        "& .RaAppBar-title": {
          fontWeight: 750,
          letterSpacing: "-0.01em",
          color: "#fff",
        },
        "& .MuiIconButton-root": {
          color: "#fff",
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

function FixedAdminSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      {...props}
      sx={{
        "& .RaSidebar-fixed": {
          top: { sm: "3rem" },
          bottom: 0,
          height: { sm: "calc(100vh - 3rem)" },
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
        },
        "& .RaSidebar-paper": {
          bgcolor: "background.paper",
        },
      }}
    />
  );
}

export function AdminLayout(props: ComponentProps<typeof Layout>) {
  return (
    <Layout
      {...props}
      appBarAlwaysOn
      appBar={CustomAppBar}
      menu={AdminMenu}
      sidebar={FixedAdminSidebar}
      sx={{
        "& .RaLayout-content": {
          minWidth: 0,
          p: { xs: 1.5, sm: 3 },
          bgcolor: "#f5f7f9",
          overflowX: "auto",
        },
        "& .RaDatagrid-rowCell": {
          maxWidth: 360,
        },
        "& .RaDatagrid-rowCell > .MuiTypography-root, & .RaDatagrid-rowCell > .MuiLink-root:not(.MuiButtonBase-root)": {
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }}
    />
  );
}

