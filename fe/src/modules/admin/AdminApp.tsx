"use client";

import React from "react";
import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import ArticleIcon from "@mui/icons-material/Article";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SellIcon from "@mui/icons-material/Sell";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminLayout } from "./components/AdminLayout";
import { AdminLogin } from "./components/AdminLogin";
import { TrashPage } from "./components/TrashPage";
import { adminTheme } from "./theme";
import { LecturerList, LecturerCreate, LecturerEdit } from "./resources/lecturers";
import { ProjectList, ProjectCreate, ProjectEdit } from "./resources/projects";
import { PublicationList, PublicationCreate, PublicationEdit } from "./resources/publications";
import { ResearchClusterList, ResearchClusterCreate, ResearchClusterEdit } from "./resources/researchClusters";
import { ResearchTagList, ResearchTagCreate, ResearchTagEdit } from "./resources/researchTags";
import { AdminList, AdminCreate, AdminEdit } from "./resources/admins";

export const AdminApp: React.FC = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={AdminDashboard}
      layout={AdminLayout}
      loginPage={AdminLogin}
      theme={adminTheme}
      requireAuth
      disableTelemetry
      title="KBK Informasi DTETI Admin"
    >
      <Resource
        name="lecturers"
        list={LecturerList}
        create={LecturerCreate}
        edit={LecturerEdit}
        icon={PeopleIcon}
        recordRepresentation="full_name"
        options={{ label: "Lecturers" }}
      />
      <Resource
        name="projects"
        list={ProjectList}
        create={ProjectCreate}
        edit={ProjectEdit}
        icon={WorkIcon}
        recordRepresentation="title"
        options={{ label: "Projects" }}
      />
      <Resource
        name="publications"
        list={PublicationList}
        create={PublicationCreate}
        edit={PublicationEdit}
        icon={ArticleIcon}
        recordRepresentation="title"
        options={{ label: "Publications" }}
      />
      <Resource
        name="research/clusters"
        list={ResearchClusterList}
        create={ResearchClusterCreate}
        edit={ResearchClusterEdit}
        icon={AccountTreeIcon}
        recordRepresentation="name"
        options={{ label: "Research Clusters" }}
      />
      <Resource
        name="research/tags"
        list={ResearchTagList}
        create={ResearchTagCreate}
        edit={ResearchTagEdit}
        icon={SellIcon}
        recordRepresentation="name"
        options={{ label: "Research Tags" }}
      />
      <Resource
        name="admins"
        list={AdminList}
        create={AdminCreate}
        edit={AdminEdit}
        icon={AdminPanelSettingsIcon}
        recordRepresentation="username"
        options={{ label: "Admins" }}
      />
      <CustomRoutes>
        <Route path="/trash" element={<TrashPage />} />
      </CustomRoutes>
    </Admin>
  );
};

export default AdminApp;
