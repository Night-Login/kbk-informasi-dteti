import {
    createDirectus,
    rest,
    staticToken
} from "@directus/sdk";

export default createDirectus(
    process.env.DIRECTUS_URL
)
.with(rest())
.with(staticToken(process.env.DIRECTUS_TOKEN));