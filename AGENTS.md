# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is `@voicenter-team/amqp-logger`, a Node.js library (not an application) that publishes structured log messages to AMQP (RabbitMQ) exchanges. It provides three integration modes: `pastash`, `fastify`, and `winstonTransport`.

### Dependencies

- **Runtime**: Node.js (no specific version pinned; v22+ works)
- **Package manager**: npm (no lockfile in repo)
- **Install**: `npm install`

### Linting & Tests

- No linter is configured. No ESLint, Prettier, or similar tools.
- No test suite exists. `npm test` exits with code 1 by design (`echo "Error: no test specified" && exit 1`).

### Running / Testing the Library

Since this is a library (no `npm start`), testing requires a demo script that imports the module. A RabbitMQ instance is required for the AMQP publish functionality.

**Start RabbitMQ via Docker:**
```bash
sudo docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password \
  rabbitmq:3-management
```

### Config format gotcha

The README examples use a flat channel config format (`exchange_name`, `exchange_type`, `exchange_durable`), but `@voicenter-team/failover-amqp-pool` v1.6.0 expects a **nested** `exchange` object in the channel config:

```js
"channel": {
  "exchange": { "name": "TestE", "type": "fanout", "durable": true },
  "topic": "",
  "options": {}
}
```

Not the flat format shown in the README. This is a known mismatch between the README documentation and the actual dependency version.
