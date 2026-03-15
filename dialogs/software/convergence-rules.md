# Software Development — Additional Convergence Rules

In addition to the standard Pantion convergence elements, cover the sections below.
These rules encode domain-specific knowledge that generic convergence misses.

---

## Question Order

Follow this order. Earlier answers shape later questions — skipping ahead causes redundancy.

1. **Core intent** — what does this software do, in one sentence?
2. **Users and roles** — who uses it, are there different permission levels?
3. **Inputs and outputs** — what goes in, what comes out, what's observable?
4. **Data model** — what data does it manage, where does it live?
5. **Core behaviors** — the 3–5 things the system MUST do
6. **Failure behavior** — what happens when things go wrong?
7. **Constraints** — security, performance, cost, privacy (HARD)
8. **Non-goals** — what it explicitly does NOT do
9. **Deployment and environment** — where does it run?
10. **Testing and verification** — how do we know it works?

Skip questions whose answers are already implied by earlier answers. If the user said "CLI tool for personal use," do not ask about roles or multi-tenancy.

---

## Branching Logic

Certain answers unlock mandatory follow-up paths. Do NOT continue to the next topic until the branch is resolved.

### Multi-user / multi-tenant
When the user mentions multiple users, roles, or tenants:
- **Immediately** ask: isolation model (shared DB? schema-per-tenant? DB-per-tenant?)
- Permissions: who can see/do what? Is there an admin role?
- Data boundaries: can user A ever see user B's data? (this is almost always HARD)
- Session management: how are users identified?

### Persistent data
When the system stores data:
- What is the source of truth? (database, file, external API)
- What happens if the data store is unavailable?
- Retention: how long is data kept? Is there a deletion policy?
- Backup/recovery: what is the acceptable data loss window?

### External integrations
When the system calls or is called by external services:
- What happens when the external service is down? (timeout, retry, fallback, fail?)
- Are there rate limits? Cost per call?
- Authentication: API keys, OAuth, mutual TLS?
- Data format: is the external API stable or does it change?

### Financial / transactional
When the system handles money, bookings, or irreversible operations:
- What is the transaction boundary? (what succeeds or fails as a unit?)
- What happens on partial failure? (payment succeeds but order fails — who bears the risk?)
- Idempotency: can the same operation be safely retried?
- Audit trail: must operations be reconstructable?

### Real-time / event-driven
When the system involves live updates, notifications, or streaming:
- What is the acceptable latency?
- What happens when a client disconnects and reconnects? (missed events?)
- Ordering: do events need to arrive in order?
- Backpressure: what happens when producers outpace consumers?

---

## Follow-up Triggers

These answers are **too vague to accept**. Always follow up.

| Vague answer | Follow-up |
|---|---|
| "It must be secure" | Secure against what? Unauthorized access? Data leakage? Injection? What's the worst case? |
| "It should be fast" | Fast means what? <100ms response? <1s page load? Handles 1000 concurrent users? |
| "It needs to scale" | Scale to what? 10 users? 10,000? 10 million? What's the growth timeline? |
| "Standard error handling" | There is no standard. What does the user see? Is the operation retried? Is the error logged? Is someone notified? |
| "The usual authentication" | Username/password? OAuth? SSO? Magic links? Who manages accounts? |
| "It should be reliable" | What is the acceptable downtime? Per day? Per month? What happens during downtime? |
| "Simple UI" | Simple for whom? How many distinct screens/pages? What is the primary action on each? |
| "Like [other product]" | Which specific aspects? The data model? The UX? The pricing? Be precise about what "like X" means. |
| "It should handle errors gracefully" | Define gracefully. User sees a message? Automatic retry? Fallback to cached data? Transaction rolled back? |
| "We'll figure that out later" | Mark as OPEN QUESTION. Do not silently skip it — it will come back during implementation. |

---

## Pattern Recognition

When you recognize a common system type, use the associated checklist to ensure domain-specific concerns are covered. These are edge cases that users almost never mention unprompted.

### E-commerce / marketplace
- Partial returns and refunds (item-level, not just order-level)
- Currency rounding and display (who absorbs rounding differences?)
- Inventory race conditions (two users buy the last item simultaneously)
- Tax calculation (varies by jurisdiction — is this in scope?)
- Abandoned cart behavior
- Seller vs buyer dispute resolution (if marketplace)

### Booking / reservation system
- Overbooking policy (is it allowed? what happens?)
- Cancellation policy (who can cancel, when, refund rules)
- Timezone handling (event time vs user time vs server time)
- Concurrent booking conflicts (two users book the same slot)
- No-show behavior
- Waitlist mechanics (if applicable)

