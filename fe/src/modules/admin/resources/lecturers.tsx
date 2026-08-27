import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { lecturerFormSchema } from "../../../schemas/lecturer.schema";
import { Box, Divider, Typography } from "@mui/material";
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
} from "react-admin";
import { TextInput } from "react-admin";
import { ImportEmptyState, ListActions } from "../components/ImportButton";
import { SlugInput } from "../components/SlugInput";

const supervisionChoices = [
  { id: "Available", name: "Available" },
  { id: "Limited", name: "Limited" },
  { id: "Unavailable", name: "Unavailable" },
];

const lecturerFilters = [
  <TextInput key="search" source="search" label="Search name, NIP, SINTA" alwaysOn />,
  <SelectInput
    key="supervision"
    source="supervision_status"
    label="Supervision"
    choices={supervisionChoices}
    emptyText="All Supervision Statuses"
  />,
  <BooleanInput key="active" source="is_active" label="Active only" />,
];

function SectionTitle({ title }: { title: string }) {
  return (
    <Box sx={{ gridColumn: "1 / -1", mt: 2, mb: 0.5 }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 800, color: "#255b88", letterSpacing: "-0.01em" }}
      >
        {title}
      </Typography>
      <Divider sx={{ mt: 0.5 }} />
    </Box>
  );
}

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
      <SectionTitle title="1. Basic Information" />
      {editing ? <TextInput source="id" label="ID" disabled /> : null}
      <TextInput source="full_name" label="Full Name" required />
      <TextInput source="academic_title" label="Academic Title" placeholder="e.g. Prof. Dr., S.T., M.Eng." />
      <SlugInput source="slug" sourceToWatch="full_name" label="Slug" helperText="Unique URL slug (click Auto-Slug to fill)." />
      <TextInput source="nip_or_staff_id" label="NIP / Staff ID" required />
      <TextInput source="email" label="Email" type="email" />
      <SelectInput
        source="supervision_status"
        label="Supervision Status"
        choices={supervisionChoices}
        defaultValue="Available"
      />
      <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
        <BooleanInput source="is_active" label="Active on public website" defaultValue />
      </Box>

      <SectionTitle title="2. Academic & Research Identifiers" />
      <TextInput source="sinta_id" label="SINTA ID" required helperText="Required for SINTA synchronization." />
      <TextInput source="scopus_author_id" label="Scopus Author ID" />
      <TextInput source="google_scholar_id" label="Google Scholar ID" />
      <TextInput source="google_scholar_url" label="Google Scholar URL" type="url" />
      <TextInput source="orcid_id" label="ORCID ID" />
      <TextInput source="openalex_author_id" label="OpenAlex Author ID" />
      <TextInput source="semantic_scholar_id" label="Semantic Scholar ID" />

      <SectionTitle title="3. Research Topics & Photo" />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <ReferenceArrayInput
          source="tag_ids"
          reference="research/tags"
          sort={{ field: "name", order: "ASC" }}
          perPage={1000}
        >
          <AutocompleteArrayInput
            label="Research Tags"
            optionText="name"
            helperText="Select research tags associated with this lecturer."
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
        {editing ? <ImageField source="photo_preview" label="Current Photo" sx={{ mt: 1, "& img": { maxHeight: 120, borderRadius: 1 } }} /> : null}
      </Box>

      <SectionTitle title="4. Biography" />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="short_bio" label="Short Bio" multiline rows={3} fullWidth />
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="bio" label="Full Biography" multiline rows={6} fullWidth />
      </Box>

      <SectionTitle title="5. Research Metrics" />
      <NumberInput source="metrics.h_index" label="H-index" min={0} />
      <NumberInput source="metrics.total_citations" label="Total Citations" min={0} />
      <NumberInput source="metrics.sinta_score" label="SINTA Score" min={0} />
      <TextInput source="metrics.source" label="Metric Source" placeholder="e.g. SINTA / Manual" />
    </Box>
  );
}

export const LecturerList: React.FC = () => (
  <List
    filters={lecturerFilters}
    actions={<ListActions resource="lecturers" />}
    empty={<ImportEmptyState resource="lecturers" label="Lecturers" />}
    sort={{ field: "full_name", order: "ASC" }}
  >
    <Datagrid rowClick="edit">
      <TextField
        source="full_name"
        label="Full Name"
        sx={{ display: "block", fontWeight: 700, maxWidth: 240, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      />
      <TextField source="academic_title" label="Title" />
      <TextField source="nip_or_staff_id" label="NIP / Staff ID" />
      <TextField source="sinta_id" label="SINTA ID" />
      <TextField
        source="email"
        label="Email"
        sx={{ display: "block", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      />
      <TextField source="supervision_status" label="Supervision" />
      <BooleanField source="is_active" label="Active" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const LecturerCreate: React.FC = () => (
  <Create redirect="list">
    <SimpleForm resolver={zodResolver(lecturerFormSchema)}>
      <LecturerFormFields />
    </SimpleForm>
  </Create>
);

export const LecturerEdit: React.FC = () => (
  <Edit>
    <SimpleForm resolver={zodResolver(lecturerFormSchema)}>
      <LecturerFormFields editing />
    </SimpleForm>
  </Edit>
);

