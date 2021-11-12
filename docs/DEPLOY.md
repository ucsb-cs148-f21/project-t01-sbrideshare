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

