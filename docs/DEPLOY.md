## Installation

### Prerequisites
* npm
Make sure you have node and npm installed. You can check that by running "node -v" and "npm -v" on your computer. If no versions of node or npm appear on your computer, you can download them here: https://nodejs.org/en/.

### Dependencies
* MongoDB
* Google OAuth

### Installation Steps

#### Express Backend
* In `/starter-code/api` run `npm i`
* In `/starter-code/api` create a file named `.env` with the following variables
```
MONGO_DB_URI=<YOUR MONGODB URI HERE>
MONGO_DB_URI_DEV=<YOUR MONGODB URI HERE>
MONGO_DB_URI_TEST=<YOUR MONGODB URI HERE>
GOOGLE_API_KEY=<YOUR GOOGLE API KEY HERE>## Installation

### Prerequisites
* npm
    * Make sure you have node and npm installed. You can check that by running "node -v" and "npm -v" on your computer. If no versions of node or npm appear on your computer, you can download them here: https://nodejs.org/en/.

### Dependencies
* MongoDB
* Google OAuth

### Installation Steps

#### Express Backend
* In `/starter-code/api` run `npm i`
* In `/starter-code/api` create a file named `.env` with the following variables
```
MONGO_DB_URI=<YOUR MONGODB URI HERE>
MONGO_DB_URI_DEV=<YOUR MONGODB URI HERE>
MONGO_DB_URI_TEST=<YOUR MONGODB URI HERE>
GOOGLE_API_KEY=<YOUR GOOGLE API KEY HERE>
```
and replace `<YOUR MONGODB URI HERE>` with your MongoDB URI. The backend will connect to the URI specified in `MONGO_DB_URI` when running `npm run start`, `MONGO_DB_URI_DEV` when running `npm run dev`, and `MONGO_DB_URI_TEST` when running `npm run test`. For more info on setting up MongoDB, refer below to the "Setting up MongoDB" section.
Also, replace `<YOUR GOOGLE API KEY HERE>` with the Google API key you generate later on. Refer below to the "Generating Keys" section for a guide on how to generate this.

* If running from a dev environment, run `npm run dev` to start the backend server on `http://localhost:9000`

#### Setting up MongoDB
In the MongoDB dashboard, hit the green "+ Create" button on the top right to create a new cluster. Leave everything on default settings. Next, go to the "Database Access" section under "Security" on the left side. Hit "+ Add New Database User" and fill out the username and password fields using the password authentication method for the user. Keep the password somewhere you can copy paste for a future step. Leave all other settings on default.

Go to the "Network Access" dashboard and hit "+ Add New Ip Address". For now, allow MongoDB Atlas to accept all incoming connections by adding the IP `0.0.0.0/0`. 

Go to the "Databases" dashboard and hit "Connect" on your newly created cluster. Select "Connect Your Application". The MongoDB URI should be displayed here and should look something like `mongodb+srv://<username>:<password>@cluster0.gikbx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`. Replace `<username>` and `<password>` with your created credentials. You can also change the database name from `myFirstDatabase` to anything you like.

#### Generating Keys
The next step is to setup the "client_id" for your app in the ".env". Go to this link: https://console.cloud.google.com/apis/credentials and create a project. In the OAuth consent screen, you should set the user type to "external." Now go ahead to the "credentials" screen and add a new "OAuth Client ID."

**When adding an "OAuth Client ID," add it for a "web application" and remember to set the "Authorized JavaScript origins" and "Authorized redirect URIs" to "http://localhost:3000" and "https://localhost:3000".**

Next, head over to your project dashboard, press on "Enable APIs & Services" at the top. Search for Places API, Maps JavaScript API, and Geocoding API, and enable them all for your project. Normally, this step would require a credit card on file to enable these APIs.

Now head back to the project credentials section, and add an API key using the "Create Credentials" selection at the top, then make sure key that is generated applies to all three of the APIs you just added.

#### React Frontend
* In `/starter-code/client` run `npm i`
* In `/starter-code/client` create a file named `.env` with the following variables
```
REACT_APP_AUTH_CLIENT_ID=<YOUR GOOGLE CLIENT ID>
```
and replace `<YOUR GOOGLE CLIENT ID>` with the Google project client ID you created above. 
* In `/starter-code/client` run `npm run dev` to start the frontend server on `http://localhost:3000`

