import { useState } from "react";
import {
  Title,
  useDataProvider,
  useGetList,
  useNotify,
} from "react-admin";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import type { AdminDataProvider } from "../dataProvider";

const trashResources = [
  { resource: "lecturers", label: "Lecturers" },
  { resource: "projects", label: "Projects" },
  { resource: "publications", label: "Publications" },
  { resource: "research/clusters", label: "Research Clusters" },
  { resource: "research/tags", label: "Research Tags" },
  { resource: "admins", label: "Admins" },
] as const;

function recordName(record: Record<string, unknown>): string {
  return String(
    record.full_name ||
      record.title ||
      record.name ||
      record.username ||
      record.id,
  );
}

export function TrashPage() {
  const [active, setActive] = useState(0);
  const selected = trashResources[active];
  const dataProvider = useDataProvider<AdminDataProvider>();
  const notify = useNotify();
  const { data, isPending, error, refetch } = useGetList(
    `trash/${selected.resource}`,
    {
      pagination: { page: 1, perPage: 250 },
      sort: { field: "deleted_at", order: "DESC" },
      filter: {},
    },
  );

  async function restore(id: string | number) {
    try {
      await dataProvider.restore(selected.resource, id);
      notify("Record restored successfully.", { type: "success" });
      await refetch();
    } catch (restoreError) {
      notify(
        restoreError instanceof Error ? restoreError.message : "Restore failed.",
        { type: "error" },
      );
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Title title="Trash & Restore" />
      <Typography variant="h4" color="primary.dark">
        Trash & Restore
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
        Deleted records remain recoverable. Restoring a record makes it available to the
        public API again.
      </Typography>

      <Tabs
        value={active}
        onChange={(_, value) => setActive(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mt: 3, borderBottom: 1, borderColor: "divider" }}
      >
        {trashResources.map((item) => (
          <Tab key={item.resource} label={item.label} />
        ))}
      </Tabs>

      {isPending ? (
        <Box sx={{ minHeight: 240, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error.message}
        </Alert>
      ) : data && data.length > 0 ? (
        <TableContainer sx={{ mt: 3, bgcolor: "background.paper", border: 1, borderColor: "divider" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Deleted at</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((record) => (
                <TableRow key={record.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{recordName(record)}</TableCell>
                  <TableCell>{String(record.id)}</TableCell>
                  <TableCell>
                    {record.deleted_at || record.deletedAt
                      ? new Date(record.deleted_at || record.deletedAt).toLocaleString("id-ID")
                      : "—"}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      startIcon={<RestoreIcon />}
                      onClick={() => restore(record.id)}
                      variant="contained"
                      size="small"
                    >
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info" sx={{ mt: 3 }}>
          No deleted {selected.label.toLowerCase()}.
        </Alert>
      )}
    </Box>
  );
}
