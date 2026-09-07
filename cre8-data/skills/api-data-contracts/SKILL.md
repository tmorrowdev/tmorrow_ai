---
name: api-data-contracts
description: >
  Generate typed data contracts from an OpenAPI spec so a UI agent can build
  data-driven interfaces without Claude ever seeing the underlying data.

  Triggers: "data contract", "API schema for UI", "wire up the API",
  "generate types from OpenAPI", "connect UI to API", "API integration layer"

  Use when the user wants Claude to understand an API's shape and produce
  typed interfaces, endpoint metadata, or fetch blueprints that a separate
  generative-UI agent can consume. Claude reads the OpenAPI spec, extracts
  endpoint signatures and response schemas, and outputs data contracts —
  never making live API calls or accessing real data.
---

# API Data Contracts

Generate typed data contracts from your company's OpenAPI spec so a separate UI agent can build data-driven interfaces — without Claude ever seeing the actual data.

## Why This Exists

Your company exposes data through a core API service with an OpenAPI/Swagger spec. A separate generative-UI agent builds the frontend. This skill bridges the two:

1. Claude reads the OpenAPI spec (schema only — no live calls)
2. Claude produces **data contracts**: typed interfaces describing each endpoint's inputs and outputs
3. The UI agent consumes these contracts to build components that fetch and render data at runtime

Claude never sees or handles real data. It only works with the API's *shape*.

---

## Workflow

### Phase 1: Load the OpenAPI Spec

Fetch the spec from the documented URL endpoint. Parse it as JSON or YAML.

```
GET /openapi.json
— or —
GET /api/docs/swagger.json
```

Ask the user for the spec URL if not already known. Only read the schema — do **not** call any data endpoints.

**What to extract:**
- `info`: API title, version, description
- `servers`: Base URL(s) and environment labels
- `paths`: Every endpoint with method, path, parameters, and response schemas
- `components/schemas`: Reusable data models (the core of the contracts)
- `securitySchemes`: Auth method (OAuth2 flows, scopes)

### Phase 2: Catalog the Endpoints

Build a structured catalog of every endpoint relevant to the UI:

```typescript
interface EndpointCatalog {
  [operationId: string]: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    summary: string;
    parameters: ParameterDef[];
    requestBody?: SchemaRef;
    response: SchemaRef;
    auth: AuthRequirement;
    tags: string[];
  };
}
```

Group endpoints by tag or domain (e.g., "users", "orders", "analytics").

### Phase 3: Generate Data Contracts

For each endpoint (or group of related endpoints), produce a **data contract** — a self-contained typed interface the UI agent can use.

#### Contract Format

```typescript
/**
 * Data Contract: [Domain / Feature Name]
 * Source: [METHOD] [path]
 * Auth: OAuth2 — scopes: [list scopes]
 * Last generated from spec version: [version]
 */

// --- Request ---

interface [OperationId]Request {
  // Path parameters
  // Query parameters
  // Request body fields
}

// --- Response ---

interface [OperationId]Response {
  // Top-level response fields
}

// --- Nested types ---

interface [NestedModel] {
  // Fields from components/schemas
}

// --- Fetch blueprint ---

const endpoint = {
  method: '[METHOD]',
  path: '[path with {param} placeholders]',
  auth: 'oauth2',
  scopes: ['scope1', 'scope2'],
  pagination?: {
    style: 'offset' | 'cursor',
    params: { limit: 'limit', offset: 'offset' | cursor: 'cursor' },
  },
};
```

#### Contract Rules

1. **No default values from real data.** Contracts describe shape, not content.
2. **Preserve nullability.** If the spec says `nullable: true`, the type must be `T | null`.
3. **Flatten `$ref` chains.** Resolve all `$ref` pointers into concrete types so the contract is self-contained.
4. **Include enums.** If a field has `enum` values, define them as a union type.
5. **Note pagination.** If an endpoint is paginated, include the pagination style and parameter names.
6. **Note required vs optional.** Use `?` for optional fields in TypeScript.
7. **Include field descriptions.** Carry over `description` from the spec as JSDoc comments.

### Phase 4: Produce the Output

Deliver contracts in one of these formats depending on what the UI agent expects:

**TypeScript interfaces** (default):
```
contracts/
├── index.ts              # Re-exports all contracts
├── users.contracts.ts    # User-related endpoint contracts
├── orders.contracts.ts   # Order-related endpoint contracts
├── analytics.contracts.ts
└── _shared.ts            # Shared/reusable types (pagination, error shapes)
```

