# Server for database project

## API Reference

### Authentification `/auth`

| method | path           | description                             | response   |
| ------ | -------------- | --------------------------------------- | ---------- |
| POST   | `/login`       | login with email and password           | auth-token |
| POST   | `/login-admin` | login with email and password for admin | auth-token |
| GET    | `/logout`      | logout current user                     | boolean    |

### Event gestion `/event`

| method | path   | description          | response |
| ------ | ------ | -------------------- | -------- |
| GET    | `/`    | get all event        |          |
| GET    | `/:id` | get a specific event |          |
| POST   | `/add` | add a event          |          |
| PUT    | `/:id` | update a event       |          |
| DELETE | `/:id` | delete a event       |          |

### Patient gestion `/patient`

| method | path   | description            | response                |
| ------ | ------ | ---------------------- | ----------------------- |
| GET    | `/`    | get all patient        | array of patient object |
| GET    | `/:id` | get a specific patient | patient object          |
| POST   | `/add` | add a patient          | boolean                 |
| PUT    | `/:id` | update a patient       |                         |
| DELETE | `/:id` | delete a patient       | boolean                 |
