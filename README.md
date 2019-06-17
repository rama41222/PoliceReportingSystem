# Stolen Bikes

[![Build Status](https://travis-ci.com/rama41222/PoliceReportingSystem.svg?token=uEvpxZqxzddnYWiCyvCy&branch=master)](https://travis-ci.com/rama41222/PoliceReportingSystem)

Stolen bikes are a typical problem in Berlin. This is a way of automating the stolen bike cases for the efficient 
handling of reported cases.

# Overview
* Requirements
* Design Discussion 
* Edge Cases

# Installation
1. Install redis on your system
2. Start redis 
3. Install MSSQL on your system ( use docker)
4. Create a table called stolen in MSSQL database
5. Goto `src/migrations/config/config.json` and fill out the required information
6. Run the migrations from root directory
    ```
     sequelize db:migrate
    ```
7. Goto the docs folder and use the provided postman collection to interact with the API

# TODO
1. Automated Deployments using docker.
2. Properly configure travis.
3. Increase the test coverage.
4. Load testing the application.
5. Implement caching service using redis.

# Requirements 

* Report a Stolen bike
* Assign a reported case to a free policeman (1 policeman can take 1 case maximum)
* Resolve the case (Find the stolen bike)

# Design Discussion

This consists of the following sections.

* Assumptions
* Algorithms
    * Reporting
    * Next Available Policeman
    * Resolving a case
* Endpoints
* Database Design

To handle issues when there are multiple processes of the application running, the system locks the database when 
necessary which will prevent any race conditions. The system uses REDIS LIST data structure to maintain the required 
queues. 

## Assumptions
* The design assumes that cases should be solved in the order of receiving, therefore a **QUEUE** data structure will 
be used.

## Algorithms

### Reporting

1. Call Create Report Endpoint
2. Check if Police officer is available
3. If not **QUEUE** the request and store it in database
4. If available assign the police officer and store it in database

### Get the next available policeman

* Initially when the users are being seeded, the system must **enqueue** the free police officer into the queue.
For this, a limit can me imposed to optimize the memory usage.
* Whenever this method is called, initially dequeue a police officer and enqueue a new police officer into the queue 
from database.

### Resolve a case
1. Call the Resolution endpoint with case id
2. Set the report state to resolved
3. Deallocate police officer 
4. Check if pending reports are available in reports queue
5. If yes, allocate the police officer into the report 
6. Else enqueue into the available police officers queue.

## Endpoints

* This API should contain the following endpoints
    ``` 
        POST /reports - File a case
        PATCH /reports/:id/resolve - Resolve a case        
    ```
* Other than the above mentioned endpoints, the frontend might need the following to display the data
    ```
        GET /reports/:id - Get the case by id
        GET /reports - Get all cases
        GET /users/:id/reports - Get the assigned report for a police officer
        GET /users/ - All users
        GET /users?type=police - Get all police officers
    ```
    
## Database Design

There will be 2 main entities of the system, 

* Users (Police officers and Reporters)
```
{
 name: '',
 type: ENUM('POLICE', 'REPORTER')
}

Policeman extends User {
 isAssigned: '',
}

```
 * Report (case)
```
{
user: '',
assignee: '',
reg_no: '',
color: '',
stolen_date: '',
description: ''
}
```

# Edge cases

* What happens if all the policemen are occupied
