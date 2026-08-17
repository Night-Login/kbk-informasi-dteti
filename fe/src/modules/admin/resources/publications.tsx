import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import {
  AutocompleteArrayInput,
  AutocompleteInput,
  Create,
  Datagrid,
  DateInput,
  DeleteButton,
  Edit,
  EditButton,
  List,
  NumberField,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";
import { ListActions } from "../components/ImportButton";
import { SlugInput } from "../components/SlugInput";

const verifiedChoices = [
  { id: "NEEDS_REVIEW", name: "Needs Review" },
  { id: "VERIFIED", name: "Verified" },
  { id: "REJECTED", name: "Rejected" },
];

const sourceChoices = [
  { id: "OPENALEX", name: "OpenAlex" },
  { id: "MANUAL", name: "Manual" },
  { id: "SCOPUS", name: "Scopus" },
  { id: "GOOGLE_SCHOLAR", name: "Google Scholar" },
];

const publicationFilters = [
  <TextInput key="search" source="search" label="Search title, author, venue, DOI" alwaysOn />,
  <NumberInput key="year" source="year" label="Year" />,
  <SelectInput
    key="status"
    source="verified_status"
    label="Review Status"
    choices={verifiedChoices}
    emptyText="All Review Statuses"
  />,
  <SelectInput key="source" source="source" choices={sourceChoices} emptyText="All Sources" />,
  <ReferenceInput
    key="lecturer"
    source="lecturer_id"
    reference="lecturers"
    sort={{ field: "full_name", order: "ASC" }}
    perPage={1000}
  >
    <AutocompleteInput optionText="full_name" label="Lecturer" emptyText="All Lecturers" />
  </ReferenceInput>,
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

function PublicationFormFields({ editing = false }: { editing?: boolean }) {
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
      <SectionTitle title="1. Publication Overview" />
      {editing ? <TextInput source="id" label="ID" disabled /> : null}
      <TextInput source="title" label="Title" required />
      <SlugInput source="slug" sourceToWatch="title" label="Slug" helperText="Unique URL slug (click Auto-Slug to fill)." />
      <NumberInput source="year" label="Year" required min={1900} max={2200} defaultValue={new Date().getFullYear()} />
      <DateInput source="publication_date" label="Publication Date" />
      <TextInput source="venue" label="Venue" placeholder="e.g. IEEE Access / Conference Name" />
      <TextInput source="publication_type" label="Publication Type" placeholder="e.g. Journal / Conference / Book Chapter" />

      <SectionTitle title="2. Identifiers & Review Status" />
      <TextInput source="doi" label="DOI" placeholder="e.g. 10.1109/ACCESS.2024.123456" />
      <TextInput source="url" label="Publication URL" type="url" placeholder="https://..." />
      <NumberInput source="citation_count" label="Citation Count" defaultValue={0} min={0} />
      <SelectInput
        source="source"
        label="Source"
        choices={sourceChoices}
        defaultValue="MANUAL"
      />
      <SelectInput
        source="verified_status"
        label="Review Status"
        choices={verifiedChoices}
        defaultValue="VERIFIED"
      />

      <SectionTitle title="3. Authors & Abstract" />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <ReferenceArrayInput
          source="lecturer_ids"
          reference="lecturers"
          sort={{ field: "full_name", order: "ASC" }}
          perPage={1000}
        >
          <AutocompleteArrayInput
            optionText="full_name"
            label="Lecturer Authors"
            helperText="Selection order represents author order."
          />
        </ReferenceArrayInput>
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="authors_text" label="All Authors (display text)" multiline rows={2} fullWidth placeholder="e.g. Budi Santoso, Ani Wijaya, John Doe" />
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="abstract" label="Abstract" multiline rows={6} fullWidth />
      </Box>
    </Box>
  );
}

export const PublicationList: React.FC = () => (
  <List
    filters={publicationFilters}
    actions={<ListActions resource="publications" />}
    sort={{ field: "year", order: "DESC" }}
  >
    <Datagrid rowClick="edit">
      <TextField
        source="title"
        label="Title"
        sx={{ fontWeight: 700, maxW: 280, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      />
      <NumberField source="year" label="Year" />
      <TextField
        source="venue"
        label="Venue"
        sx={{ maxW: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      />
      <TextField source="publication_type" label="Type" />
      <TextField
        source="doi"
        label="DOI"
        sx={{ maxW: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      />
      <NumberField source="citation_count" label="Citations" />
      <TextField source="source" label="Source" />
      <TextField source="verified_status" label="Status" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const PublicationCreate: React.FC = () => (
  <Create redirect="list">
    <SimpleForm>
      <PublicationFormFields />
    </SimpleForm>
  </Create>
);

export const PublicationEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <PublicationFormFields editing />
    </SimpleForm>
  </Edit>
);

