import React from "react";
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
} from "react-admin";

const roleChoices = [
  { id: "ADMIN", name: "ADMIN" },
  { id: "SUPERADMIN", name: "SUPERADMIN" },
];

export const AdminList: React.FC = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="username" label="Username" />
      <TextField source="role" label="Role" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const AdminCreate: React.FC = () => (
  <Create>
    <SimpleForm>
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
        <TextInput source="password" label="Password" type="password" required />
        <SelectInput source="role" label="Role" choices={roleChoices} defaultValue="ADMIN" />
      </Box>
    </SimpleForm>
  </Create>
);

export const AdminEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
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
        <TextInput source="password" label="New Password (Optional)" type="password" />
        <SelectInput source="role" label="Role" choices={roleChoices} />
      </Box>
    </SimpleForm>
  </Edit>
);