**JSON Schema** (if the UI agent prefers schema over types):
```json
{
  "operationId": "listUsers",
  "method": "GET",
  "path": "/api/v1/users",
  "request": { /* JSON Schema for params */ },
  "response": { /* JSON Schema for response body */ },
  "auth": { "type": "oauth2", "scopes": ["users:read"] }
}
```

### Phase 5: Validate Contracts

Before handing off:

- [ ] Every endpoint in the spec has a corresponding contract
- [ ] All `$ref` pointers are resolved (no dangling references)
- [ ] Required fields are marked correctly
- [ ] Enum values match the spec
- [ ] Pagination patterns are documented
- [ ] Auth scopes are listed per endpoint
- [ ] No real data values appear anywhere in the contracts

---

## Auth Pattern (OAuth2 / SSO)

The API uses OAuth2. Contracts should document the auth requirement but **never** include tokens or credentials. The UI agent handles the auth flow at runtime.

Include in each contract:
```typescript
const auth = {
  type: 'oauth2',
  flow: 'authorization_code',  // or 'client_credentials', etc.
  scopes: ['required:scope'],
  tokenEndpoint: '/oauth/token',  // from securitySchemes
  authorizeEndpoint: '/oauth/authorize',
};
```

---

## Data Source Discovery Protocol

The UI agent needs to ask "what data is available?" before it can build anything. This section defines a discovery protocol so the two agents can coordinate without the user manually bridging them.

### How It Works

1. **UI agent requests discovery**: It asks for available data sources (either via a user prompt like "show me what data I can work with" or programmatically)
2. **Data agent reads the OpenAPI spec** and produces a **data source catalog** — a structured summary of every available domain, endpoint, and data shape
3. **UI agent receives the catalog** and renders it as selectable options for the user
4. **User picks what they want** (e.g., "show me order analytics")
5. **Data agent generates the specific contracts** for the selected domain
6. **UI agent builds the interface** using those contracts

### Data Source Catalog Format

When asked "what data is available?", produce this catalog from the OpenAPI spec:

```typescript
interface DataSourceCatalog {
  apiName: string;           // from spec info.title
  apiVersion: string;        // from spec info.version
  baseUrl: string;           // from spec servers[0].url
  domains: DataDomain[];
}

interface DataDomain {
  /** Domain name derived from OpenAPI tags (e.g., "Orders", "Users", "Analytics") */
  name: string;

  /** Human-readable description of what data this domain covers */
  description: string;

  /** Icon hint for the UI agent (e.g., "chart-bar", "users", "shopping-cart") */
  iconHint: string;

  /** Number of endpoints in this domain */
  endpointCount: number;

  /** High-level summary of what the user can explore */
  capabilities: string[];

  /** The data shapes available (table-like summaries for the user to browse) */
  availableViews: DataView[];
}

interface DataView {
  /** Human-readable label (e.g., "Order History", "Monthly Revenue") */
  label: string;

  /** What kind of data this returns */
  type: 'list' | 'detail' | 'aggregate' | 'time-series' | 'search';

  /** The operationId from the spec — used to request the full contract later */
  operationId: string;

  /** Key fields the user would see (column-like summary) */
  fields: { name: string; type: string; description: string }[];

  /** Available filters the user can apply */
  filters: { name: string; type: string; description: string; options?: string[] }[];

  /** Whether the endpoint supports pagination */
  paginated: boolean;
}
```

### Example Catalog Output

When the data agent reads the spec, it might produce:

