## Unit Test Requirement

For unit tests, we have unit tests for backend API calls in `/starter-code/api/tests` using `mocha` and `supertest`. There is generally a test for each branch and expected outcome of each API call.

## Future Plans with Unit Tests

In the future, we are going to write more unit tests/modify existing unit tests if our API is changed or expanded. This makes it easier to determine if any behavior changes if we change the API and also to make sure that nothing breaks if we change anything in our API's.

## Higher Level Testing

For higher level testing, we use `react-testing-library` and `jest` to test react components to make sure that they behave properly.

## Future Plans with Higher Level Testing

In the future, we plan to use `react-testing-library` to make sure that form submissions and API calls to teh backend receive the correct information and display it on the page. Since we don't really have much time left in the quarter, we only plan to do some tests with this library on parts of our app that communicate with our backend.
