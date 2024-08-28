import { generateOpenApiDocument } from "trpc-openapi";

import { appRouter } from "@app/backoffice-api";

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Backoffice API",
  version: "1.0.0",
  baseUrl: "http://localhost:3000/api",
});
