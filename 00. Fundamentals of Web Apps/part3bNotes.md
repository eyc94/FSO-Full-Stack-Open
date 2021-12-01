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
