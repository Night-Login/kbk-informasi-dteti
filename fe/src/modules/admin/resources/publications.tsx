import React from "react";
import { Box } from "@mui/material";
import {
  AutocompleteArrayInput,
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
  AutocompleteInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";
import { ListActions } from "../components/ImportButton";

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
  <TextInput key="search" source="search" label="Search" alwaysOn />,
  <NumberInput key="year" source="year" label="Year" />,
  <SelectInput
    key="status"
    source="verified_status"
    label="Review Status"
    choices={verifiedChoices}
  />,
  <SelectInput key="source" source="source" choices={sourceChoices} />,
  <ReferenceInput
    key="lecturer"
    source="lecturer_id"
    reference="lecturers"
    sort={{ field: "full_name", order: "ASC" }}
  >
    <AutocompleteInput optionText="full_name" label="Lecturer" />
  </ReferenceInput>,
];

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
      {editing ? <TextInput source="id" label="ID" disabled /> : null}
      <TextInput source="title" label="Title" required />
      <TextInput source="slug" label="Slug" required />
      <NumberInput source="year" label="Year" required min={1900} max={2200} />
      <DateInput source="publication_date" label="Publication Date" />
      <TextInput source="venue" label="Venue" />
      <TextInput source="publication_type" label="Publication Type" />
      <TextInput source="doi" label="DOI" />
      <TextInput source="url" label="Publication URL" type="url" />
      <NumberInput source="citation_count" label="Citation Count" defaultValue={0} min={0} />
      <SelectInput
        source="source"
        label="Source"
        choices={sourceChoices}
        defaultValue="OPENALEX"
      />
      <SelectInput
        source="verified_status"
        label="Review Status"
        choices={verifiedChoices}
        defaultValue="NEEDS_REVIEW"
      />

      <Box sx={{ gridColumn: "1 / -1" }}>
        <ReferenceArrayInput
          source="lecturer_ids"
          reference="lecturers"
          sort={{ field: "full_name", order: "ASC" }}
          perPage={250}
        >
          <AutocompleteArrayInput
            optionText="full_name"
            label="Lecturer Authors"
            helperText="Selection order becomes the author order."
          />
        </ReferenceArrayInput>
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="authors_text" label="All Authors (display text)" multiline rows={3} fullWidth />
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="abstract" label="Abstract" multiline rows={8} fullWidth />
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
