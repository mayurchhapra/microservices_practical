# Microservice Practice

## Setup

I've created a `Bash` file which will take care of all the required things to be setup.

1. Give permission to setup file by `chmod`

       chmod +x setup.sh

2. execute `setup.sh` file

       ./setup.sh

> Note: This file will create docker Images for Postgres, rabbitmq, Microservice 1, microservice2, Microservice3 and Gateway

## Basic Overview
### Microservice 1 [`m1`] [`Producer`]

The Role of `m1` is to get the file [CSV file] as a input.
And convert it to JSON for better access.

And pass each and every data into the queue. 

    Default Port: 5001
    Endpoint: /v1/upload/

### Microservice 2 [`m2`] [`Receiver`]

This server will receive the data which send from `m1`.

This server will also contain `Knwx` schema. which is used to validate the input.

I've wrote migration to create table.

And once the queue receives the data, we're inserting the data into 

employee table.

    Default Port: 5002
    Endpoint: N/A

### Microservice 3 [ m3 ]

This server is uses to retrieve data from the database.

    Default Port: 5003
    Endpoint: N/A

## Gateway
Gateway is the server which is the main endpoint of the whole setup.
It has the configuration to communicate with the above Microservices.

    Default Port: 5003
    Endpoint: N/A

### API Listing

* CSV file

      URL:    http://host:3000/uploads
      Method: POST

      Body:
            keyName: fileName
            keyType:  file

      cURL: curl --location --request POST 'localhost:3000/upload/' \
            --form 'fileName=@"file/path/employee.csv"'

* List all the Employee with filers

      URL:    https://localhost:3000/getEmployee?page=2&limit=20&search=ms
      Method: GET

      Query Params: 
            keyName1: page
            value: number

            keyName2: limit
            value: number

            keyName3: search
            value: string

