# Table of Contents
## /rides
* [POST /rides](#POST-/rides)
* [GET /rides](#GET-/rides)
* [PATCH /rides/:ride_id](PATCH-/rides/:ride_id)
* [POST /rides/:ride_id/riders](POST-/rides/:ride_id/riders)
* [DELETE /rides/:ride_id/riders/:rider_id](DELETE-/rides/:ride_id/riders/:rider_id)


## /users
* [POST /users](POST-/users)
* [GET /users/:user_id](GET-/users/:user_id)
* [GET /users/:user_id/drives](GET-/users/:user_id/drives)
* [GET /users/:user_id/rides](GET-/users/:user_id/rides)

--------
# POST /rides

Submits a ride with the specified data. Also adds a reference to this ride of the user `driver_id` rides array.

## Request

```
{
    "name": $String, //Required. 
    "leave_datetime": $String, //Required. Must be in ISO8601 format.
    "start_location": $String, //Required.
    "end_location": $String, //Required.
    "price": $Double, //Required. Cannot be negative.
    "seats_available": $Integer, //Required. Must be greater than 1.
    "driver_id": $UUID //Required. 
}
```

## Response

Returns a HTTP 200 Success if submitted.

## Errors

* 400 Bad Request
    * Something is wrong with the input request
* 404 Not Found
    * The user with the specified `driver_id` cannot be found
* 500 Internal Server Error
    * The server could not save the request to MongoDB

--------
# GET /rides

Retrieves an array of all rides. Note: Future implementation will allow search queries

## Request
```
{
    //empty object or no object
}
```

## Response
```
[
    {   
        "name": $String,
        "leave_datetime": $String, // In ISO8601 format.
        "start_location": $String, 
        "end_location": $String, 
        "price": $Double, 
        "seats_available": $Integer,
        "riders": $Array,
        "driver_id": $UUID 
    }
    ...
]
```

--------
# PATCH /rides/:ride_id

Updates an existing ride with new values. Values not specified are kept the same.

## Request
```
{
    "leave_datetime": $String, // In ISO8601 format.
    "start_location": $String, 
    "end_location": $String, 
    "price": $Double, 
    "seats_available": $Integer
}
```

## Response
Returns HTTP 200 Success if successfully updated. 

* 400 Bad Request
    * Something is wrong with the input request
* 404 Not Found
    * `:ride_id` is invalid or does not exist


--------
# POST /rides/:ride_id/riders

Adds a rider with `rider_id` to the `riders` array of the ride to the specifed `:ride_id`. Also adds to the user `rider_id` rides array.

## Request

```
{
    "rider_id": $UUID, //Required. 
}
```

## Response

Returns HTTP 200 Success if successfully added to array.

## Errors

* 400 Bad Request
    * Something is wrong with the input request
* 404 Not Found
    * `:ride_id` is invalid or does not exist
* 409 Conflict
    * The `rider_id` is already in the `rider` array
    * There are no more available seats for the ride

--------
# DELETE /rides/:ride_id/riders/:rider_id

Removes the rider with `rider_id` from the `riders` array of the ride of the specifed `ride_id`. Also removes ride from user `rider_id` rides array.

## Request

```
{
    // Empty request
}
```

## Response

Returns HTTP 200 Success if successfully removed from array.

## Errors

* 400 Bad Request
    * Something is wrong with the input request
* 404 Not Found
    * `:ride_id` is invalid or does not exist
* 409 Conflict
    * The `rider_id` is not in the `rider` array

--------

# POST /users

Submits a user with the specified data.

## Request

```
{
    "full_name": $String, //Required. 
    "given_name": $String, //Required.
    "family_name": $String, //Required.
    "id": $UUID, //Required.
    "email": $String, //Required.
}
```

## Response

Returns a HTTP 200 Success if submitted.

## Errors

* 400 Bad Request
    * Something is wrong with the input request
* 500 Internal Server Error
    * The server could not save the request to MongoDB

--------
# GET /users/:user_id

Gets information with `user_id`

## Request
```
{
    //empty object or no object
}
```

## Response
```
{   
    "full_name": $String, 
    "given_name": $String,
    "family_name": $String,
    "email": $String,
    "id": $UUID,
    "drives": $Array,
    "rides": $Array,
    "history": $Array 
}
```

## Errors

* 404 Bad Request
    * `user_id` does not exist
* 500 Internal Server Error
    * The server could not save the request to MongoDB

--------
# GET /users/:user_id/drives

Gets the array of the user's drives.

## Request

```
{
    // empty object or no object
}
```

## Response

```
[
    {
        "name": $String,
        "leave_datetime": $String, // In ISO8601 format.
        "start_location": $String, 
        "end_location": $String, 
        "price": $Double, 
        "seats_available": $Integer,
        "riders": $Array,
        "driver_id": $UUID 
    }
    ...
]
```
## Errors

* 404 Bad Request
    * `user_id` does not exist
* 500 Internal Server Error

--------
# GET /users/:user_id/rides

Gets the array of the user's rides.

## Request

```
{
    // empty object or no object
}
```

## Response

```
[
    {
        "name": $String,
        "leave_datetime": $String, // In ISO8601 format.
        "start_location": $String, 
        "end_location": $String, 
        "price": $Double, 
        "seats_available": $Integer,
        "riders": $Array,
        "driver_id": $UUID 
    }
    ...
]
```
## Errors

* 404 Bad Request
    * `user_id` does not exist
* 500 Internal Server Error