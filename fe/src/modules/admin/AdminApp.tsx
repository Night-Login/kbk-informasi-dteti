"use client";

import React from "react";
import { Admin, Resource } from "react-admin";
import { dataProvider } from "./dataProvider";
import { DashboardPlaceholder } from "./components/DashboardPlaceholder";
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
      dashboard={DashboardPlaceholder}
      requireAuth={false}
    >
      <Resource
        name="lecturers"
        list={LecturerList}
        create={LecturerCreate}
        edit={LecturerEdit}
        options={{ label: "Lecturers" }}
      />
      <Resource
        name="projects"
        list={ProjectList}
        create={ProjectCreate}
        edit={ProjectEdit}
        options={{ label: "Projects" }}
      />
      <Resource
        name="publications"
        list={PublicationList}
        create={PublicationCreate}
        edit={PublicationEdit}
        options={{ label: "Publications" }}
      />
      <Resource
        name="research/clusters"
        list={ResearchClusterList}
        create={ResearchClusterCreate}
        edit={ResearchClusterEdit}
        options={{ label: "Research Clusters" }}
      />
      <Resource
        name="research/tags"
        list={ResearchTagList}
        create={ResearchTagCreate}
        edit={ResearchTagEdit}
        options={{ label: "Research Tags" }}
      />
      <Resource
        name="admins"
        list={AdminList}
        create={AdminCreate}
        edit={AdminEdit}
        options={{ label: "Admins" }}
      />
    </Admin>
  );
};

export default AdminApp;
