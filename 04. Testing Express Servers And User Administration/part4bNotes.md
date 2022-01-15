# Testing The Backend
- Start writing tests for the backend.
- Doesn't make sense to write `unit tests` for this because there is no complicated logic.
- Only thing we can possibly unit test for is the `toJSON` method used for formatting notes.
- Can be good to implement some of the backend tests by mocking the database and not using a real one.
    - One library used for this is `mongo-mock`.
- Backend application is simple.
    - We will test entire app through its REST API.
    - Database is also included.
    - Testing multiple components of the system as a group is called `integration testing`.

