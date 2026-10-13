# Flow Board Debugging

## Purpose

Provide a systematic debugging workflow.

When a bug is reported:

1. Identify the failing application:
   - `apps/web`
   - `apps/server`
   - `packages/shared`
   - database
   - infrastructure

2. Reproduce the issue.

3. Inspect the boundary where the data becomes incorrect.

4. Verify:
   - request payload
   - response payload
   - HTTP status
   - server logs
   - database state
   - shared types/schemas

5. Fix the root cause.

Do not immediately patch the symptom.

## Backend debugging

Check:

- controller input
- DTO validation
- service logic
- repository query
- database result
- serialization

## Frontend/backend debugging

Trace:

UI
 ↓
API client
 ↓
HTTP request
 ↓
NestJS controller
 ↓
DTO
 ↓
service
 ↓
repository
 ↓
database

Then trace the response in reverse.

## Rules

Do not add permanent `console.log` statements as a debugging solution.

Remove temporary debugging code after the issue is resolved.

Never silently swallow errors.
