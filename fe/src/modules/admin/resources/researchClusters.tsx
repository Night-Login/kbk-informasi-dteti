import React from "react";
import { Box } from "@mui/material";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
} from "react-admin";

export const ResearchClusterList: React.FC = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Cluster Name" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Description" />
      <NumberField source="sort_order" label="Sort Order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ResearchClusterCreate: React.FC = () => (
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
        <TextInput source="name" label="Cluster Name" required />
        <TextInput source="slug" label="Slug" required />
        <NumberInput source="sort_order" label="Sort Order" defaultValue={0} />
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="description" label="Description" multiline fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  </Create>
);

export const ResearchClusterEdit: React.FC = () => (
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
        <TextInput source="name" label="Cluster Name" required />
        <TextInput source="slug" label="Slug" required />
        <NumberInput source="sort_order" label="Sort Order" />
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="description" label="Description" multiline fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  </Edit>
);