### Content management / CMS
- Content versioning (is there a draft/publish workflow?)
- Permissions per content type (who can edit what?)
- Media handling (upload limits, formats, storage)
- Search (full-text? faceted? real-time indexing?)
- Internationalization (multi-language content?)
- Content lifecycle (archival, deletion, expiry)

### Messaging / communication
- Message persistence (forever? configurable retention?)
- Read receipts and delivery status
- Offline behavior (queue messages? drop them?)
- Group dynamics (who can add/remove members?)
- Media in messages (file types, size limits)
- Notification model (push, email, in-app, configurable?)

### API / developer platform
- Versioning strategy (URL path, header, query param)
- Rate limiting (per user? per API key? per endpoint?)
- Authentication (API keys, OAuth, JWT — how are they managed?)
- Pagination (cursor-based, offset-based, limit)
- Webhook delivery (retry policy, ordering, signature verification)
- SDK expectations (which languages? auto-generated?)

### CLI tool
- Input sources (flags, stdin, config file, environment variables — precedence?)
- Output format (human-readable, JSON, both via --format flag?)
- Exit codes (what do non-zero codes mean?)
- Idempotency (is running the same command twice safe?)
- Interruption (what happens on Ctrl+C? cleanup needed?)
- Shell completion (bash, zsh, fish?)

### Dashboard / analytics
- Data freshness (real-time, near-real-time, hourly, daily?)
- Aggregation logic (how are metrics calculated? what's the source?)
- Export (CSV, PDF, API access to raw data?)
- Permissions (who sees what data? row-level security?)
- Historical data (how far back? is old data archived or deleted?)
- Alerting (thresholds, channels, escalation)

---

## Technology Stack (FLEX)

- Is there a preferred language, framework, or platform?
- Are there integration requirements with existing systems?
- **Mark ALL technology choices as FLEX** unless the user explicitly insists
- Do NOT suggest technologies. Do NOT compare frameworks. Focus on WHAT, not HOW.
- If the user asks for a recommendation, acknowledge it but clarify: "I can note your preference as a FLEX default, but the canon focuses on what the system does, not how it's built. A different technology could implement the same intent."

---

## Deployment and Environment

- Where will it run? (local only, cloud, specific platform, edge)
- Single instance or distributed?
- Are there specific compliance requirements? (GDPR, HIPAA, SOC2)
- Environment configuration (secrets management, feature flags)
- CI/CD expectations (automatic deploy, manual approval gates)

---

## Testing and Verification

- How should correctness be verified?
- What are the critical paths that must ALWAYS work? (these become HARD)
- Are there existing test suites or testing conventions?
- What constitutes a passing build? (unit tests, integration tests, linting, type checking)
- Performance benchmarks? (if "it should be fast" was mentioned)

---

## Skip Logic

Do NOT ask about topics that are already resolved by earlier answers:

- **"Personal project, just for me"** → skip multi-user, permissions, roles, authentication
- **"CLI tool"** → skip UI design, responsive layout, browser support
- **"No database"** → skip data model, retention, backup, migration
- **"Read-only dashboard"** → skip write operations, input validation, transactions
- **"Internal tool"** → skip onboarding flow, marketing pages, SEO
- **"Prototype / MVP"** → mark most infrastructure concerns as FLEX, focus on core behavior
- **"Stateless service"** → skip persistence, session management, caching

When skipping, briefly note WHY: "Since this is a personal CLI tool, I'll skip multi-user concerns."

---

## Decomposition Awareness

After covering core intent and users, evaluate whether this is too large for a single canon:

- (+1) More than 3 clearly independent behavior clusters
- (+1) Different parts have different authority budgets
- (+1) User talks about "modules", "services", or "microservices"
- (+1) Different parts have different users or interfaces
- (+1) The project description takes more than 3 sentences

Score 0–1: proceed as standalone canon. Score 2–3: discuss with the user. Score 4–5: actively propose decomposition before continuing.

---

## IMPORTANT

- Do NOT choose specific technologies unless the user insists
- Mark all technology preferences as FLEX
- Focus on WHAT the software does, not HOW it's built
- Ask ONE question at a time — wait for the answer before continuing
- When the user gives a short answer, assess whether it's sufficient for THIS domain. "A todo list" is sufficient intent for a simple app. "A booking system" is not — it needs the booking-specific follow-ups.
- If you recognize a system pattern (e-commerce, booking, etc.), use the pattern-specific checklist but do NOT dump all questions at once. Weave them naturally into the conversation.
