import React from "react";
import { Box } from "@mui/material";
import {
  AutocompleteInput,
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  List,
  ReferenceInput,
  SimpleForm,
  TextField,
  TextInput,
  required,
} from "react-admin";
import { ImportEmptyState, ListActions } from "../components/ImportButton";
import { SlugInput } from "../components/SlugInput";

const tagFilters = [
  <TextInput key="search" source="search" label="Search tag name" alwaysOn />,
  <ReferenceInput
    key="cluster"
    source="cluster_id"
    reference="research/clusters"
    sort={{ field: "sort_order", order: "ASC" }}
    perPage={1000}
  >
    <AutocompleteInput optionText="name" label="Research Cluster" emptyText="All Clusters" />
  </ReferenceInput>,
  <BooleanInput key="active" source="is_active" label="Active only" />,
];

function TagFormFields({ editing = false }: { editing?: boolean }) {
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
      <TextInput source="name" label="Tag Name" required />
      <SlugInput source="slug" sourceToWatch="name" label="Slug" helperText="Unique URL slug (click Auto-Slug to fill)." />
      <ReferenceInput
        source="cluster_id"
        reference="research/clusters"
        sort={{ field: "sort_order", order: "ASC" }}
        perPage={1000}
      >
        <AutocompleteInput
          optionText="name"
          label="Research Cluster"
          validate={required()}
        />
      </ReferenceInput>
      <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
        <BooleanInput source="is_active" label="Active on public website" defaultValue />
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="description" label="Description" multiline rows={5} fullWidth />
      </Box>
    </Box>
  );
}

export const ResearchTagList: React.FC = () => (
  <List
    filters={tagFilters}
    actions={<ListActions resource="research/tags" />}
    empty={<ImportEmptyState resource="research/tags" label="Research tags" />}
    sort={{ field: "name", order: "ASC" }}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="Tag Name" sx={{ fontWeight: 700 }} />
      <TextField source="slug" label="Slug" />
      <TextField source="cluster.name" label="Cluster" />
      <TextField source="description" label="Description" sx={{ display: "block", maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} />
      <BooleanField source="is_active" label="Active" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ResearchTagCreate: React.FC = () => (
  <Create redirect="list">
    <SimpleForm>
      <TagFormFields />
    </SimpleForm>
  </Create>
);

export const ResearchTagEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <TagFormFields editing />
    </SimpleForm>
  </Edit>
);

