# 🎮 Playground Monorepo

A playground for a monorepo exploring feature flags and observability.

## 🚀 Features

### 🏴 Feature Flags

- **Library**: [`flags/next`](https://github.com/vercel/flags) for dynamic feature control
- **Implementation**: Middleware-level route protection based on database flag states
- **Caching**: In-memory flag caching with TTL for performance
- **Use Cases**:
  - Enable/disable entire application sections
  - A/B testing capabilities
  - Emergency feature rollbacks

### 📊 Observability

- **Logging**: Winston for structured, production-ready logging
- **tRPC Middleware**: Comprehensive request/response monitoring including:
  - Request duration tracking
  - Error tracking with detailed context
  - Input logging for debugging

## 🧑‍💼 User Impersonation

- **Impersonation Cookie**: Set an `impersonateUser` cookie to specify which user to impersonate.
- **Header Propagation**: The impersonation value is passed in the request header for all API calls.
- **tRPC Context Extraction**: In the tRPC `createContext`, the impersonated user is extracted from the header and used to override the session user for the request.
- **Use Cases**:
  - Internal users can act as other users for support or debugging.
  - All actions performed while impersonating are attributed to the impersonated user.

## 🛠️ Setup & Development

### Local Database

```bash
# Start local Turso database
turso dev --db-file playground.db
```

### Environment Configuration

Update your `.env` file:

```bash
# For local development
DB_URL=http://127.0.0.1:8080

# For production
DB_URL=your-production-turso-url
```

### Running the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev:next
```

## 📁 Project Structure

```
playground-monorepo/
├── apps/
│   └── nextjs/                 # Main Next.js application
│       ├── src/middleware.ts   # Feature flag middleware
│       └── src/module/flags.ts # Flag definitions
├── packages/
│   ├── api/                    # tRPC API with observability
│   ├── db/                     # Database schema & client
│   └── ui/                     # Shared UI components
```

## 🔗 Related Technologies

- [Next.js](https://nextjs.org/) - React framework
- [tRPC](https://trpc.io/) - Type-safe APIs
- [Turso](https://turso.tech/) - Edge SQLite database
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database toolkit
- [Winston](https://github.com/winstonjs/winston) - Logging library