#### Heroku Deployment
Go to https://www.heroku.com/, which is a FREE cloud platform to host your app to the web. You will need to create two Heroku projects, one for the frontend and one for the backend. For the frontend, go to the settings. In "Config Vars", add a key called "PROJECT_PATH" and "REACT_APP_AUTH_CLIENT_ID". "PROJECT_PATH" will have a key value of "starter-code/client" and "REACT_APP_AUTH_CLIENT_ID" will have the Google project client ID you previously generated. 
For the backend, you will have to make a "MONGODB_URI" key with a value of your MongoDB URI generated previously, and a "PROJECT_PATH" key with a value of "starter-code/api". 
Also, you will need to add two buildpacks to both deployments: "https://github.com/timanovsky/subdir-heroku-buildpack" and "heroku/nodejs". The subdirectory buildpack will have to be on top. 
Make sure that you committed and pushed your changes onto your github repo. Link the github repo and deploy the projects.

Remember to add the name of your website into "Authorized JavaScript origins" and "Authorized redirect URIs" of your OAuth consent screen!


```
and replace `<YOUR MONGODB URI HERE>` with your MongoDB URI. The backend will connect to the URI specified in `MONGO_DB_URI` when running `npm run start`, `MONGO_DB_URI_DEV` when running `npm run dev`, and `MONGO_DB_URI_TEST` when running `npm run test`.
Also, replace `<YOUR GOOGLE API KEY HERE>` with the Google API key you generate later on. Refer below to the "Generating Keys" section for a guide on how to generate this.

* If running from a dev environment, run `npm run dev` to start the backend server on `http://localhost:9000`

#### Generating Keys
The next step is to setup the "client_id" for your app in the ".env". Go to this link: https://console.cloud.google.com/apis/credentials and create a project. In the OAuth consent screen, you should set the user type to "external." Now go ahead to the "credentials" screen and add a new "OAuth Client ID."

**When adding an "OAuth Client ID," add it for a "web application" and remember to set the "Authorized JavaScript origins" and "Authorized redirect URIs" to "http://localhost:3000" and "https://localhost:3000".**

Next, head over to your project dashboard, press on "Enable APIs & Services" at the top. Search for Places API, Maps JavaScript API, and Geocoding API, and enable them all for your project. Normally, this step would require a credit card on file to enable these APIs.

Now head back to the project credentials section, and add an API key using the "Create Credentials" selection at the top, then make sure key that is generated applies to all three of the APIs you just added.

#### React Frontend
* In `/starter-code/client` run `npm i`
* In `/starter-code/client` create a file named `.env` with the following variables
```
REACT_APP_AUTH_CLIENT_ID=<YOUR GOOGLE CLIENT ID>
```
and replace `<YOUR GOOGLE CLIENT ID>` with the Google project client ID you created above. 
* In `/starter-code/client` run `npm run dev` to start the frontend server on `http://localhost:3000`

#### Heroku Deployment
Go to https://www.heroku.com/, which is a FREE cloud platform to host your app to the web. You will need to create two Heroku projects, one for the frontend and one for the backend. For the frontend, go to the settings. In "Config Vars", add a key called "PROJECT_PATH" and "REACT_APP_AUTH_CLIENT_ID". "PROJECT_PATH" will have a key value of "starter-code/client" and "REACT_APP_AUTH_CLIENT_ID" will have the Google project client ID you previously generated. 
For the backend, you will have to make a "MONGODB_URI" key with a value of your MongoDB URI generated previously, and a "PROJECT_PATH" key with a value of "starter-code/api". 
Also, you will need to add two buildpacks to both deployments: "https://github.com/timanovsky/subdir-heroku-buildpack" and "heroku/nodejs". The subdirectory buildpack will have to be on top. 
Make sure that you committed and pushed your changes onto your github repo. Link the github repo and deploy the projects.

Remember to add the name of your website into "Authorized JavaScript origins" and "Authorized redirect URIs" of your OAuth consent screen!

