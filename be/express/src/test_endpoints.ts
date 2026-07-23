import "dotenv/config";
import axios from "axios";
import { spawn, ChildProcess } from "child_process";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/v1`;
const TEST_PORT = new URL(BASE_URL).port || "5000";
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME;
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD;

if (!SUPERADMIN_USERNAME || !SUPERADMIN_PASSWORD) {
    throw new Error(
        "SUPERADMIN_USERNAME and SUPERADMIN_PASSWORD must be configured before running endpoint tests.",
    );
}

let serverProcess: ChildProcess | null = null;
let authToken: string = "";

// State IDs to share across tests
let testAdminId: number | null = null;
let testClusterId: string | null = null;
let testTagId: string | null = null;
let testLecturerId: string | null = null;
let testProjectId: string | null = null;
let testPublicationId: string | null = null;

let passedTests = 0;
let failedTests = 0;

function logPass(testName: string) {
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${testName}`);
    passedTests++;
}

function logFail(testName: string, error: any) {
    console.log(`\x1b[31m✖ [FAIL]\x1b[0m ${testName}`);
    if (error?.response?.data) {
        console.error(`  Response status: ${error.response.status}`, JSON.stringify(error.response.data));
    } else if (error?.message) {
        console.error(`  Error message: ${error.message}`);
    } else {
        console.error("  Error:", error);
    }
    failedTests++;
}

async function checkServerReady(): Promise<boolean> {
    try {
        const res = await axios.get(BASE_URL, { timeout: 2000 });
        return res.status === 200;
    } catch {
        return false;
    }
}

async function startServerIfNeeded(): Promise<void> {
    const ready = await checkServerReady();
    if (ready) {
        console.log(`Server is already running at ${BASE_URL}`);
        return;
    }

    console.log(`Server not reachable at ${BASE_URL}. Spawning server process...`);
    const serverPath = path.join(process.cwd(), "src", "server.ts");
    
    serverProcess = spawn("npx", ["tsx", serverPath], {
        cwd: process.cwd(),
        shell: true,
        stdio: "pipe",
        env: { ...process.env, PORT: TEST_PORT }
    });

    serverProcess.stdout?.on("data", (data) => {
        // Uncomment to debug server stdout during startup/test
        // console.log(`[Server]: ${data.toString().trim()}`);
    });

    serverProcess.stderr?.on("data", (data) => {
        // console.error(`[Server Error]: ${data.toString().trim()}`);
    });

    // Poll until ready
    for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 500));
        if (await checkServerReady()) {
            console.log("Spawned server is ready!");
            return;
        }
    }

    throw new Error(`Timeout waiting for spawned server to start on port ${TEST_PORT}`);
}

async function stopServerIfNeeded(): Promise<void> {
    if (serverProcess) {
        console.log("Stopping spawned server process...");
        serverProcess.kill("SIGTERM");
        serverProcess = null;
    }
}

