import { ApiHeaderOptions } from "@nestjs/swagger";

export const API_AUTH_HEADER_NAME = "Authorization";

export const AuthDocsConfig = {
    name: "Authorization",
    required: true,
    description: "token de acceso",
    example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZnVsbF9uYW1lIjoiSWduYWNpbyBBYmFyY2EiLCJlbWFpbCI6ImkuYWJhcmNhQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiaWFiYXJjYSIsInVzZXJfdHlwZSI6InRlcnJlbm8iLCJpYXQiOjE3NjgzOTk4MDMsImV4cCI6MTc2ODQxMDYwM30.b8Psc-iINIFKDrqM_rN09zAObIjo7l2Fg4vASvbslgA"
} as ApiHeaderOptions;