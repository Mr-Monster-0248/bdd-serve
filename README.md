# Server for database project

## API Reference

### Authentification `/auth`

| method | path      | description                   |
| ------ | --------- | ----------------------------- |
| POST   | `/login`  | login with email and password |
| GET    | `/logout` | logout current user           |

### Event gestion `/event`

| method | path   | description          |
| ------ | ------ | -------------------- |
| GET    | `/`    | get all event        |
| GET    | `/:id` | get a specific event |
| POST   | `/add` | add a event          |
| PUT    | `/:id` | update a event       |
| DELETE | `/:id` | delete a event       |

### Patient gestion `/patient`

| method | path   | description            |
| ------ | ------ | ---------------------- |
| GET    | `/`    | get all patient        |
| GET    | `/:id` | get a specific patient |
| POST   | `/add` | add a patient          |
| PUT    | `/:id` | update a patient       |
| DELETE | `/:id` | delete a patient       |
