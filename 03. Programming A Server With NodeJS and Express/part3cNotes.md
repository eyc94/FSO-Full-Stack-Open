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

