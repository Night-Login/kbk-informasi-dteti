import React from "react";
import { Box } from "@mui/material";
import {
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  FileInput,
  ImageField,
  List,
  NumberField,
  NumberInput,
  AutocompleteInput,
  ReferenceInput,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";
import { ImportEmptyState, ListActions } from "../components/ImportButton";
import { SlugInput } from "../components/SlugInput";

const imageAcceptance = {
  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
};

const clusterFilters = [
  <TextInput key="search" source="search" label="Search cluster name" alwaysOn />,
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
      <SlugInput source="slug" sourceToWatch="name" label="Slug" helperText="Unique URL slug (click Auto-Slug to fill)." />
      <NumberInput source="sort_order" label="Display Order" defaultValue={0} />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <ReferenceInput
          source="media_id"
          reference="content/media"
          sort={{ field: "created_at", order: "DESC" }}
          perPage={100}
        >
          <AutocompleteInput
            optionText="title"
            label="Choose image from media library"
            helperText="Select an existing image, or upload a new file below."
          />
        </ReferenceInput>
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <FileInput
          source="image"
          label="Upload cluster image"
          accept={imageAcceptance}
          maxSize={10_000_000}
          helperText="Shown on the homepage research card. PNG, JPG, WebP, or GIF up to 10 MB."
        >
          <ImageField source="src" title="title" />
        </FileInput>
        {editing ? (
          <ImageField
            source="image_preview"
            label="Current cluster image"
            sx={{ mt: 1, "& img": { width: 240, height: 135, objectFit: "cover", borderRadius: 1 } }}
          />
        ) : null}
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="description" label="Description" multiline rows={5} fullWidth />
      </Box>
    </Box>
  );
}

export const ResearchClusterList: React.FC = () => (
  <List
    filters={clusterFilters}
    actions={<ListActions resource="research/clusters" />}
    empty={<ImportEmptyState resource="research/clusters" label="Research clusters" />}
    sort={{ field: "sort_order", order: "ASC" }}
  >
    <Datagrid rowClick="edit">
      <ImageField
        source="image_preview"
        label="Image"
        sx={{ "& img": { width: 72, height: 44, objectFit: "cover", borderRadius: 1 } }}
      />
      <TextField source="name" label="Cluster Name" sx={{ fontWeight: 700 }} />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Description" sx={{ maxW: 350, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} />
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

