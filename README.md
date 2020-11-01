[![CI Status](https://github.com/ophiryael/span-query/workflows/CI/badge.svg)](https://github.com/ophiryael/span-query/actions?query=workflow%3ACI)

## Running the app

```
yarn create-dev-db
yarn install
yarn start
```

### Environment variables (=default)

```
SERVER_PORT=5000
DB_CONNECTION_STRING=postgres://spanquery:pgpass@localhost:5432/span-query
```

### TODO

- Input validation
- Error handler middleware (and error types)
