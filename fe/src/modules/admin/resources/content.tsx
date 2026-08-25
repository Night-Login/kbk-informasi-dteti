import { Box, Stack, Typography } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import type { ReactNode } from "react";
import {
  AutocompleteInput,
  BooleanField,
  BooleanInput,
  Create,
  CreateButton,
  Datagrid,
  DateField,
  DateTimeInput,
  DeleteButton,
  Edit,
  EditButton,
  ExportButton,
  FileInput,
  FormDataConsumer,
  ImageField,
  List,
  NumberField,
  NumberInput,
  ReferenceInput,
  SelectField,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  TopToolbar,
  UrlField,
  required,
} from "react-admin";
import { SlugInput } from "../components/SlugInput";

const fieldTypeChoices = [
  { id: "TEXT", name: "Text" },
  { id: "MULTILINE", name: "Long text" },
  { id: "URL", name: "Website link" },
  { id: "IMAGE", name: "Image" },
];

const publicationFilters = [
  <TextInput key="search" source="search" label="Search" alwaysOn />,
  <BooleanInput key="published" source="is_published" label="Published" />,
];

const imageAcceptance = {
  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
};

function ContentActions() {
  return (
    <TopToolbar>
      <ExportButton />
      <CreateButton />
    </TopToolbar>
  );
}

function ContentEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Box
      sx={{
        maxWidth: 560,
        mx: "auto",
        mt: 6,
        p: { xs: 3, sm: 5 },
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <CollectionsIcon sx={{ mb: 2, fontSize: 42, color: "primary.main" }} />
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        {description}
      </Typography>
      <CreateButton variant="contained" />
    </Box>
  );
}

function FormSection({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Box sx={{ gridColumn: "1 / -1", pt: 1, pb: 0.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "primary.dark" }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      ) : null}
    </Box>
  );
}

function ContentFormLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1120,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2,
        "& .MuiFormControl-root": { width: "100%" },
      }}
    >
      {children}
    </Box>
  );
}

function ImageControls({ editing = false }: { editing?: boolean }) {
  return (
    <>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <ReferenceInput
          source="media_id"
          reference="content/media"
          sort={{ field: "created_at", order: "DESC" }}
          perPage={100}
        >
          <AutocompleteInput
            optionText="title"
            label="Choose existing image from media library"
            helperText="Select an existing image or upload a new file below."
          />
        </ReferenceInput>
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <FileInput
          source="image"
          label="Upload a new image"
          accept={imageAcceptance}
          maxSize={10_000_000}
          helperText="PNG, JPG, WebP, or GIF, up to 10 MB. New uploads are also added to the media library."
        >
          <ImageField source="src" title="title" />
        </FileInput>
        {editing ? (
          <ImageField
            source="image_preview"
            label="Current image"
            sx={{ mt: 1, "& img": { maxHeight: 160, maxWidth: "100%", borderRadius: 1 } }}
          />
        ) : null}
      </Box>
    </>
  );
}

function AcademicItemFields() {
  return (
    <ContentFormLayout>
      <FormSection
        title="Public information"
        description="Published content appears directly on the Academic page."
      />
      <TextInput source="title" label="Title" validate={required()} />
      <TextInput
        source="link_url"
        label="Information / scholarship link"
        type="url"
        validate={required()}
        helperText="Visitors open this link from the public website."
      />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="overview" label="Overview" multiline rows={3} validate={required()} />
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="information" label="Additional information" multiline rows={3} />
      </Box>
      <NumberInput source="sort_order" label="Display order" defaultValue={0} />
      <BooleanInput source="is_published" label="Published on website" defaultValue />
    </ContentFormLayout>
  );
}

