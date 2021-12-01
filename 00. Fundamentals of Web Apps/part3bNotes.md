# Part 3B Notes

## Fundamentals of Web Apps
- Examine example application at `https://studies.cs.helsinki.fi/exampleapp`.
- This example shows a basic concepts of this course.
- Considered old technique of web development and bad practice.
- Open site with the Developer Console open. Open the Network tab and click "Disable cache".

## HTTP GET
- Server and web browser communicate with each other via HTTP protocol.
- Network tab shows this communication.
- You can see many events happening in Network tab.
    - Browser fetches contents.
- Click events to see more about what's happening.
- Click the main app's event.
- The Headers tab shows some information.
    - The General section.
        - Shows the URL the request is made to.
        - We can see the request method as GET.
        - We see the request was successful with a status code of 200.
    - The Response Headers section.
        - Somtimes it shows size of response in bytes.
        - Shows exact time of response.
        - Content-Type shows response is a text/html file in utf-8 format. This helps browser know that the response is HTML and prepares as such.
        - Response tab shows the response as a regular HTML page.
- The app also needs to make a separate request to the image, kuva.png.
    - It is shown that an HTTP GET request is successful.
    - The Response Headers show the same information such as size of response, type of response, and time of response.
- The flow of information is as follows:
    1. The browser makes an HTTP GET request for the main app.
    2. The server sends HTML code back to the browser as a response.
    3. The browser makes another HTTP GET request for the image file.
    4. The server sends the image back to the browser as a response.
    5. The browser then displays a page with the image.

## Traditional Web Applications
- Home page is like a traditional app.
- Browser fetches HTML from server when entering page.
- Server forms the document somehow.
    - Document can be static text.
    - Server can also serve HTML files dynamically with data from database.
- The example app's server serves HTML files dynamically because it contains information on the notes.
- The HTML code of homepage is:
```javascript
const getFrontPageHtml = (noteCount) => {
    return (`
        <!DOCTYPE html>
        <html>
            <head>
            </head>
            <body>
                <div class="container">
                    <h1>Full stack example app</h1>
                    <p>number of notes created ${noteCount}</p>
                    <a href="./notes">notes</a>
                    <img src="kuva.png" width="200"/>
                </div>
            </body>
        </html>
    `)
}

app.get('/', (req, res) => {
    const page = getFrontPageHtml(notes.length);
    res.send(page);
});
```
- Code above uses a template string to hold a template of HTML that changes the note count.
- Dynamic part is the `noteCount` variable. This is the `notes.length` parameter.
- Writing HTML in the middle of code is not smart but was the norm in PHP.
- Browser fetches data from server.
- Servers can be formed using Java Spring, Python Flask, Ruby on Rails, etc.
- The example uses `Express` from `Node.js`.

## Running Application Logic on the Browser
- When going to the notes page, there are multiple HTTP requests.
- We can see they have different types as well.
    - We see document which is the HTML code of the page.
    - Notice this document does not have any notes but a script tag linking to a JS file.
- The javascript code that it links is as follows:
```javascript
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.responseText);
        console.log(data);

        var ul = document.createElement('ul');
        ul.setAttribute('class', 'notes');

        data.forEach(function(note) {
            var li = document.createElement('li');

            ul.appendChild(li);
            li.appendChild(document.createTextNode(note.content));
        });

        document.getElementById('notes').appendChild(ul);
    }
};

xhttp.open('GET', '/data.json', true);
xhttp.send();
```
- This is not the modern way of implementing this.
- Browser executes the code after getting JS file.
- The last few lines opens a GET request to the data.json file.
- Can install plugins to view JSON nicely in Chrome.
- JS code downloads JSON and makes bullet point list out of the data.

## Event Handlers and Callback Functions
- Notice that code to send request to server is the last line.
- The code to handle response is found further up.
- Notice the event handler for event `onreadystatechange` defined for xhttp object doing request.
- When state of object changes, browser calls event handler function.
- Function code checks the `readyState` equals 4 for operation complete and that HTTP status code of response is 200.
- Event handler functions are callback functions.
- Browser calls function when event occurs.

## Document Object Model or DOM
- Think of HTML pages as tree structures.
- DOM is an Application Programming Interface (API) which enables programmatic modifications of element trees.

## Manipulating the Document-Object From Console
- Topmost node of DOM tree of HTML document is `document` object.
- Can make changes to the document with DOM in the console.
- However, changes are not permanent after refreshing.

## CSS
- The `head` element of HTML contains link to CSS file.
- CSS is a markup language for the appearance of the page.
- The file looks like below:
```css
.container {
    padding: 10px;
    border: 1px solid;
}

.notes {
    color: blue;
}
```
- These are class selectors that style classes.

