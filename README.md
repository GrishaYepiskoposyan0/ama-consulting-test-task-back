# Test Task by Grisha Yepiskoposyan

## Assignment Description

Bank receives monthly deliveries of customer statement records. This information is delivered in two formats, CSV and XML. These records need to be validated.
At the end of the processing, a report needs to be created which will display both the transaction reference and description of each of the failed records.

## What I did?

At first I misunderstood the task, so I spent a day on that and had to set up a new project.

So I developed an application that gets customer statement record file, checks all validation errors, if there are any errors,
writes them in a report file, then we can download that file. I have deployed my application on ***Vercel*** and there was a problem.

1. ***Vercel*** doesn't allow to create file by code. I first developed the ***upload*** endpoint to generate a report file and returned nothing,
    but after that problem I changed it to return validation errors. I saved 2 files there as examples.
    
How do I validate file?
I'm checking references to be unique, also all transactions with the same account number to have valid end balance,
that is sum of start balance and mutation to be equal to end balance, and also next transaction with same account 
number to have start balance equal to previous transaction's end balance.

## Why I used Express with Typescript?

I used express because of its simplicity and typescript because I like typed code.

## How to start application?

1. Install dependencies:

```sh
npm install
```

2. Run application:

```sh
npm start
```
or for dev mode use
```sh
npm run start:dev
```

## Deployment links.
I have developed a frontend application that makes it easy to test the application.

[https://ama-consulting-test-task-front.vercel.app](https://ama-consulting-test-task-front.vercel.app)

## Thank you!!!
