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

export const LecturerList: React.FC = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID / UUID" />
      <TextField source="full_name" label="Full Name" />
      <TextField source="academic_title" label="Title" />
      <TextField source="nip_or_staff_id" label="NIP / Staff ID" />
      <TextField source="sinta_id" label="SINTA ID" />
      <TextField source="email" label="Email" />
      <TextField source="supervision_status" label="Supervision" />
      <BooleanField source="is_active" label="Active" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const LecturerCreate: React.FC = () => (
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
        <TextInput source="full_name" label="Full Name" required />
        <TextInput source="academic_title" label="Academic Title" />
        <TextInput source="slug" label="Slug" required />
        <TextInput source="nip_or_staff_id" label="NIP / Staff ID" required />
        <TextInput source="sinta_id" label="SINTA ID" required />
        <TextInput source="email" label="Email" />
        <TextInput source="scopus_author_id" label="Scopus Author ID" />
        <TextInput source="google_scholar_url" label="Google Scholar URL" />
        <TextInput source="google_scholar_id" label="Google Scholar ID" />
        <TextInput source="orcid_id" label="ORCID ID" />
        <TextInput source="openalex_author_id" label="OpenAlex Author ID" />
        <TextInput source="semantic_scholar_id" label="Semantic Scholar ID" />
        <TextInput source="supervision_status" label="Supervision Status" />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BooleanInput source="is_active" label="Is Active" defaultValue={true} />
        </Box>
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="short_bio" label="Short Bio" multiline fullWidth />
        </Box>
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="bio" label="Full Bio" multiline fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  </Create>
);

export const LecturerEdit: React.FC = () => (
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
        <TextInput source="full_name" label="Full Name" required />
        <TextInput source="academic_title" label="Academic Title" />
        <TextInput source="slug" label="Slug" required />
        <TextInput source="nip_or_staff_id" label="NIP / Staff ID" required />
        <TextInput source="sinta_id" label="SINTA ID" required />
        <TextInput source="email" label="Email" />
        <TextInput source="scopus_author_id" label="Scopus Author ID" />
        <TextInput source="google_scholar_url" label="Google Scholar URL" />
        <TextInput source="google_scholar_id" label="Google Scholar ID" />
        <TextInput source="orcid_id" label="ORCID ID" />
        <TextInput source="openalex_author_id" label="OpenAlex Author ID" />
        <TextInput source="semantic_scholar_id" label="Semantic Scholar ID" />
        <TextInput source="supervision_status" label="Supervision Status" />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BooleanInput source="is_active" label="Is Active" />
        </Box>
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="short_bio" label="Short Bio" multiline fullWidth />
        </Box>
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="bio" label="Full Bio" multiline fullWidth />
        </Box>
      </Box>
    </SimpleForm>
  </Edit>
);
