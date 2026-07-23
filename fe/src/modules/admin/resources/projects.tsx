import React from "react";
import { Box } from "@mui/material";
import {
  AutocompleteArrayInput,
  AutocompleteInput,
  Create,
  Datagrid,
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

const statusChoices = [
  { id: "PLANNED", name: "Planned" },
  { id: "ONGOING", name: "Ongoing" },
  { id: "COMPLETED", name: "Completed" },
];

const visibilityChoices = [
  { id: "PUBLIC", name: "Public" },
  { id: "INTERNAL", name: "Internal" },
  { id: "HIDDEN", name: "Hidden" },
];

const projectFilters = [
  <TextInput key="search" source="search" label="Search" alwaysOn />,
  <SelectInput key="status" source="status" choices={statusChoices} />,
  <SelectInput key="visibility" source="visibility" choices={visibilityChoices} />,
  <ReferenceInput
    key="tag"
    source="tag_id"
    reference="research/tags"
    sort={{ field: "name", order: "ASC" }}
  >
    <AutocompleteInput optionText="name" label="Research Tag" />
  </ReferenceInput>,
];

function ProjectFormFields({ editing = false }: { editing?: boolean }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
        width: "100%",
        "& .MuiFormControl-root": { width: "100%" },
      }}
    >
      {editing ? <TextInput source="id" label="ID" disabled /> : null}
      <TextInput source="title" label="Title" required />
      <TextInput source="slug" label="Slug" required />
      <SelectInput
        source="status"
        label="Status"
        choices={statusChoices}
        defaultValue="PLANNED"
      />
      <SelectInput
        source="visibility"
        label="Visibility"
        choices={visibilityChoices}
        defaultValue="PUBLIC"
      />
      <NumberInput source="start_year" label="Start Year" min={1900} max={2200} />
      <NumberInput source="end_year" label="End Year" min={1900} max={2200} />
      <TextInput source="partner_names" label="Partner Names" />
      <TextInput source="funding_source" label="Funding Source" />
      <ReferenceInput
        source="lead_lecturer_id"
        reference="lecturers"
        sort={{ field: "full_name", order: "ASC" }}
        perPage={250}
      >
        <AutocompleteInput
          optionText="full_name"
          label="Lead Lecturer"
          helperText="Search by lecturer name."
        />
      </ReferenceInput>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <ReferenceArrayInput
          source="participant_ids"
          reference="lecturers"
          sort={{ field: "full_name", order: "ASC" }}
          perPage={250}
        >
          <AutocompleteArrayInput optionText="full_name" label="Project Participants" />
        </ReferenceArrayInput>
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <ReferenceArrayInput
          source="tag_ids"
          reference="research/tags"
          sort={{ field: "name", order: "ASC" }}
          perPage={250}
        >
          <AutocompleteArrayInput optionText="name" label="Research Tags" />
        </ReferenceArrayInput>
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="description" label="Description" multiline rows={7} fullWidth />
      </Box>
    </Box>
  );
}

export const ProjectList: React.FC = () => (
  <List
    filters={projectFilters}
    actions={<ListActions resource="projects" />}
    sort={{ field: "created_at", order: "DESC" }}
  >
    <Datagrid rowClick="edit">
      <TextField source="title" label="Title" />
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
  <Create redirect="list">
    <SimpleForm>
      <ProjectFormFields />
    </SimpleForm>
  </Create>
);

export const ProjectEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <ProjectFormFields editing />
    </SimpleForm>
  </Edit>
);
