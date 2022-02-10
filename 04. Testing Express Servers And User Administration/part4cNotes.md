# User Administration
- Add user authentication and authorization.
- Users stored in DB.
- Notes linked to user who created it.
- Deleting and editing only allowed for the user who created it.
- Add information about users to the DB.
    - There is a one-to-many relationship between User and Note.
- Implementation is straightforward in a relational DB.
- Many different ways of modeling situation in document DB (non-relational).
- Currently, we have notes in a `notes` collection in the DB.
    - If we don't want to make changes to it, we need new collection for the `users`.
    - Can use object id's in Mongo to reference documents in other collections.
    - This is like a foreign key reference in relational DBs.
- Mongo does not support join queries like relational DBs do.
    - They have `lookup aggregation queries` but this is not discussed here.
- We will just make multiple queries if needed.
    - Mongoose takes care of joining and aggregating data.

