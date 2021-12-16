# Rendering a Collection, Modules

## console.log()
- Experienced programmers use `console.log()` very often.
- Remember not to concatenate in a `console.log()`. Use a comma.

## Protip: Visual Studio Code Snippets
- Easy to create snippets for VSCode.
    - Snippets are shortcuts for quickly generating commonly re-used portions of code.
    - Like `sout` in Netbeans.
- Instructions to create snippets: `https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets`
- There are ready-made snippets as VSCode plugins.
- Most important snippet is for `console.log()`.
    - `clog` can be created like:
```javascript
{
    "console.log": {
        "prefix": "clog",
        "body": [
            "console.log('$1')",
        ],
        "description": "Log output to console"
    }
}
```
- However, using the log function is so common, so VSCode has a snippet built in.
    - Type `log` and tab to autocomplete.