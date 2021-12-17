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

## JavaScript Arrays
- We will be using the functional programming methods of arrays.
    - `find`, `filter`, and `map`.
- These videos will help: `https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84`
    - Higher Order Functions: `https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84`
    - Map: `https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=3`
    - Reduce Basics: `https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s`

## Event Handlers Revisited
- Look at the previous part's explanation.
- Can also find information on passing event handlers to child components.

