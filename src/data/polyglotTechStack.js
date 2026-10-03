/**
 * BRAHMA Polyglot Full-Stack Architecture & Production Tech Stack Catalog
 * Defines production templates, code synthesis blueprints, and configuration schemas
 * across ALL major programming languages, frontend/backend frameworks, databases, and caching layers.
 */

export const POLYGLOT_TECH_STACKS = {
  frontend: [
    {
      id: 'react-vite',
      name: 'React 18 + Vite',
      language: 'TypeScript / JavaScript',
      description: 'Ultra-fast HMR frontend with Zustand state management and Tailwind CSS styling.',
      features: ['Concurrent Rendering', 'Zustand State', 'Lucide Icons', 'Tailwind CSS']
    },
    {
      id: 'nextjs-app',
      name: 'Next.js 14+ (App Router)',
      language: 'TypeScript',
      description: 'Full-stack SSR/SSG React framework with Server Components and API Routes.',
      features: ['Server Components', 'API Routes', 'SEO Engine', 'Optimized Images']
    },
    {
      id: 'vue-nuxt',
      name: 'Vue 3 + Nuxt 3',
      language: 'TypeScript / JavaScript',
      description: 'Progressive Vue framework with Pinia state management and automatic routing.',
      features: ['Composition API', 'Pinia Store', 'Auto-imports', 'SSR Engine']
    },
    {
      id: 'svelte-kit',
      name: 'Svelte 5 + SvelteKit',
      language: 'TypeScript / JavaScript',
      description: 'Zero-virtual-DOM reactive frontend with instant compile-time performance.',
      features: ['Runes Reactive Engine', 'SvelteKit Routing', 'Scoped CSS', 'Sub-millisecond TTI']
    },
    {
      id: 'angular',
      name: 'Angular 17+',
      language: 'TypeScript',
      description: 'Enterprise scalable frontend with RxJS reactive streams and Signal state.',
      features: ['Signals State', 'Dependency Injection', 'RxJS Streams', 'Angular CLI']
    },
    {
      id: 'vanilla-html',
      name: 'Vanilla HTML5 + Tailwind + ES6',
      language: 'JavaScript / HTML',
      description: 'Lightweight zero-dependency web application architecture.',
      features: ['Zero Build Step', 'Native DOM API', 'Tailwind CDN', 'Sub-10ms Load']
    }
  ],

  backend: [
    {
      id: 'node-express',
      name: 'Node.js + Express.js',
      language: 'JavaScript / TypeScript',
      description: 'High-concurrency event-driven asynchronous REST & SSE API server.',
      features: ['Async/Await Middleware', 'SSE Streaming', 'JWT Authentication', 'Helmet Security']
    },
    {
      id: 'python-fastapi',
      name: 'Python 3.12 + FastAPI',
      language: 'Python',
      description: 'High-performance asynchronous Python REST & OpenAPI framework using Pydantic.',
      features: ['Pydantic V2 Validation', 'AsyncIO Coroutines', 'Swagger Docs', 'SQLAlchemy ORM']
    },
    {
      id: 'python-django',
      name: 'Python + Django REST Framework',
      language: 'Python',
      description: 'Batteries-included enterprise Python web framework with built-in admin & ORM.',
      features: ['Django ORM', 'Admin Dashboard', 'DRF Serializers', 'Celery Async Tasks']
    },
    {
      id: 'go-gin',
      name: 'Go (Golang) + Gin / Fiber',
      language: 'Go',
      description: 'Compiled multi-threaded Go web microservice with sub-millisecond execution.',
      features: ['Goroutine Concurrency', 'Zero-allocation JSON', 'GORM Database', 'Single Binary Build']
    },
    {
      id: 'rust-actix',
      name: 'Rust + Actix-Web / Axum',
      language: 'Rust',
      description: 'Memory-safe, zero-cost abstraction compiled Rust web backend.',
      features: ['Zero GC Overhead', 'Tokio Async Runtime', 'Diesel / SQLx ORM', 'Type-safe Middleware']
    },
    {
      id: 'java-spring',
      name: 'Java 21 + Spring Boot 3',
      language: 'Java',
      description: 'Enterprise production-grade microservice framework with Virtual Threads (Project Loom).',
      features: ['Virtual Threads', 'Spring Data JPA', 'Spring Security', 'Micrometer Telemetry']
    },
    {
      id: 'php-laravel',
      name: 'PHP 8.3 + Laravel',
      language: 'PHP',
      description: 'Elegant PHP web framework with Eloquent ORM, Artisan CLI, and Blade/Vue integration.',
      features: ['Eloquent ORM', 'Artisan CLI', 'Queues & Broadcasts', 'Blade Templates']
    },
    {
      id: 'dotnet-csharp',
      name: 'C# .NET 8 Web API',
      language: 'C#',
      description: 'High-speed Microsoft cross-platform enterprise web API framework.',
      features: ['Entity Framework Core', 'Minimal APIs', 'Dependency Injection', 'Native AOT Compiling']
    }
  ],

  database: [
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      type: 'Relational SQL',
      description: 'Advanced open-source relational database with JSONB vector index support.',
      features: ['ACID Transactions', 'JSONB Storage', 'pgvector Embeddings', 'Foreign Key Invariance']
    },
    {
      id: 'sqlite-wal',
      name: 'SQLite (WAL Mode)',
      type: 'Embedded Relational SQL',
      description: 'Zero-configuration embedded file-based database with Write-Ahead Logging.',
      features: ['Single-file DB', 'WAL Concurrent Reads', 'Zero Server Ops', 'Sub-ms Response']
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      type: 'NoSQL Document Store',
      description: 'Flexible JSON document database with automatic sharding and aggregations.',
      features: ['Schemaless JSON', 'Aggregation Pipeline', 'Change Streams', 'Geo-spatial Indexing']
    },
    {
      id: 'mysql',
      name: 'MySQL / MariaDB',
      type: 'Relational SQL',
      description: 'Battle-tested relational database powering modern web infrastructures.',
      features: ['InnoDB Engine', 'Replication Clusters', 'High Availability', 'Optimized Indexing']
    }
  ],

  cachingAndQueues: [
    {
      id: 'redis',
      name: 'Redis In-Memory Engine',
      type: 'In-Memory Key-Value & Cache',
      description: 'Sub-millisecond in-memory data store for caching, rate limiting, and pub/sub.',
      features: ['Key-Value Cache', 'Pub/Sub Messaging', 'Rate Limiting Bucket', 'Session Store']
    },
    {
      id: 'rabbitmq-kafka',
      name: 'RabbitMQ / Apache Kafka',
      type: 'Distributed Event Streaming',
      description: 'Event-driven message broker for microservices asynchronous communication.',
      features: ['Event Streams', 'Pub/Sub Routing', 'Persistent Logs', 'High Throughput']
    }
  ],

  apiAndProtocols: [
    { id: 'rest', name: 'RESTful HTTP/2 JSON APIs', description: 'Standardized resource endpoints with JSON serialization.' },
    { id: 'graphql', name: 'GraphQL API', description: 'Flexible query language for precision data fetching with Apollo / Strawberry.' },
    { id: 'sse-ws', name: 'WebSockets & Server-Sent Events (SSE)', description: 'Bi-directional real-time push streaming protocols.' }
  ]
};

/**
 * Generate a production full-stack boilerplate code object for any language combination
 */
export function generateFullStackBlueprint({ frontend = 'react-vite', backend = 'node-express', database = 'sqlite-wal' }) {
  const fe = POLYGLOT_TECH_STACKS.frontend.find(f => f.id === frontend) || POLYGLOT_TECH_STACKS.frontend[0];
  const be = POLYGLOT_TECH_STACKS.backend.find(b => b.id === backend) || POLYGLOT_TECH_STACKS.backend[0];
  const db = POLYGLOT_TECH_STACKS.database.find(d => d.id === database) || POLYGLOT_TECH_STACKS.database[0];

  return {
    architectureTitle: `🔱 Full-Stack Blueprint: ${fe.name} + ${be.name} + ${db.name}`,
    frontendStack: fe,
    backendStack: be,
    databaseStack: db,
    supportedLanguages: [fe.language, be.language, db.type].join(' | '),
    productionFeatures: [
      'Zero-Trust Security Shield & Input Sanitization',
      'Unified Database Migrations',
      'Real-Time SSE / WebSocket Stream',
      'In-Memory Redis Caching Tier',
      'Docker Compose Multi-Container Orchestration'
    ]
  };
}
