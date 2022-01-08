# Saving Data to MongoDB
- Before talking about databases, we take a look at debugging Node apps.

## Debugging Node Applications
- Harder to debug Node apps than it is to debug JS running in browser.
- The `console.log()` method is tried and true.

#### Visual Studio Code
- VSCode debugger is useful.
    - Launch with `F5` to `Start Debugging`.
    - Note the app should not be running in a different console.
- Newer versions of VSCode may have `Run` instead of `Debug`.
    - May have to configure `launch.json` to start debugging.
    - Choose `Add Configuration...` on drop-down menu.
        - Next to green play button.
        - Above `VARIABLES` menu.
        - Select `Run "npm start" in a debug terminal`.

#### Chrome Dev Tools
- Debugging also done with Chrome developer console by starting app with:
```
node --inspect index.js
```
- Access debugger by clicking green icon - node logo - appearing in the Chrome dev console.
- Set breakpoints in the `Sources` tab.

#### Question Everything
- Be systematic and question everything about where the bug may be.
- Stop and fix before proceeding!

## MongoDB
- Need a DB to store notes indefinitely.
- Most DBs that we are familiar with are relation DBs.
- We will use `MongoDB` which is a `document database`.
- Relational and document databases are different.
    - Organize data differently.
    - Support different query languages.
- Document databases are categorized under the `NoSQL` umbrella term.
- Read chapters on `collections` and `documents` to get a better idea on how a document database stores data.
    - Collections: `docs.mongodb.com/manual/core/databases-and-collections/`
    - Documents: `docs.mongodb.com/manual/core/document/`
- You can install and run MongoDB locally.
    - We will, however, use Mongo database service.
    - Preferred is `MongoDB Atlas`.
- After creating and logging into account, Atlas recommends creating cluster.
    - In latest versions of Atlas, you may see create a database.
- Choose `AWS` as the provider and a region you're close to.
- Create cluster.
- Do not continue before cluster is ready.
- Let's create credentials for app to connect to the database.
    - Click `Database Access` tab.
    - Grant user with permissions to read and write to any database.
- Define the IP addresses that are allowed access to database.
    - All access from anywhere.
- Click `Connect` and choose `Connect your application`.
- You will see the `MongoDB URI`.
    - This is the address of the database that we will supply to the MongoDB client library we will add to our app.
    - Looks like this:
```
mongodb+srv://fullstack:<PASSWORD>@<CLUSTER_NAME>.mongodb.net/test?retryWrites=true
```