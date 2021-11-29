# Table of Contents
## /rides
* [POST /rides](#-post-/rides)
* [GET /rides](#-get-/rides)
* [PATCH /rides/:ride_id](#-patch-/rides/:ride_id)
* [POST /rides/:ride_id/riders](#-post-/rides/:ride_id/riders)
* [DELETE /rides/:ride_id/riders/:rider_id](#-delete-/rides/:ride_id/riders/:rider_id)


## /users
* [POST /users](#-post-/users)
* [GET /users/:user_id](#-get-/users/:user_id)
* [GET /users/:user_id/drives](#-get-/users/:user_id/drives)
* [GET /users/:user_id/rides](#-get-/users/:user_id/rides)

## /locations
* [GET /locations](#-get-/locations)
--------
# POST /rides

Submits a ride with the specified data. Also adds a reference to this ride of the user `driver_id` rides array.

## Request

```
{
    "name": $String, //Required. 
    "leave_datetime": $String, //Required. Must be in ISO8601 format.
    "start_location": $String, //Required. Must be a valid placeid from Google Places API.
    "end_location": $String, //Required.  Must be a valid placeid from Google Places API.
    "rider_radius": $Integer, //Required. Max distance driver is willing to pick up and dropoff riders from driver's intended destination. Set to 0 if driver will not pick people up.
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
    * The start_location is not a valid placeid
    * The end_location is not a valid placeid

--------
# GET /rides

Queries for rides. Returns rides which satisfy the provided request params.

## Request
```
{
    //empty object or no object
}
```

## Params

Append optional parameters by adding `?{param}={value}` to the request URL. Append multiple parameters by putting an ampersand (&) between each parameter.

Example: `/rides?min_leave_datetime=2021-10-14T00:07:46.443Z&min_price=10`

| parameter             | value                 |
| --------------------- | --------------------- |
| min_price             | Number                |
| max_price             | Number                |
| min_leave_datetime    | ISO8601               |
| max_leave_datetime    | ISO8601               |
| start_location        | valid Google place_id |
| start_location_radius | Number                |
| end_location          | valid Google place_id |
| end_location_radius   | Number                |

## Response
```
[
    {   
        "name": $String,
        "leave_datetime": $String, // In ISO8601 format.
        "start_location": 
        {
            formatted_address: $String,
            lat: $Double,
            lng: $Double
        }, 
        "end_location":
        {
            formatted_address: $String,
            lat: $Double,
            lng: $Double
        },
        "price": $Double, 
        "rider_radius": $Integer,
        "seats_available": $Integer,
        "riders": {
            "rider_id": $UUID,
            "pickup_address": $String
            "note_to_driver": $String
        },
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
    "start_location": $String, // Must be valid place_id
    "end_location": $String, // Must be valid place_id
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
    "pickup_address": $String // Required if `:ride_id` has `rider_radius` not equal to 0. A valid place_id.
    "note_to_driver": $String //Optional.
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
    * Rider has not specified a pickup address where the ride requires it
    * Rider has input a pickup address when the driver will not pickup

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
    "image_url": $String, // Required.
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
    "image_url": $String,
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
        "start_location": 
        {
            formatted_address: $String,
            lat: $Double,
            lng: $Double
        }, 
        "end_location":
        {
            formatted_address: $String,
            lat: $Double,
            lng: $Double
        },
        "rider_radius": $Integer,
        "price": $Double, 
        "seats_available": $Integer,
         "riders": {
            "rider_id": $UUID,
            "pickup_address": $String
            "note_to_driver": $String
        },
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
        "start_location": 
        {
            formatted_address: $String,
            lat: $Double,
            lng: $Double
        }, 
        "end_location":
        {
            formatted_address: $String,
            lat: $Double,
            lng: $Double
        },
        "rider_radius": $Integer,
        "price": $Double, 
        "seats_available": $Integer,
         "riders": {
            "rider_id": $UUID,
            "pickup_address": $String
            "note_to_driver": $String
        },
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
# GET /locations

Returns Google place information from an input query.

## Request

```
{
   // Empty object or no object.
}
```

# Params
| parameter | value  |
| --------- | ------ |
| input     | String |


## Response

Note: Only important components included. See full sample response in `./get-locations.response`
```
{
    "predictions": //Only returns up to 5 
    [
        "description": $String // This is the formatted address
        "place_id": $String, // This is the place_id to pass in to start_location and end_location in POST /rides
    ]
    ...
}
```
## Errors

* 404 Bad Request
    * `input` is required
* 500 Internal Server Error