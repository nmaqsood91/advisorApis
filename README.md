# Advisor APIs

This repo contains the advisor portal APIs. The APIs are developed using Nodejs, Express and typescript.
Sequelize is used as ORM with Sqlite Database.

This project is built using the MVC (Model-View-Controller) architecture, which separates concerns into distinct layers for better organization and maintainability.

- Routing Layer:

The routing layer is responsible for defining the API endpoints. It handles incoming requests and directs them to the appropriate controller based on the URL and HTTP method. Essentially, it acts as a traffic director for the application, ensuring that each request is processed by the right component.

- Controllers:

Controllers serve as the intermediaries between the routing layer and the service layer. Their primary role is to validate incoming requests, checking for any required parameters and ensuring they conform to expected formats. Once validated, controllers pass the request data to the service layer for further processing. They may also handle responses, formatting the output before sending it back to the client.

- Service Layer:

The service layer contains the core business logic of the application. It processes data and coordinates operations that may involve multiple models or database interactions. This layer ensures that the application's rules and workflows are applied consistently. It serves as the main processing unit, receiving input from controllers, executing business operations, and returning results.

- Models:

Models represent the data structure of the application, often mirroring the database schema. They contain methods that allow interaction with the database, such as querying, inserting, updating, and deleting records. Essentially, models are responsible for data persistence and encapsulate the logic required to manipulate the underlying database.

## Installation

```bash
npm install
```

First time database setup, execute the migrations to setup the table

```
npm run migrate
```

### Documentation

The API docs are available on

```
http://localhost:3000/api/v1/docs/
```

## To Run Server

If the npm install is done successfully the next step is to start the server

```
npm run build && npm run serve

```

## Consume API

The server is running locally on port 3000. The postman collection can be used to call the apis

## Test case

To execute test cases following command can be used.

```
npm test
```

#### Note:

Some of the peer dependencies are out dated because, I tried to update the dependencies but unfortunately some of the packages did not have the new release at the moment, for example sqlite. But there are no security audit warning at the moment.
