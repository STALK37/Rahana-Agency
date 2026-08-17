# Security Policy

## Supported versions

This project is developed on `main`. Security fixes are applied there and released as a new tag.

| Version | Supported |
| ------- | --------- |
| `main`  | ✅        |
| < 1.0   | ❌        |

## Reporting a vulnerability

Please **do not open a public issue** for a security problem.

Report it privately through GitHub's [security advisory form](../../security/advisories/new), or email
**ggevorgyanvahe@gmail.com** with the subject line `SECURITY — Rahana`.

Include, as far as you can:

- what the vulnerability allows an attacker to do
- the steps or request needed to reproduce it
- the affected route, component or file
- any suggested fix

You can expect an acknowledgement within **72 hours** and an assessment within **7 days**. If the report is
confirmed, I will agree a disclosure timeline with you and credit you in the advisory unless you'd rather
stay anonymous.

## Scope

This is a static, front-end-first site: property data ships in the bundle and there is no user
authentication or database. The areas most worth your attention are:

- **Server-side rendering** — `src/server.ts` and `src/start.ts` handle every request
- **Search-param parsing** — `src/lib/filters.ts` validates untrusted URL input
- **CSRF middleware** — configured in `src/start.ts`
- **Third-party embeds** — the OpenStreetMap iframe in `src/components/MapEmbed.tsx`

Out of scope: findings that require a compromised device, vulnerabilities in a dependency that already has
a published advisory and fix, and reports produced by an automated scanner with no demonstrated impact.
