import {
    createDirectus,
    rest,
    staticToken
} from "@directus/sdk";

export default createDirectus(
    process.env.DIRECTUS_URL || "http://localhost:8055"
)
.with(rest())
.with(staticToken(process.env.DIRECTUS_TOKEN || ""));
