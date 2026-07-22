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

const verifiedChoices = [
  { id: "NEEDS_REVIEW", name: "NEEDS_REVIEW" },
  { id: "VERIFIED", name: "VERIFIED" },
  { id: "REJECTED", name: "REJECTED" },
];

const sourceChoices = [
  { id: "OPENALEX", name: "OPENALEX" },
  { id: "MANUAL", name: "MANUAL" },
  { id: "SCOPUS", name: "SCOPUS" },
  { id: "GOOGLE_SCHOLAR", name: "GOOGLE_SCHOLAR" },
];

export const PublicationList: React.FC = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="title" label="Title" />
      <NumberField source="year" label="Year" />
      <TextField source="venue" label="Venue" />
      <TextField source="publication_type" label="Type" />
      <TextField source="doi" label="DOI" />
      <NumberField source="citation_count" label="Citations" />
      <TextField source="source" label="Source" />
      <TextField source="verified_status" label="Status" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const PublicationCreate: React.FC = () => (
  <Create>
    <SimpleForm>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 2,
          width: "100%",
          "& .MuiFormControl-root": { width: "100%" },
        }}
      >
        <TextInput source="title" label="Title" required />
        <TextInput source="slug" label="Slug" required />
        <NumberInput source="year" label="Year" required />
        <TextInput source="publication_date" label="Publication Date (YYYY-MM-DD)" />
        <TextInput source="venue" label="Venue" />
        <TextInput source="publication_type" label="Publication Type" />
        <TextInput source="doi" label="DOI" />
        <TextInput source="url" label="URL" />
        <NumberInput source="citation_count" label="Citation Count" defaultValue={0} />
        <SelectInput source="source" label="Source" choices={sourceChoices} defaultValue="OPENALEX" />
        <SelectInput source="verified_status" label="Verified Status" choices={verifiedChoices} defaultValue="NEEDS_REVIEW" />
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="authors_text" label="Authors" multiline fullWidth />
        </Box>
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="abstract" label="Abstract" multiline fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  </Create>
);

export const PublicationEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 2,
          width: "100%",
          "& .MuiFormControl-root": { width: "100%" },
        }}
      >
        <TextInput source="id" label="ID" disabled />
        <TextInput source="title" label="Title" required />
        <TextInput source="slug" label="Slug" required />
        <NumberInput source="year" label="Year" required />
        <TextInput source="publication_date" label="Publication Date (YYYY-MM-DD)" />
        <TextInput source="venue" label="Venue" />
        <TextInput source="publication_type" label="Publication Type" />
        <TextInput source="doi" label="DOI" />
        <TextInput source="url" label="URL" />
        <NumberInput source="citation_count" label="Citation Count" />
        <SelectInput source="source" label="Source" choices={sourceChoices} />
        <SelectInput source="verified_status" label="Verified Status" choices={verifiedChoices} />
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="authors_text" label="Authors" multiline fullWidth />
        </Box>
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="abstract" label="Abstract" multiline fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  </Edit>
);
