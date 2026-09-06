---
description: Instructions for backend code in the backend/ directory
applyTo: "backend/**"
---

You are working on the backend of this project.

- Follow RESTful conventions for API route design
- Use TypeScript strictly — avoid `any` types
- Validate and sanitise all incoming request data before processing
- Never expose sensitive data (secrets, credentials, internal stack traces) in API responses
- Use Drizzle ORM patterns consistent with the existing schema in `drizzle.config.ts`
- Write services that are independently testable and free of side effects where possible