async function runTests() {
    console.log("\n==============================================");
    console.log("🚀 STARTING BACKEND API ENDPOINTS TEST SUITE");
    console.log("==============================================\n");

    try {
        await startServerIfNeeded();

        // -------------------------------------------------------------
        // 1. Health Check
        // -------------------------------------------------------------
        console.log("\n--- 1. Health Check Endpoint ---");
        try {
            const res = await axios.get(BASE_URL);
            if (res.data?.status === "running") {
                logPass("GET / (Health Check)");
            } else {
                throw new Error(`Unexpected status response: ${JSON.stringify(res.data)}`);
            }
        } catch (e) {
            logFail("GET / (Health Check)", e);
        }

        // -------------------------------------------------------------
        // 2. Admin Authentication & Public Routes
        // -------------------------------------------------------------
        console.log("\n--- 2. Admin Authentication & Routes ---");
        try {
            await axios.post(`${API_URL}/admins/login`, {
                username: "__invalid_admin__",
                password: "__invalid_password__"
            });
            logFail("POST /api/v1/admins/login with wrong credentials should fail", { message: "Did not throw 401" });
        } catch (e: any) {
            if (e?.response?.status === 401 || e?.response?.status === 400 || e?.response?.status === 404) {
                logPass("POST /api/v1/admins/login with wrong credentials rejected");
            } else {
                logFail("POST /api/v1/admins/login with wrong credentials rejected", e);
            }
        }

        try {
            const res = await axios.post(`${API_URL}/admins/login`, {
                username: SUPERADMIN_USERNAME,
                password: SUPERADMIN_PASSWORD
            });
            if (res.data?.success && res.data?.data?.token) {
                authToken = res.data.data.token;
                logPass("POST /api/v1/admins/login with superadmin credentials");
            } else {
                throw new Error("No token returned upon successful login");
            }
        } catch (e) {
            logFail("POST /api/v1/admins/login with superadmin credentials", e);
        }

        const authHeaders = { headers: { Authorization: `Bearer ${authToken}` } };

        try {
            await axios.get(`${API_URL}/admins`);
            logFail("GET /api/v1/admins without token should fail", { message: "Did not throw 401" });
        } catch (e: any) {
            if (e?.response?.status === 401 || e?.response?.status === 403) {
                logPass("GET /api/v1/admins without token rejected");
            } else {
                logFail("GET /api/v1/admins without token rejected", e);
            }
        }

        try {
            const res = await axios.get(`${API_URL}/admins`, authHeaders);
            if (res.data?.success && Array.isArray(res.data?.data)) {
                logPass("GET /api/v1/admins with valid token");
            } else {
                throw new Error("Invalid format returned for admins list");
            }
        } catch (e) {
            logFail("GET /api/v1/admins with valid token", e);
        }

        try {
            const res = await axios.get(`${API_URL}/admins/me`, authHeaders);
            if (res.data?.success && res.data?.data?.username) {
                logPass("GET /api/v1/admins/me (Current Admin Profile)");
            } else {
                throw new Error("Invalid format returned for current admin profile");
            }
        } catch (e) {
            logFail("GET /api/v1/admins/me (Current Admin Profile)", e);
        }

        try {
            const uniqueName = `admin_test_${Date.now()}`;
            const res = await axios.post(`${API_URL}/admins`, {
                username: uniqueName,
                password: "testpassword123",
                role: "ADMIN"
            }, authHeaders);
            if (res.data?.success && res.data?.data?.id) {
                testAdminId = res.data.data.id;
                logPass("POST /api/v1/admins (Create Admin)");
            } else {
                throw new Error("Failed to create admin");
            }
        } catch (e) {
            logFail("POST /api/v1/admins (Create Admin)", e);
        }

        if (testAdminId) {
            try {
                const res = await axios.get(`${API_URL}/admins/${testAdminId}`, authHeaders);
                if (res.data?.success) logPass(`GET /api/v1/admins/${testAdminId}`);
                else throw new Error("Failed to fetch created admin");
            } catch (e) {
                logFail(`GET /api/v1/admins/${testAdminId}`, e);
            }

            try {
                const res = await axios.put(`${API_URL}/admins/${testAdminId}`, {
                    role: "ADMIN"
                }, authHeaders);
                if (res.data?.success) logPass(`PUT /api/v1/admins/${testAdminId}`);
                else throw new Error("Failed to update admin");
            } catch (e) {
                logFail(`PUT /api/v1/admins/${testAdminId}`, e);
            }
        }

        try {
            const res = await axios.post(`${API_URL}/admins/logout`);
            if (res.data?.success) {
                logPass("POST /api/v1/admins/logout");
            } else {
                throw new Error("Failed response from logout");
            }
        } catch (e) {
            logFail("POST /api/v1/admins/logout", e);
        }

        // -------------------------------------------------------------
        // 3. Research Clusters & Tags
        // -------------------------------------------------------------
        console.log("\n--- 3. Research Clusters & Tags Routes ---");
        try {
            const res = await axios.get(`${API_URL}/research`);
            if (res.data?.success) logPass("GET /api/v1/research (Summary/All)");
            else throw new Error("Failed response");
        } catch (e) {
            logFail("GET /api/v1/research", e);
        }

        try {
            const clusterSlug = `cluster-${Date.now()}`;
            const res = await axios.post(`${API_URL}/research/clusters`, {
                name: "Test Research Cluster",
                slug: clusterSlug,
                description: "Test cluster description",
                sort_order: 1
            }, authHeaders);
            if (res.data?.success && res.data?.data?.id) {
                testClusterId = res.data.data.id;
                logPass("POST /api/v1/research/clusters (Create Cluster)");
            } else {
                throw new Error("Failed to create cluster");
            }
        } catch (e) {
            logFail("POST /api/v1/research/clusters (Create Cluster)", e);
        }

        try {
            const res = await axios.get(`${API_URL}/research/clusters`);
            if (res.data?.success && Array.isArray(res.data?.data)) logPass("GET /api/v1/research/clusters");
            else throw new Error("Invalid clusters response");
        } catch (e) {
            logFail("GET /api/v1/research/clusters", e);
        }

        try {
            const res = await axios.get(`${API_URL}/research/clusters/paginated?page=1&limit=5`);
            if (res.data?.success && (res.data?.data?.data !== undefined || res.data?.data?.total !== undefined)) logPass("GET /api/v1/research/clusters/paginated");
            else throw new Error("Invalid paginated clusters response");
        } catch (e) {
            logFail("GET /api/v1/research/clusters/paginated", e);
        }

        if (testClusterId) {
            try {
                const res = await axios.get(`${API_URL}/research/clusters/${testClusterId}`);
                if (res.data?.success) logPass(`GET /api/v1/research/clusters/${testClusterId}`);
                else throw new Error("Cluster not found");
            } catch (e) {
                logFail(`GET /api/v1/research/clusters/${testClusterId}`, e);
            }

            try {
                const res = await axios.put(`${API_URL}/research/clusters/${testClusterId}`, {
                    name: "Test Research Cluster Updated"
                }, authHeaders);
                if (res.data?.success) logPass(`PUT /api/v1/research/clusters/${testClusterId}`);
                else throw new Error("Failed to update cluster");
            } catch (e) {
                logFail(`PUT /api/v1/research/clusters/${testClusterId}`, e);
            }

            // Create tag under this cluster
            try {
                const tagSlug = `tag-${Date.now()}`;
                const res = await axios.post(`${API_URL}/research/tags`, {
                    name: "Test Research Tag",
                    slug: tagSlug,
                    cluster_id: testClusterId,
                    description: "Test tag description",
                    is_active: true
                }, authHeaders);
                if (res.data?.success && res.data?.data?.id) {
                    testTagId = res.data.data.id;
                    logPass("POST /api/v1/research/tags (Create Tag)");
                } else {
                    throw new Error("Failed to create tag");
                }
            } catch (e) {
                logFail("POST /api/v1/research/tags (Create Tag)", e);
            }
        }

        try {
            const res = await axios.get(`${API_URL}/research/tags`);
            if (res.data?.success && Array.isArray(res.data?.data)) logPass("GET /api/v1/research/tags");
            else throw new Error("Invalid tags response");
        } catch (e) {
            logFail("GET /api/v1/research/tags", e);
        }

        try {
            const res = await axios.get(`${API_URL}/research/tags/paginated?page=1&limit=5`);
            if (res.data?.success && (res.data?.data?.data !== undefined || res.data?.data?.total !== undefined)) logPass("GET /api/v1/research/tags/paginated");
            else throw new Error("Invalid paginated tags response");
        } catch (e) {
            logFail("GET /api/v1/research/tags/paginated", e);
        }

        if (testTagId) {
            try {
                const res = await axios.get(`${API_URL}/research/tags/${testTagId}`);
                if (res.data?.success) logPass(`GET /api/v1/research/tags/${testTagId}`);
                else throw new Error("Tag not found");
            } catch (e) {
                logFail(`GET /api/v1/research/tags/${testTagId}`, e);
            }

            try {
                const res = await axios.put(`${API_URL}/research/tags/${testTagId}`, {
                    name: "Test Research Tag Updated"
                }, authHeaders);
                if (res.data?.success) logPass(`PUT /api/v1/research/tags/${testTagId}`);
                else throw new Error("Failed to update tag");
            } catch (e) {
                logFail(`PUT /api/v1/research/tags/${testTagId}`, e);
            }
        }

        // -------------------------------------------------------------
        // 4. Lecturer Routes
        // -------------------------------------------------------------
        console.log("\n--- 4. Lecturer Routes ---");
        try {
            const lecturerSlug = `lecturer-${Date.now()}`;
            const res = await axios.post(`${API_URL}/lecturers`, {
                full_name: "Dr. Test Lecturer, S.T., M.Eng.",
                academic_title: "Assistant Professor",
                slug: lecturerSlug,
                nip_or_staff_id: `19800101${Date.now()}`,
                email: "test.lecturer@ugm.ac.id",
                sinta_id: `6${Date.now().toString().slice(-6)}`,
                short_bio: "Expert in Artificial Intelligence and IoT."
            }, authHeaders);
            if (res.data?.success && res.data?.data?.id) {
                testLecturerId = res.data.data.id;
                logPass("POST /api/v1/lecturers (Create Lecturer)");
            } else {
                throw new Error("Failed to create lecturer");
            }
        } catch (e) {
            logFail("POST /api/v1/lecturers (Create Lecturer)", e);
        }

        try {
            const res = await axios.get(`${API_URL}/lecturers`);
            if (res.data?.success && Array.isArray(res.data?.data)) logPass("GET /api/v1/lecturers");
            else throw new Error("Invalid lecturers response");
        } catch (e) {
            logFail("GET /api/v1/lecturers", e);
        }

        try {
            const res = await axios.get(`${API_URL}/lecturers/paginated?page=1&limit=5`);
            if (res.data?.success && (res.data?.data?.data !== undefined || res.data?.data?.total !== undefined)) logPass("GET /api/v1/lecturers/paginated");
            else throw new Error("Invalid paginated lecturers response");
        } catch (e) {
            logFail("GET /api/v1/lecturers/paginated", e);
        }

        if (testLecturerId) {
            try {
                const res = await axios.get(`${API_URL}/lecturers/${testLecturerId}`);
                if (res.data?.success) logPass(`GET /api/v1/lecturers/${testLecturerId}`);
                else throw new Error("Lecturer not found");
            } catch (e) {
                logFail(`GET /api/v1/lecturers/${testLecturerId}`, e);
            }

            try {
                const res = await axios.put(`${API_URL}/lecturers/${testLecturerId}`, {
                    short_bio: "Updated bio for AI expert."
                }, authHeaders);
                if (res.data?.success) logPass(`PUT /api/v1/lecturers/${testLecturerId}`);
                else throw new Error("Failed to update lecturer");
            } catch (e) {
                logFail(`PUT /api/v1/lecturers/${testLecturerId}`, e);
            }

            if (testTagId) {
                try {
                    const res = await axios.put(`${API_URL}/lecturers/${testLecturerId}/tags`, {
                        tags: [{ tag_id: testTagId, is_primary: true }]
                    }, authHeaders);
                    if (res.data?.success) logPass(`PUT /api/v1/lecturers/${testLecturerId}/tags`);
                    else throw new Error("Failed to assign research tags to lecturer");
                } catch (e) {
                    logFail(`PUT /api/v1/lecturers/${testLecturerId}/tags`, e);
                }
            }

            try {
                const res = await axios.put(`${API_URL}/lecturers/${testLecturerId}/metrics`, {
                    h_index: 12,
                    total_citations: 250,
                    sinta_score: 150.75,
                    source: "SINTA"
                }, authHeaders);
                if (res.data?.success) logPass(`PUT /api/v1/lecturers/${testLecturerId}/metrics`);
                else throw new Error("Failed to upsert lecturer metrics");
            } catch (e) {
                logFail(`PUT /api/v1/lecturers/${testLecturerId}/metrics`, e);
            }
        }

        // -------------------------------------------------------------
        // 5. Project Routes
        // -------------------------------------------------------------
        console.log("\n--- 5. Project Routes ---");
        try {
            const projectSlug = `project-${Date.now()}`;
            const res = await axios.post(`${API_URL}/projects`, {
                title: "AI-Powered Smart Grid Monitoring",
                slug: projectSlug,
                description: "Research project on smart electrical grids using AI.",
                status: "ONGOING",
                start_year: 2025,
                end_year: 2027,
                lead_lecturer_id: testLecturerId || undefined
            }, authHeaders);
            if (res.data?.success && res.data?.data?.id) {
                testProjectId = res.data.data.id;
                logPass("POST /api/v1/projects (Create Project)");
            } else {
                throw new Error("Failed to create project");
            }
        } catch (e) {
            logFail("POST /api/v1/projects (Create Project)", e);
        }

        try {
            const res = await axios.get(`${API_URL}/projects`);
            if (res.data?.success && Array.isArray(res.data?.data)) logPass("GET /api/v1/projects");
            else throw new Error("Invalid projects response");
        } catch (e) {
            logFail("GET /api/v1/projects", e);
        }

        try {
            const res = await axios.get(`${API_URL}/projects/paginated?page=1&limit=5`);
            if (res.data?.success && (res.data?.data?.data !== undefined || res.data?.data?.total !== undefined)) logPass("GET /api/v1/projects/paginated");
            else throw new Error("Invalid paginated projects response");
        } catch (e) {
            logFail("GET /api/v1/projects/paginated", e);
        }

        if (testProjectId) {
            try {
                const res = await axios.get(`${API_URL}/projects/${testProjectId}`);
                if (res.data?.success) logPass(`GET /api/v1/projects/${testProjectId}`);
                else throw new Error("Project not found");
            } catch (e) {
                logFail(`GET /api/v1/projects/${testProjectId}`, e);
            }

            try {
                const res = await axios.put(`${API_URL}/projects/${testProjectId}`, {
                    description: "Updated description for AI Smart Grid project."
                }, authHeaders);
                if (res.data?.success) logPass(`PUT /api/v1/projects/${testProjectId}`);
                else throw new Error("Failed to update project");
            } catch (e) {
                logFail(`PUT /api/v1/projects/${testProjectId}`, e);
            }

            if (testLecturerId) {
                try {
                    const res = await axios.put(`${API_URL}/projects/${testProjectId}/participants`, {
                        participants: [{ lecturer_id: testLecturerId, role: "Principal Investigator" }]
                    }, authHeaders);
                    if (res.data?.success) logPass(`PUT /api/v1/projects/${testProjectId}/participants`);
                    else throw new Error("Failed to assign participants to project");
                } catch (e) {
                    logFail(`PUT /api/v1/projects/${testProjectId}/participants`, e);
                }
            }

            if (testTagId) {
                try {
                    const res = await axios.put(`${API_URL}/projects/${testProjectId}/tags`, {
                        tags: [testTagId]
                    }, authHeaders);
                    if (res.data?.success) logPass(`PUT /api/v1/projects/${testProjectId}/tags`);
                    else throw new Error("Failed to assign research tags to project");
                } catch (e) {
                    logFail(`PUT /api/v1/projects/${testProjectId}/tags`, e);
                }
            }
        }

        // -------------------------------------------------------------
        // 6. Publication Routes
        // -------------------------------------------------------------
        console.log("\n--- 6. Publication Routes ---");
        try {
            const pubSlug = `publication-${Date.now()}`;
            const pubDoi = `10.1109/test.${Date.now()}`;
            const res = await axios.post(`${API_URL}/publications`, {
                title: "Deep Learning Architectures for Smart Grids",
                slug: pubSlug,
                year: 2026,
                venue: "IEEE Transactions on Smart Grid",
                doi: pubDoi,
                source: "OPENALEX"
            }, authHeaders);
            if (res.data?.success && res.data?.data?.id) {
                testPublicationId = res.data.data.id;
                logPass("POST /api/v1/publications (Create Publication)");
            } else {
                throw new Error("Failed to create publication");
            }
        } catch (e) {
            logFail("POST /api/v1/publications (Create Publication)", e);
        }

        try {
            const res = await axios.get(`${API_URL}/publications`);
            if (res.data?.success && Array.isArray(res.data?.data)) logPass("GET /api/v1/publications");
            else throw new Error("Invalid publications response");
        } catch (e) {
            logFail("GET /api/v1/publications", e);
        }

        try {
            const res = await axios.get(`${API_URL}/publications/paginated?page=1&limit=5`);
            if (res.data?.success && (res.data?.data?.data !== undefined || res.data?.data?.total !== undefined)) logPass("GET /api/v1/publications/paginated");
            else throw new Error("Invalid paginated publications response");
        } catch (e) {
            logFail("GET /api/v1/publications/paginated", e);
        }

        if (testPublicationId) {
            try {
                const res = await axios.get(`${API_URL}/publications/${testPublicationId}`);
                if (res.data?.success) logPass(`GET /api/v1/publications/${testPublicationId}`);
                else throw new Error("Publication not found");
            } catch (e) {
                logFail(`GET /api/v1/publications/${testPublicationId}`, e);
            }

            try {
                const res = await axios.put(`${API_URL}/publications/${testPublicationId}`, {
                    abstract: "An exhaustive survey of deep learning techniques applied to grid anomaly detection."
                }, authHeaders);
                if (res.data?.success) logPass(`PUT /api/v1/publications/${testPublicationId}`);
                else throw new Error("Failed to update publication");
            } catch (e) {
                logFail(`PUT /api/v1/publications/${testPublicationId}`, e);
            }

            if (testLecturerId) {
                try {
                    const res = await axios.put(`${API_URL}/publications/${testPublicationId}/lecturers`, {
                        lecturers: [{ lecturer_id: testLecturerId, author_order: 1 }]
                    }, authHeaders);
                    if (res.data?.success) logPass(`PUT /api/v1/publications/${testPublicationId}/lecturers`);
                    else throw new Error("Failed to assign lecturers to publication");
                } catch (e) {
                    logFail(`PUT /api/v1/publications/${testPublicationId}/lecturers`, e);
                }
            }
        }

        // -------------------------------------------------------------
        // 7. Deletion & Restoration Cleanup
        // -------------------------------------------------------------
        console.log("\n--- 7. Deletion & Restoration Endpoints ---");
        
        if (testPublicationId) {
            try {
                await axios.delete(`${API_URL}/publications/${testPublicationId}`, authHeaders);
                logPass(`DELETE /api/v1/publications/${testPublicationId}`);
            } catch (e) {
                logFail(`DELETE /api/v1/publications/${testPublicationId}`, e);
            }
            try {
                await axios.patch(`${API_URL}/publications/${testPublicationId}/restore`, {}, authHeaders);
                logPass(`PATCH /api/v1/publications/${testPublicationId}/restore`);
            } catch (e) {
                logFail(`PATCH /api/v1/publications/${testPublicationId}/restore`, e);
            }
        }

        if (testProjectId) {
            try {
                await axios.delete(`${API_URL}/projects/${testProjectId}`, authHeaders);
                logPass(`DELETE /api/v1/projects/${testProjectId}`);
            } catch (e) {
                logFail(`DELETE /api/v1/projects/${testProjectId}`, e);
            }
            try {
                await axios.patch(`${API_URL}/projects/${testProjectId}/restore`, {}, authHeaders);
                logPass(`PATCH /api/v1/projects/${testProjectId}/restore`);
            } catch (e) {
                logFail(`PATCH /api/v1/projects/${testProjectId}/restore`, e);
            }
        }

        if (testLecturerId) {
            try {
                await axios.delete(`${API_URL}/lecturers/${testLecturerId}`, authHeaders);
                logPass(`DELETE /api/v1/lecturers/${testLecturerId}`);
            } catch (e) {
                logFail(`DELETE /api/v1/lecturers/${testLecturerId}`, e);
            }
            try {
                await axios.patch(`${API_URL}/lecturers/${testLecturerId}/restore`, {}, authHeaders);
                logPass(`PATCH /api/v1/lecturers/${testLecturerId}/restore`);
            } catch (e) {
                logFail(`PATCH /api/v1/lecturers/${testLecturerId}/restore`, e);
            }
        }

        if (testTagId) {
            try {
                await axios.delete(`${API_URL}/research/tags/${testTagId}`, authHeaders);
                logPass(`DELETE /api/v1/research/tags/${testTagId}`);
            } catch (e) {
                logFail(`DELETE /api/v1/research/tags/${testTagId}`, e);
            }
            try {
                await axios.patch(`${API_URL}/research/tags/${testTagId}/restore`, {}, authHeaders);
                logPass(`PATCH /api/v1/research/tags/${testTagId}/restore`);
            } catch (e) {
                logFail(`PATCH /api/v1/research/tags/${testTagId}/restore`, e);
            }
        }

        if (testClusterId) {
            try {
                await axios.delete(`${API_URL}/research/clusters/${testClusterId}`, authHeaders);
                logPass(`DELETE /api/v1/research/clusters/${testClusterId}`);
            } catch (e) {
                logFail(`DELETE /api/v1/research/clusters/${testClusterId}`, e);
            }
            try {
                await axios.patch(`${API_URL}/research/clusters/${testClusterId}/restore`, {}, authHeaders);
                logPass(`PATCH /api/v1/research/clusters/${testClusterId}/restore`);
            } catch (e) {
                logFail(`PATCH /api/v1/research/clusters/${testClusterId}/restore`, e);
            }
        }

        if (testAdminId) {
            try {
                await axios.delete(`${API_URL}/admins/${testAdminId}`, authHeaders);
                logPass(`DELETE /api/v1/admins/${testAdminId}`);
            } catch (e) {
                logFail(`DELETE /api/v1/admins/${testAdminId}`, e);
            }
            try {
                await axios.patch(`${API_URL}/admins/${testAdminId}/restore`, {}, authHeaders);
                logPass(`PATCH /api/v1/admins/${testAdminId}/restore`);
            } catch (e) {
                logFail(`PATCH /api/v1/admins/${testAdminId}/restore`, e);
            }
        }

    } catch (error: any) {
        console.error("\n❌ Fatal Test Suite Error:", error.message || error);
    } finally {
        await stopServerIfNeeded();

        console.log("\n==============================================");
        console.log(`Summary: \x1b[32m${passedTests} passed\x1b[0m, \x1b[31m${failedTests} failed\x1b[0m out of ${passedTests + failedTests} tests.`);
        console.log("==============================================\n");

        if (failedTests > 0) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    }
}

runTests();