```json
{
  "apiName": "Acme Data Platform",
  "apiVersion": "2.1.0",
  "baseUrl": "https://api.acme.com/v2",
  "domains": [
    {
      "name": "Orders",
      "description": "Customer orders, line items, and fulfillment status",
      "iconHint": "shopping-cart",
      "endpointCount": 5,
      "capabilities": [
        "Browse order history with filters",
        "View individual order details",
        "Aggregate order metrics by time period",
        "Search orders by customer or product"
      ],
      "availableViews": [
        {
          "label": "Order History",
          "type": "list",
          "operationId": "listOrders",
          "fields": [
            { "name": "orderId", "type": "string", "description": "Unique order identifier" },
            { "name": "customerName", "type": "string", "description": "Customer display name" },
            { "name": "total", "type": "number", "description": "Order total in USD" },
            { "name": "status", "type": "enum", "description": "Current order status" },
            { "name": "createdAt", "type": "datetime", "description": "When the order was placed" }
          ],
          "filters": [
            { "name": "status", "type": "enum", "description": "Filter by status", "options": ["pending", "shipped", "delivered", "cancelled"] },
            { "name": "dateRange", "type": "date-range", "description": "Filter by order date" },
            { "name": "minTotal", "type": "number", "description": "Minimum order amount" }
          ],
          "paginated": true
        },
        {
          "label": "Revenue Over Time",
          "type": "time-series",
          "operationId": "getRevenueTimeSeries",
          "fields": [
            { "name": "period", "type": "date", "description": "Time bucket" },
            { "name": "revenue", "type": "number", "description": "Total revenue" },
            { "name": "orderCount", "type": "number", "description": "Number of orders" }
          ],
          "filters": [
            { "name": "granularity", "type": "enum", "description": "Time granularity", "options": ["day", "week", "month"] },
            { "name": "dateRange", "type": "date-range", "description": "Date window" }
          ],
          "paginated": false
        }
      ]
    }
  ]
}
```

### Discovery Flow in Practice

**Step 1 — User or UI agent asks what's available:**
> "What data sources can I work with?"

**Step 2 — Data agent produces the catalog:**
Read the OpenAPI spec, group endpoints by tag, and produce the `DataSourceCatalog` structure above. Each domain becomes a card or section the UI agent can render.

**Step 3 — UI agent renders selectable options:**
The UI agent takes the catalog and shows the user a menu of domains and views — cards, a sidebar, a dropdown, whatever suits the UI pattern.

**Step 4 — User selects a view:**
> "I want to see Order History" (or clicks the card)

**Step 5 — Data agent generates the full contract:**
Using the `operationId` from the selected view, generate the complete data contract (request interface, response interface, fetch blueprint, auth, pagination) as defined in Phase 3 above.

**Step 6 — UI agent builds the component:**
The UI agent receives the contract and builds a table, chart, or dashboard component that fetches data at runtime via the API. Claude never sees the actual data.

### Keeping the Catalog Fresh

- Re-read the OpenAPI spec whenever the user says "refresh" or "the API changed"
- If the spec has a `version` field, include it in the catalog so the UI agent can detect stale contracts
- If endpoints are added or removed, the catalog should reflect the diff

---

## Working with the UI Agent

The UI agent is a separate system that receives these contracts and builds components. Claude's job is to give it everything it needs to know about the API without any ambiguity:

- **What's available**: the data source catalog (discovery protocol above)
- **What to fetch**: method, path, parameters
- **What comes back**: typed response shape
- **How to authenticate**: OAuth flow and scopes
- **How to paginate**: pagination style and params
- **What can go wrong**: error response shapes
- **What the user can filter/sort**: available parameters with types and options

The UI agent handles rendering, state management, and user interaction. Claude handles API comprehension, discovery, and contract generation.

---

## Examples

**User**: "What data sources are available?"
→ Claude reads the OpenAPI spec, groups endpoints by tag, and produces a `DataSourceCatalog` the UI agent renders as selectable cards.

**User**: "Show me the order analytics view"
→ The UI agent passes the selected `operationId` back. Claude generates the full contract for that endpoint, and the UI agent builds the component.

**User**: "Generate data contracts for our user management endpoints"
→ Claude fetches the OpenAPI spec, filters to user-related paths, and produces TypeScript interfaces for list/get/search users with request params and response types.

**User**: "What endpoints are available for the analytics domain?"
→ Claude reads the spec, filters by the `analytics` tag, and presents a summary table of endpoints with their purpose, parameters, and response shapes.

**User**: "The UI agent needs to build a dashboard showing order metrics — what contracts does it need?"
→ Claude identifies the relevant order/analytics endpoints, generates contracts for each, includes pagination and filtering patterns, and bundles them as a handoff package.

---

## Tips

- If the OpenAPI spec is large, ask the user which domain or tag to focus on first
- Always re-fetch the spec when the user says "the API changed" — don't rely on a cached version
- If the spec has `x-` extensions (custom vendor fields), include them in contracts as metadata
- For endpoints that return large datasets, always document the pagination contract
- If response schemas use `oneOf` / `anyOf` / `allOf`, resolve them into a clear discriminated union
