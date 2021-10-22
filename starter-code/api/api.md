
# POST /rides

Submits a ride with the specified data.

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
        "seats_available": $Integer
        "driver_id": $UUID 
    }
    ...
]
```

--------
# POST /rides/:ride_id/riders

Adds a rider with `rider_id` to the `riders` array of the ride to the specifed `:ride_id`.

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
