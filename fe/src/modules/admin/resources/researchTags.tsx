import React from "react";
import { Box } from "@mui/material";
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
} from "react-admin";

export const ResearchTagList: React.FC = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Tag Name" />
      <TextField source="slug" label="Slug" />
      <TextField source="cluster_id" label="Cluster ID" />
      <TextField source="description" label="Description" />
      <BooleanField source="is_active" label="Active" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ResearchTagCreate: React.FC = () => (
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
        <TextInput source="name" label="Tag Name" required />
        <TextInput source="slug" label="Slug" required />
        <TextInput source="cluster_id" label="Cluster ID (UUID)" required />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BooleanInput source="is_active" label="Is Active" defaultValue={true} />
        </Box>
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="description" label="Description" multiline fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  </Create>
);

export const ResearchTagEdit: React.FC = () => (
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
        <TextInput source="name" label="Tag Name" required />
        <TextInput source="slug" label="Slug" required />
        <TextInput source="cluster_id" label="Cluster ID (UUID)" required />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BooleanInput source="is_active" label="Is Active" />
        </Box>
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="description" label="Description" multiline fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  </Edit>
);
