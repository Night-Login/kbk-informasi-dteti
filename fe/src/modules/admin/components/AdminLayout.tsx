import type { ComponentProps } from "react";
import { Layout, Menu } from "react-admin";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";

function AdminMenu() {
  return (
    <Menu>
      <Menu.DashboardItem />
      <Menu.ResourceItems />
      <Menu.Item
        to="/trash"
        primaryText="Trash & Restore"
        leftIcon={<RestoreFromTrashIcon />}
      />
    </Menu>
  );
}

export function AdminLayout(props: ComponentProps<typeof Layout>) {
  return (
    <Layout
      {...props}
      menu={AdminMenu}
      sx={{
        "& .RaLayout-content": {
          minWidth: 0,
        },
      }}
    />
  );
}
