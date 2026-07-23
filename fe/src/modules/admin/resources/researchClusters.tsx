import React from "react";
import { Box } from "@mui/material";
import {
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  List,
  NumberField,
  NumberInput,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";
import { ListActions } from "../components/ImportButton";

const clusterFilters = [
  <TextInput key="search" source="search" label="Search" alwaysOn />,
];

function ClusterFormFields({ editing = false }: { editing?: boolean }) {
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
      <TextInput source="name" label="Cluster Name" required />
      <TextInput source="slug" label="Slug" required />
      <NumberInput source="sort_order" label="Display Order" defaultValue={0} />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="description" label="Description" multiline rows={6} fullWidth />
      </Box>
    </Box>
  );
}

export const ResearchClusterList: React.FC = () => (
  <List
    filters={clusterFilters}
    actions={<ListActions resource="research/clusters" />}
    sort={{ field: "sort_order", order: "ASC" }}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="Cluster Name" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Description" />
      <NumberField source="sort_order" label="Display Order" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ResearchClusterCreate: React.FC = () => (
  <Create redirect="list">
    <SimpleForm>
      <ClusterFormFields />
    </SimpleForm>
  </Create>
);

export const ResearchClusterEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <ClusterFormFields editing />
    </SimpleForm>
  </Edit>
);
