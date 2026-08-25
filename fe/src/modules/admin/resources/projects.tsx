import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectFormSchema } from "../../../schemas/project.schema";
import { Box, Divider, Typography } from "@mui/material";
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
import { ImportEmptyState, ListActions } from "../components/ImportButton";
import { SlugInput } from "../components/SlugInput";

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
  <TextInput key="search" source="search" label="Search title, partner, funding" alwaysOn />,
  <SelectInput key="status" source="status" choices={statusChoices} emptyText="All Statuses" />,
  <SelectInput key="visibility" source="visibility" choices={visibilityChoices} emptyText="All Visibilities" />,
  <ReferenceInput
    key="tag"
    source="tag_id"
    reference="research/tags"
    sort={{ field: "name", order: "ASC" }}
    perPage={1000}
  >
    <AutocompleteInput optionText="name" label="Research Tag" emptyText="All Tags" />
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
      <SectionTitle title="1. Project Overview" />
      {editing ? <TextInput source="id" label="ID" disabled /> : null}
      <TextInput source="title" label="Title" required />
      <SlugInput source="slug" sourceToWatch="title" label="Slug" helperText="Unique URL slug (click Auto-Slug to fill)." />
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

      <SectionTitle title="2. Timeline & Funding" />
      <NumberInput source="start_year" label="Start Year" min={1900} max={2200} placeholder="e.g. 2024" />
      <NumberInput source="end_year" label="End Year" min={1900} max={2200} placeholder="e.g. 2025 (leave empty if ongoing)" />
      <TextInput source="partner_names" label="Partner Names" placeholder="e.g. PT Telkom Indonesia, DIKTI" />
      <TextInput source="funding_source" label="Funding Source" placeholder="e.g. RKAT DTETI 2024" />

      <SectionTitle title="3. Team & Research Topics" />
      <ReferenceInput
        source="lead_lecturer_id"
        reference="lecturers"
        sort={{ field: "full_name", order: "ASC" }}
        perPage={1000}
      >
        <AutocompleteInput
          optionText="full_name"
          label="Lead Lecturer"
          helperText="Select lead lecturer."
        />
      </ReferenceInput>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <ReferenceArrayInput
          source="participant_ids"
          reference="lecturers"
          sort={{ field: "full_name", order: "ASC" }}
          perPage={1000}
        >
          <AutocompleteArrayInput
            optionText="full_name"
            label="Project Participants"
            helperText="Select participating lecturers."
          />
        </ReferenceArrayInput>
      </Box>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <ReferenceArrayInput
          source="tag_ids"
          reference="research/tags"
          sort={{ field: "name", order: "ASC" }}
          perPage={1000}
        >
          <AutocompleteArrayInput
            optionText="name"
            label="Research Tags"
            helperText="Select research tags."
          />
        </ReferenceArrayInput>
      </Box>

      <SectionTitle title="4. Description" />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="description" label="Description" multiline rows={6} fullWidth />
      </Box>
    </Box>
  );
}

export const ProjectList: React.FC = () => (
  <List
    filters={projectFilters}
    actions={<ListActions resource="projects" />}
    empty={<ImportEmptyState resource="projects" label="Projects" />}
    sort={{ field: "created_at", order: "DESC" }}
  >
    <Datagrid rowClick="edit">
      <TextField
        source="title"
        label="Title"
        sx={{ fontWeight: 700, maxW: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      />
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
    <SimpleForm resolver={zodResolver(projectFormSchema)}>
      <ProjectFormFields />
    </SimpleForm>
  </Create>
);

export const ProjectEdit: React.FC = () => (
  <Edit>
    <SimpleForm resolver={zodResolver(projectFormSchema)}>
      <ProjectFormFields editing />
    </SimpleForm>
  </Edit>
);

