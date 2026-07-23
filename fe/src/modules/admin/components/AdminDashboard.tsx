import { useEffect, useState } from "react";
import { Title, useDataProvider, useGetIdentity } from "react-admin";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import type { AdminDataProvider } from "../dataProvider";

type DashboardStats = {
  lecturers: number;
  projects: number;
  publications: number;
  clusters: number;
  tags: number;
  admins: number;
};

const statLabels: Array<[keyof DashboardStats, string, string]> = [
  ["lecturers", "Lecturers", "/admin/lecturers"],
  ["projects", "Projects", "/admin/projects"],
  ["publications", "Publications", "/admin/publications"],
  ["clusters", "Research clusters", "/admin/research/clusters"],
  ["tags", "Research tags", "/admin/research/tags"],
  ["admins", "Administrators", "/admin/admins"],
];

export function AdminDashboard() {
  const dataProvider = useDataProvider<AdminDataProvider>();
  const { identity } = useGetIdentity();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      dataProvider.getList("lecturers", {
        pagination: { page: 1, perPage: 1 },
        sort: { field: "full_name", order: "ASC" },
        filter: {},
      }),
      dataProvider.getList("projects", {
        pagination: { page: 1, perPage: 1 },
        sort: { field: "created_at", order: "DESC" },
        filter: {},
      }),
      dataProvider.getList("publications", {
        pagination: { page: 1, perPage: 1 },
        sort: { field: "year", order: "DESC" },
        filter: {},
      }),
      dataProvider.getList("research/clusters", {
        pagination: { page: 1, perPage: 1 },
        sort: { field: "sort_order", order: "ASC" },
        filter: {},
      }),
      dataProvider.getList("research/tags", {
        pagination: { page: 1, perPage: 1 },
        sort: { field: "name", order: "ASC" },
        filter: {},
      }),
      dataProvider.getList("admins", {
        pagination: { page: 1, perPage: 1 },
        sort: { field: "createdAt", order: "DESC" },
        filter: {},
      }),
    ])
      .then(([lecturers, projects, publications, clusters, tags, admins]) => {
        setStats({
          lecturers: lecturers.total || 0,
          projects: projects.total || 0,
          publications: publications.total || 0,
          clusters: clusters.total || 0,
          tags: tags.total || 0,
          admins: admins.total || 0,
        });
      })
      .catch((dashboardError: Error) => setError(dashboardError.message));
  }, [dataProvider]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1280, mx: "auto" }}>
      <Title title="KBK Informasi Admin Dashboard" />
      <Box
        sx={{
          bgcolor: "primary.dark",
          color: "primary.contrastText",
          p: { xs: 3, md: 4 },
          borderRadius: 2,
        }}
      >
        <Typography variant="h4">
          Welcome{identity?.fullName ? `, ${identity.fullName}` : ""}
        </Typography>
        <Typography sx={{ mt: 1, maxWidth: 720, color: "rgba(255,255,255,0.85)" }}>
          Maintain the academic information shown on the public KBK Informasi DTETI
          website. Changes to active records are reflected through the API.
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ mt: 4 }}>
        Content overview
      </Typography>
      {error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : !stats ? (
        <Box sx={{ minHeight: 180, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
          }}
        >
          {statLabels.map(([key, label, href], index) => (
            <Box key={key} sx={{ p: 2.5, position: "relative" }}>
              {index > 0 ? (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ position: "absolute", insetBlock: 16, left: 0 }}
                />
              ) : null}
              <Typography variant="h5" color="primary.dark">
                {stats[key]}
              </Typography>
              <Link href={href} underline="hover" color="text.secondary" sx={{ fontSize: 14 }}>
                {label}
              </Link>
            </Box>
          ))}
        </Box>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
        <Link href="/admin/trash" underline="hover" sx={{ fontWeight: 700 }}>
          Review deleted records
        </Link>
        <Link href="/" underline="hover" sx={{ fontWeight: 700 }}>
          Open public website
        </Link>
      </Stack>
    </Box>
  );
}
