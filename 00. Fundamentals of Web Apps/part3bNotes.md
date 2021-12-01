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