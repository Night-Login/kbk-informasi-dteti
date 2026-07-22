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
  SelectInput,
} from "react-admin";

const statusChoices = [
  { id: "PLANNED", name: "PLANNED" },
  { id: "ONGOING", name: "ONGOING" },
  { id: "COMPLETED", name: "COMPLETED" },
];

const visibilityChoices = [
  { id: "PUBLIC", name: "PUBLIC" },
  { id: "INTERNAL", name: "INTERNAL" },
  { id: "HIDDEN", name: "HIDDEN" },
];

export const ProjectList: React.FC = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="title" label="Title" />
      <TextField source="slug" label="Slug" />
      <TextField source="status" label="Status" />
      <NumberField source="start_year" label="Start Year" />
      <NumberField source="end_year" label="End Year" />
      <TextField source="funding_source" label="Funding Source" />
      <TextField source="visibility" label="Visibility" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ProjectCreate: React.FC = () => (
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
        <TextInput source="title" label="Title" required />
        <TextInput source="slug" label="Slug" required />
        <SelectInput source="status" label="Status" choices={statusChoices} defaultValue="PLANNED" />
        <SelectInput source="visibility" label="Visibility" choices={visibilityChoices} defaultValue="PUBLIC" />
        <NumberInput source="start_year" label="Start Year" />
        <NumberInput source="end_year" label="End Year" />
        <TextInput source="partner_names" label="Partner Names" />
        <TextInput source="funding_source" label="Funding Source" />
        <TextInput source="lead_lecturer_id" label="Lead Lecturer ID (UUID)" />
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="description" label="Description" multiline fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  </Create>
);

export const ProjectEdit: React.FC = () => (
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
        <TextInput source="title" label="Title" required />
        <TextInput source="slug" label="Slug" required />
        <SelectInput source="status" label="Status" choices={statusChoices} />
        <SelectInput source="visibility" label="Visibility" choices={visibilityChoices} />
        <NumberInput source="start_year" label="Start Year" />
        <NumberInput source="end_year" label="End Year" />
        <TextInput source="partner_names" label="Partner Names" />
        <TextInput source="funding_source" label="Funding Source" />
        <TextInput source="lead_lecturer_id" label="Lead Lecturer ID (UUID)" />
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="description" label="Description" multiline fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  </Edit>
);
