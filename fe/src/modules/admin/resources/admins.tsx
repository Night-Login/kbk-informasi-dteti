import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminFormSchema,
  createAdminFormSchema,
} from "../../../schemas/admin.schema";
import { Box } from "@mui/material";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  useRecordContext,
} from "react-admin";

const roleChoices = [
  { id: "ADMIN", name: "ADMIN" },
  { id: "SUPERADMIN", name: "SUPERADMIN" },
];

const adminFilters = [
  <TextInput key="search" source="search" label="Search username" alwaysOn />,
  <SelectInput key="role" source="role" label="Role" choices={roleChoices} />,
];

const AdminListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton />
  </TopToolbar>
);

const AdminDeleteButton = () => {
  const record = useRecordContext();

  if (record?.role === "SUPERADMIN") {
    return null;
  }

  return <DeleteButton />;
};

export const AdminList: React.FC = () => (
  <List
    filters={adminFilters}
    actions={<AdminListActions />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="username" label="Username" />
      <TextField source="role" label="Role" />
      <EditButton />
      <AdminDeleteButton />
    </Datagrid>
  </List>
);

export const AdminCreate: React.FC = () => (
  <Create redirect="list">
    <SimpleForm resolver={zodResolver(createAdminFormSchema)}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          width: "100%",
          "& .MuiFormControl-root": { width: "100%" },
        }}
      >
        <TextInput source="username" label="Username" required />
        <TextInput
          source="password"
          label="Password"
          type="password"
          required
        />
        <SelectInput
          source="role"
          label="Role"
          choices={roleChoices}
          defaultValue="ADMIN"
        />
      </Box>
    </SimpleForm>
  </Create>
);

export const AdminEdit: React.FC = () => (
  <Edit>
    <SimpleForm resolver={zodResolver(adminFormSchema)}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          width: "100%",
          "& .MuiFormControl-root": { width: "100%" },
        }}
      >
        <TextInput source="id" label="ID" disabled />
        <TextInput source="username" label="Username" required />
        <TextInput
          source="password"
          label="New Password (Optional)"
          type="password"
        />
        <SelectInput source="role" label="Role" choices={roleChoices} />
      </Box>
    </SimpleForm>
  </Edit>
);
