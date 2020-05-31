# Server for database project

## API Reference

### Authentification `/auth`

| method | path           | description                             | response   |
| ------ | -------------- | --------------------------------------- | ---------- |
| POST   | `/login`       | login with email and password           | auth-token |
| POST   | `/login-admin` | login with email and password for admin | auth-token |
| GET    | `/logout`      | logout current user                     | boolean    |

### Session management `/session`

| method | path   | description            | response                |
| ------ | ------ | ---------------------- | ----------------------- |
| GET    | `/`    | get all session        | array of session object |
| GET    | `/:id` | get a specific session | session object          |
| POST   | `/add` | add a session          | boolean                 |
| PATCH  | `/:id` | update a session       | boolean                 |
| DELETE | `/:id` | delete a session       | boolean                 |

### Patient management `/patient`

| method | path   | description            | response                |
| ------ | ------ | ---------------------- | ----------------------- |
| GET    | `/`    | get all patient        | array of patient object |
| GET    | `/:id` | get a specific patient | patient object          |
| POST   | `/add` | add a patient          | boolean                 |
| PATCH  | `/:id` | update a patient       |                         |
| DELETE | `/:id` | delete a patient       | boolean                 |
