import React from "react";
import { Box, Typography } from "@mui/material";
import {
  AutocompleteArrayInput,
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  FileInput,
  ImageField,
  List,
  NumberInput,
  ReferenceArrayInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";
import { ListActions } from "../components/ImportButton";

const supervisionChoices = [
  { id: "Available", name: "Available" },
  { id: "Limited", name: "Limited" },
  { id: "Unavailable", name: "Unavailable" },
];

const lecturerFilters = [
  <TextInput key="search" source="search" label="Search" alwaysOn />,
  <SelectInput
    key="supervision"
    source="supervision_status"
    label="Supervision"
    choices={supervisionChoices}
  />,
  <BooleanInput key="active" source="is_active" label="Active only" />,
];

function LecturerFormFields({ editing = false }: { editing?: boolean }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" },
        gap: 2,
        width: "100%",
        "& .MuiFormControl-root": { width: "100%" },
      }}
    >
      {editing ? <TextInput source="id" label="ID" disabled /> : null}
      <TextInput source="full_name" label="Full Name" required />
      <TextInput source="academic_title" label="Academic Title" />
      <TextInput source="slug" label="Slug" required helperText="Used in the public profile URL." />
      <TextInput source="nip_or_staff_id" label="NIP / Staff ID" required />
      <TextInput source="sinta_id" label="SINTA ID" required />
      <TextInput source="email" label="Email" type="email" />
      <TextInput source="scopus_author_id" label="Scopus Author ID" />
      <TextInput source="google_scholar_url" label="Google Scholar URL" />
      <TextInput source="google_scholar_id" label="Google Scholar ID" />
      <TextInput source="orcid_id" label="ORCID ID" />
      <TextInput source="openalex_author_id" label="OpenAlex Author ID" />
      <TextInput source="semantic_scholar_id" label="Semantic Scholar ID" />
      <SelectInput
        source="supervision_status"
        label="Supervision Status"
        choices={supervisionChoices}
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <BooleanInput source="is_active" label="Active on public website" defaultValue />
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <ReferenceArrayInput
          source="tag_ids"
          reference="research/tags"
          sort={{ field: "name", order: "ASC" }}
          perPage={250}
        >
          <AutocompleteArrayInput
            label="Research Tags"
            optionText="name"
            helperText="The first selected tag is stored as the primary topic."
          />
        </ReferenceArrayInput>
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <FileInput
          source="photo"
          label="Profile Photo"
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
          maxSize={5_000_000}
          helperText="PNG, JPG, or WebP up to 5 MB."
        >
          <ImageField source="src" title="title" />
        </FileInput>
        {editing ? <ImageField source="photo_preview" label="Current Photo" /> : null}
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="short_bio" label="Short Bio" multiline rows={3} fullWidth />
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="bio" label="Full Biography" multiline rows={8} fullWidth />
      </Box>

      <Typography variant="h6" sx={{ gridColumn: "1 / -1", mt: 1 }}>
        Research Metrics
      </Typography>
      <NumberInput source="metrics.h_index" label="H-index" min={0} />
      <NumberInput source="metrics.total_citations" label="Total Citations" min={0} />
      <NumberInput source="metrics.sinta_score" label="SINTA Score" min={0} />
      <TextInput source="metrics.source" label="Metric Source" />
    </Box>
  );
}

export const LecturerList: React.FC = () => (
  <List
    filters={lecturerFilters}
    actions={<ListActions resource="lecturers" />}
    sort={{ field: "full_name", order: "ASC" }}
  >
    <Datagrid rowClick="edit">
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
  <Create redirect="list">
    <SimpleForm>
      <LecturerFormFields />
    </SimpleForm>
  </Create>
);

export const LecturerEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <LecturerFormFields editing />
    </SimpleForm>
  </Edit>
);