export function SiteSettingList() {
  return (
    <List
      actions={<ContentActions />}
      sort={{ field: "sort_order", order: "ASC" }}
      filters={[
        <TextInput key="search" source="search" label="Search setting" alwaysOn />,
        <SelectInput key="type" source="field_type" label="Field type" choices={fieldTypeChoices} />,
      ]}
      empty={
        <ContentEmptyState
          title="No website settings yet"
          description="Add a setting to manage homepage text, images, official links, or footer information."
        />
      }
    >
      <Datagrid rowClick="edit" bulkActionButtons={false}>
        <TextField source="label" label="Setting" sx={{ fontWeight: 700 }} />
        <TextField source="key" label="Key" />
        <SelectField source="field_type" label="Type" choices={fieldTypeChoices} />
        <TextField
          source="value"
          label="Current value"
          sx={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        />
        <EditButton />
      </Datagrid>
    </List>
  );
}

function SiteSettingFields({ editing = false }: { editing?: boolean }) {
  return (
    <ContentFormLayout>
      <FormSection
        title="Website content setting"
        description="Changes are read from the database by the public website."
      />
      <TextInput source="label" label="Admin label" validate={required()} />
      <TextInput
        source="key"
        label="Setting key"
        validate={required()}
        disabled={editing}
        helperText="Use lowercase words separated by underscores."
      />
      <SelectInput
        source="field_type"
        label="Field type"
        choices={fieldTypeChoices}
        defaultValue="TEXT"
        validate={required()}
      />
      <NumberInput source="sort_order" label="Display order" defaultValue={0} />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="description" label="Admin guidance" multiline rows={2} />
      </Box>
      <FormDataConsumer>
        {({ formData }) => (
          <>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <TextInput
                source="value"
                label={formData.field_type === "IMAGE" ? "Existing image URL / path" : "Value"}
                type={formData.field_type === "URL" ? "url" : "text"}
                multiline={formData.field_type === "MULTILINE"}
                rows={formData.field_type === "MULTILINE" ? 4 : undefined}
              />
            </Box>
            {formData.field_type === "IMAGE" ? (
              <>
                <FormSection title="Manage image" />
                <ImageControls editing={editing} />
              </>
            ) : null}
          </>
        )}
      </FormDataConsumer>
    </ContentFormLayout>
  );
}

export function SiteSettingCreate() {
  return (
    <Create redirect="list">
      <SimpleForm>
        <SiteSettingFields />
      </SimpleForm>
    </Create>
  );
}

export function SiteSettingEdit() {
  return (
    <Edit>
      <SimpleForm>
        <SiteSettingFields editing />
      </SimpleForm>
    </Edit>
  );
}

export function AcademicProgramList() {
  return (
    <List
      actions={<ContentActions />}
      filters={publicationFilters}
      sort={{ field: "sort_order", order: "ASC" }}
      empty={<ContentEmptyState title="No academic programs yet" description="Add master’s or doctoral programs to publish on the Academic page." />}
    >
      <Datagrid rowClick="edit">
        <TextField source="title" label="Program" sx={{ fontWeight: 700 }} />
        <UrlField source="link_url" label="Information link" target="_blank" rel="noopener noreferrer" />
        <NumberField source="sort_order" label="Order" />
        <BooleanField source="is_published" label="Published" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}

export function AcademicProgramCreate() {
  return <Create redirect="list"><SimpleForm><AcademicItemFields /></SimpleForm></Create>;
}

export function AcademicProgramEdit() {
  return <Edit><SimpleForm><AcademicItemFields /></SimpleForm></Edit>;
}

export function ScholarshipList() {
  return (
    <List
      actions={<ContentActions />}
      filters={publicationFilters}
      sort={{ field: "sort_order", order: "ASC" }}
      empty={<ContentEmptyState title="No scholarships yet" description="Add a scholarship and its official link to publish it on the Academic page." />}
    >
      <Datagrid rowClick="edit">
        <TextField source="title" label="Scholarship" sx={{ fontWeight: 700 }} />
        <UrlField source="link_url" label="Scholarship link" target="_blank" rel="noopener noreferrer" />
        <NumberField source="sort_order" label="Order" />
        <BooleanField source="is_published" label="Published" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}

export function ScholarshipCreate() {
  return <Create redirect="list"><SimpleForm><AcademicItemFields /></SimpleForm></Create>;
}

export function ScholarshipEdit() {
  return <Edit><SimpleForm><AcademicItemFields /></SimpleForm></Edit>;
}

function NewsFields({ editing = false }: { editing?: boolean }) {
  return (
    <ContentFormLayout>
      <FormSection title="News article" description="Published articles are displayed on the homepage." />
      <TextInput source="title" label="Headline" validate={required()} />
      <SlugInput source="slug" sourceToWatch="title" label="URL slug" />
      <TextInput
        source="link_url"
        label="Article link"
        type="url"
        helperText="Optional external article or full news page URL."
      />
      <DateTimeInput source="published_at" label="Publication date" />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="excerpt" label="Homepage summary" multiline rows={4} validate={required()} />
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="body" label="Full article text" multiline rows={8} />
      </Box>
      <BooleanInput source="is_published" label="Published on website" defaultValue />
      <FormSection title="Article image" />
      <ImageControls editing={editing} />
    </ContentFormLayout>
  );
}

export function NewsList() {
  return (
    <List
      actions={<ContentActions />}
      filters={publicationFilters}
      sort={{ field: "published_at", order: "DESC" }}
      empty={<ContentEmptyState title="No news articles yet" description="Create an article, upload its image, and publish it on the homepage." />}
    >
      <Datagrid rowClick="edit">
        <ImageField source="image_preview" label="Image" sx={{ "& img": { maxHeight: 48, borderRadius: 1 } }} />
        <TextField source="title" label="Headline" sx={{ fontWeight: 700 }} />
        <DateField source="published_at" label="Published on" showTime />
        <BooleanField source="is_published" label="Published" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}

export function NewsCreate() {
  return (
    <Create redirect="list">
      <SimpleForm defaultValues={{ published_at: new Date().toISOString(), is_published: true }}>
        <NewsFields />
      </SimpleForm>
    </Create>
  );
}

export function NewsEdit() {
  return <Edit><SimpleForm><NewsFields editing /></SimpleForm></Edit>;
}

function EventFields() {
  return (
    <ContentFormLayout>
      <FormSection title="Event details" description="Published events appear in the homepage agenda." />
      <TextInput source="title" label="Event title" validate={required()} />
      <SlugInput source="slug" sourceToWatch="title" label="URL slug" />
      <DateTimeInput source="starts_at" label="Start date and time" validate={required()} />
      <DateTimeInput source="ends_at" label="End date and time" />
      <TextInput source="location" label="Location / meeting platform" validate={required()} />
      <TextInput source="link_url" label="Event / registration link" type="url" />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <TextInput source="description" label="Event description" multiline rows={5} />
      </Box>
      <BooleanInput source="is_published" label="Published on website" defaultValue />
    </ContentFormLayout>
  );
}

export function EventList() {
  return (
    <List
      actions={<ContentActions />}
      filters={publicationFilters}
      sort={{ field: "starts_at", order: "ASC" }}
      empty={<ContentEmptyState title="No events scheduled" description="Add a seminar, discussion, workshop, or other academic event." />}
    >
      <Datagrid rowClick="edit">
        <TextField source="title" label="Event" sx={{ fontWeight: 700 }} />
        <DateField source="starts_at" label="Starts" showTime />
        <TextField source="location" label="Location" />
        <BooleanField source="is_published" label="Published" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}

export function EventCreate() {
  return <Create redirect="list"><SimpleForm><EventFields /></SimpleForm></Create>;
}

export function EventEdit() {
  return <Edit><SimpleForm><EventFields /></SimpleForm></Edit>;
}

function MediaFields({ editing = false }: { editing?: boolean }) {
  return (
    <ContentFormLayout>
      <FormSection
        title="Media library image"
        description="Upload images once and reuse them in homepage settings or news articles."
      />
      <TextInput source="title" label="Image title" validate={required()} />
      <TextInput source="alt_text" label="Accessible image description" />
      <Box sx={{ gridColumn: "1 / -1" }}>
        <FileInput
          source="image"
          label={editing ? "Replace image" : "Upload image"}
          accept={imageAcceptance}
          maxSize={10_000_000}
          validate={editing ? undefined : required()}
          helperText="PNG, JPG, WebP, or GIF, up to 10 MB."
        >
          <ImageField source="src" title="title" />
        </FileInput>
        {editing ? (
          <ImageField
            source="image_preview"
            label="Current image"
            sx={{ mt: 1, "& img": { maxHeight: 240, maxWidth: "100%", borderRadius: 1 } }}
          />
        ) : null}
      </Box>
      {editing ? (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ gridColumn: "1 / -1" }}>
          <TextInput source="file_name" label="Filename" disabled />
          <TextInput source="mime_type" label="File type" disabled />
          <NumberInput source="file_size" label="File size (bytes)" disabled />
        </Stack>
      ) : null}
    </ContentFormLayout>
  );
}

export function MediaList() {
  return (
    <List
      actions={<ContentActions />}
      filters={[<TextInput key="search" source="search" label="Search image" alwaysOn />]}
      sort={{ field: "created_at", order: "DESC" }}
      empty={<ContentEmptyState title="Your media library is empty" description="Upload an image to use it in the homepage hero, website settings, or news articles." />}
    >
      <Datagrid rowClick="edit">
        <ImageField source="image_preview" label="Preview" sx={{ "& img": { maxHeight: 64, borderRadius: 1 } }} />
        <TextField source="title" label="Title" sx={{ fontWeight: 700 }} />
        <TextField source="alt_text" label="Image description" />
        <TextField source="file_name" label="Filename" />
        <DateField source="created_at" label="Uploaded" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}

export function MediaCreate() {
  return <Create redirect="list"><SimpleForm><MediaFields /></SimpleForm></Create>;
}

export function MediaEdit() {
  return <Edit><SimpleForm><MediaFields editing /></SimpleForm></Edit>;
}
