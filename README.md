# SBRideShare

SBRideShare is a web application that allows UCSB students to register as drivers or riders and view a list of students traveling to similar destinations.

## Group Members:
- Heather Dinh @hdinh77
- Lucien Luc @LucienLuc
- Chris Stasiowski @chrisstasiowski01
- Robert Gee @robertgee17
- Louie Aldana @LouieAldana

## Tech Stack

We decided to use the MERN tech stack. Its a pretty simple and popular frontend and backend stack that fits our needs to store rides and query for rides. 

Users can search for rides as a rider or post a new ride as a driver. Riders searching for a ride would be able to query based on location, price, and times to find the best fit. Drivers would post this information along with their listing to match riders with drivers. Each user would have two profiles for being a driver and rider which would show their ride history.

## User Roles and Permissions

- Riders: Riders should be able to look for rides as well as browse the history and profiles of other users on the app.

- Drivers: Drivers have the ability to post rides which include where they are going, what time they are leaving, and other details about their ride. 

Riders would be able to search for all available rides on the app. Drivers would have the ability to delete their own postings and create new rides. One user can switch between being a driver or rider. These users would be tied to @ucsb Google accounts where each account would have two profiles - one for being a rider and one for being a driver.

## Installation

### Prerequisites
* npm

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
```
and replace `<YOUR MONGODB URI HERE>` with your MongoDB URI. The backend will connect to the URI specified in `MONGO_DB_URI` when running `npm run start`, `MONGO_DB_URI_DEV` when running `nom run dev`, and `MONGO_DB_URI_TEST` when running `npm run test`

* If running from a dev environment, run `npm run dev` to start the backend server on `http://localhost:9000`

#### React Frontend
* In `/starter-code/client` run `npm i`
* In `/starter-code/client` create a file named `.env` with the following variables
```
REACT_APP_AUTH_CLIENT_ID=<YOUR GOOGLE OAUTH ID>
```
and replace `<YOUR GOOGLE OAUTH ID>` with your Google project OAuth URL. 
* In `/starter-code/client` run `npm run dev` to start the frontend server on `http://localhost:3000`

### Functionality
* Exclusive to @ucsb Google emails.
* Add a ride to the database
* See a list of all rides
* Add yourself to a ride, provided that there is enough seats

### Contributing
1. Fork it!
2. Create your feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -am 'Add some feature'
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request :D