## Loading a Page Containing JavaScript - Review
1. Browser makes HTTP GET request to server for main page.
2. Server responds with HTML file.
3. Browser makes HTTP GET request for the CSS file.
4. Server responds with CSS file.
5. Browser makes HTTP GET request for the JS file.
6. Server responds with JS file.
7. Browser executes JS code and requests JSON data from server.
8. Browser executes event handler that renders notes to display.

## Forms and HTTP POST
- The Notes page contains a form.
- When button on form is clicked, browser sends user input to the server.
- In the Network tab, we see a POST request to the address new_note.
- Server responds with 302 meaning a URL redirect.
- The redirect means server asks browser to do new GET request at the new URL.
- Can also see the form data sent at the bottom.
- The form has attributes `action` and `method` which means that submitting the form causes a POST request to the URL provided.
- Code on server to handle POST request is:
```javascript
app.post('/new_note', (req, res) => {
    notes.push({
        content: req.body.note,
        date: new Date()
    });

    return res.redirect('notes');
});
```
- The code above is on the server and not on the JS fetched by the browser.
- Data is sent as `body` of the POST request.
- Server can access data by the `req.body` field of the request object `req`.
- Server creates new note object and pushes to notes array.
- Note object has fields content and date.
- The server does not save new notes and new notes will not appear on page when server restarted.

## AJAX
- The Notes page follows old style of web dev and uses AJAX.
- Stands for Asynchronous JavaScript and XML.
- Describes new approach enabling fetching of content to web pages using JS included within HTML without need to rerender the page.
- Before AJAX, web pages worked like traditional web apps.
- All data shown was fetched with HTML code generated by server.
- Notes page uses AJAX to fetch notes data.

## Single Page App
- Example app is traditional.
    - All logic is on server.
    - Browser only renders HTML as instructed.
- The single page application (SPA) style of making web apps came about.
    - SPA websites don't fetch all pages separately from server.
    - It comprises just one HTML page fetched from the server.
    - The contents of this HTML are manipulated by JS in the browser.
- The Notes page is not completely SPA.
    - Logic for rendering notes is run on browser.
    - Adding new notes is still traditional.
    - Data is sent to server with form submit.
    - Server tells browser to reload Notes page with a `redirect`.
- The JS file of SPA is different and form tag is different.
    - Form has no action or method attributes.
- Look at Network tab when you create a new note.
    - Only one request is sent to server.
    - POST request contains the new note as JSON-data with content and date.
    - Content-Type is application/json to tell server that included data is JSON.
    - This allows server to correctly parse data.
    - Server responds with status 201 created.
    - This time, server does not ask for a redirect, the browser stays on same page, and no further HTTP requests are sent.
- SPA version does not send form data in traditional way.
    - Uses JS code it got from server.
- JS code below:
```javascript
var form = document.getElementById('notes_form');
form.onsubmit = function(e) {
    e.preventDefault();

    var note = {
        content: e.target.elements[0].value,
        date: new Date()
    };

    notes.push(note);
    e.target.elements[0].value = '';
    redrawNotes();
    sendToServer(note);
};
```
- The first command tells the code to fetch the form element from page.
- We register an event handler to handle the form submit event.
- We prevent the default from happening.
    - The default method is to send data to server and cause a new GET request, which we do not want.
- The event handler creates a new note and adds to notes list.
- We rerender the note list on the page and sends the new note to server.
- Code for sending note to server:
```javascript
var sendToServer = function(note) {
    var xhttpForPost = new XMLHttpRequest()
    // ...

    xhttpForPost.open('POST', '/new_note_spa', true);
    xhttpForPost.setRequestHeader(
        'Content-Type', 'application/json'
    );
    xhttpForPost.send(JSON.stringify(note));
};
```
- Code determines that data is sent with HTTP POST request and in JSON.
- Data type determined with Content-Type header.
- Data is sent as JSON-string.

## JavaScript Libraries
- Sample app is done with vanilla JavaScript, using only DOM and JS to manipulate structure of pages.
- There are different libraries. One of which is jQuery.
    - Cross-browser compatibility.
- SPA brought more modern ways of web dev than jQuery.
    - First wave is Backbone JS.
    - Google's AngularJS.
    - Angular plummeted and Facebook's React library came about.
- React is the most popular tool for implementing browser-side logic of web apps.
- We get familiar with React and Redux libraries.
- VueJS is capturing interest.

## Full Stack Web Development
- Top layer is browser, which is closest to the end-user.
- The bottom layer is the server.
- Often a database layer below server.
- Architecture of web app is a stack of layers.
- The browser is the frontend and JS that runs on browser is frontend code.
- Server is the backend.
- We will code backend with JS using Node.js.
- We can use same language on multiple layers.