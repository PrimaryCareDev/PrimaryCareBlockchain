## Installation

This project is made up of two nodejs projects in two different folders

* frontend - create-react-app application for the frontend website
* backend - nodejs (express) server

run npm install in both folders.

```bash
cd frontend
npm install
cd ../backend
npm install
```

## Explanation and Setup

There are several components of this web app, and several services it relies on:

* The "frontend" folder contains React app that needs to be hosted on a public URL (e.g. netlify)
* The "backend" folder contains a nodejs (express) server that needs to be hosted somewhere (e.g. heroku) for frontend to access
* A Firebase project, which is used for authentication purposes, and storage of some images (e.g. avatar)
* A PostgresSQL database
  * On the backend nodejs app, Prisma ORM is used to manage database connections (https://www.prisma.io/)
* A Stripe project to handle payments
  * Basic implementation of Stripe Checkout is integrated in this project
  * Do note that only test-mode is available. Modifications might be necessary to process actual Stripe transactions.
  * A Stripe webhook is available in the backend project
* API keys from the International Classification of Diseases (ICD) tool for searching of diagnostic codes
  * https://icd.who.int/icdapi

In order to store the various secrets and API keys for these services, environment variables need to be setup on both the frontend and backend. During development, these are stored in .env files in the "frontend" and "backend" folders respectively. The .env files are NOT included in the repo itself, but are detailed here:

###Frontend .env file

This should be saved in a ".env.local" file in the "frontend" folder. (Remove all //comments)

```text

REACT_APP_FIREBASE_API_KEY = "xxxxx....." //Firebase API key
REACT_APP_FIREBASE_AUTH_DOMAIN = "xxxxx.firebaseapp.com" //Firebase auth domain
REACT_APP_FIREBASE_DATABASE_URL = "https://xxxxx.firebaseio.com" //Firebase database URL (not needed)
REACT_APP_FIREBASE_PROJECT_ID = "xxxxx" //Firebase project ID
REACT_APP_FIREBASE_STORAGE_BUCKET = "xxxxx.appspot.com" //Firebase storage bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = "xxxxx" //Firebase messaging sender ID
REACT_APP_FIREBASE_APP_ID = "xxxxxxxx" //Firebase app id
REACT_APP_LOCAL_API_URL="http://localhost:5000" //URL of backend server during local development
REACT_APP_PROD_API_URL="https://xxx-backend.com" //URL of hosted/deployed backend server (used when deployed)
REACT_APP_API_IS_PROD="false" //false if connecting to local dev server, true if connecting to hosted server
```

###Backend .env file

This should be saved in a ".env" file in the "backend" folder. (Remove all //comments)

```text

FIREBASE_CREDS={"type": "service_account","project_id": ......"} //full Firebase creds in JSON format
FIREBASE_STORAGE_BUCKET = "xxxxx.appspot.com" //Firebase storage bucket
DATABASE_URL="postgres://...." //DB connection to PostgresSQL database used for data storage
SHADOW_DATABASE_URL="postgres://....." //PostgresSQL connection, only used for development purposes. Refer to Prisma documentation for more info
ICD_CLIENT_ID="xxxxx" //ICD tool client ID
ICD_CLIENT_SECRET="xxxxx" //ICD tool client secret
DOMAIN="http://localhost:3000" //URL of the frontend webpage. Used by Stripe to redirect back to website after purchase. Change to actual URL after deployment
STRIPE_PUBLISHABLE_KEY="xxxxx" //Stripe publishable key
STRIPE_SECRET_TEST_KEY="xxxxx" //Stripe secret test key
STRIPE_WEBHOOK_SECRET="xxxxx" //Stripe webhook secret
```

##Basic Development Instructions

To launch both frontend webpage and backend server locally:

```bash
cd frontend
npm run start
cd ../backend
npm run devstart
```

To deploy, just deploy the "frontend" folder as a React app, and deploy the "backend" folder as a nodejs app.

## License
[MIT](https://choosealicense.com/licenses/mit/)