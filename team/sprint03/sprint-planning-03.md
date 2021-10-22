# Sprint Planning
* Meeting Time: 10-18-21

## Sprint Goal
This sprint we planned on getting the features we needed done before the MVP code freeze next week. Stories and issues were focused on connecting the frontend with the backend, making basic API's, and displaying/submitting information.

## Team Attendance 
[x] Chris Stasiowski
[x] Heather Dinh
[] Louie Aldana (messaged on Slack)
[x] Lucien Luc
[x] Robert Gee

## Stories and Issues

* As a driver, I can fill out the Ride form to submit an upcoming ride to be added to the database.
    * Make an API to submit a ride to the database
    * Connect responses from Ride form to MongoDB--call the backend API from the frontend.
    * Format the inputs of the Ride form correctly ($, int inputs).
* As a rider, I can sign up for a ride.
    * Make an API to add a rider to a ride
    * Add a button on the specific Ride that triggers the API to add rider to that ride.
* Create a "My Rides" page that shows user's upcoming rides and drives, calls API to get list of user's rides and drives. 
    * Create the "My Rides" page to show all the user's rides and drives.
    * Make an API to get list of a user's rides that they are signed up for
    * Make an API to get a user's drives
* As a rider, I can query for rides.
    * Make an API to search for rides
