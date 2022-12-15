# Sustainable-City---Philadelphia

<h2> Idea Description </h2>
<p> Sustainable City - Philadelphia (SCP) is a project that I worked on for my Web Service Programming class. The idea behind it is to create a more sustainable version
of furniture disposal. Every year, college students dispose of countless pieces of furniture when moving out of their apartments, creating massive amounts of waste. What
we've created is a website that allows students to list furniture that they would like to get rid of on our page, and each item then gets assigned a location ID. The 
location ID determines the pickup spot for the item, where other students can come pick up the item if they are interested. If no one claims the item after a certain amount
of time, sanitation crews can use the location ID to come and pick up the item for proper disposal so that it's not sitting out on the street waiting to be thrown out. 
This project helps encourage sustainable practices through peer-to-peer communication and can give countless pieces of furniture a new life.</p>
<h2> Technical Details </h2>
<p> This project utilizes the NodeJS packages Express and Sync-mysql to create a web service, hosted on an AWS instance, that allows the site to interact with the 
database we created. It uses the GET, POST, DELETE, and UPDATE HTTP methods to create the interactions, and then references those methods using ajax calls in jQuery through 
the back-end of the site. We also made use of two map APIs, with an embedded copy of Google Maps serving as the main zone identifier and then sending specific zone
data to MapQuest to get the zoomed in version of the zone. </p>
<p> Service page - 'scp-app.js' </p>
<p> Site back-end page - 'app.js' </p>
<h2> Site Images </h2>
<p>Home Page:
![home page](https://user-images.githubusercontent.com/99213972/207949491-41c558cd-68d7-452e-a59c-3bc566375311.jpg) </p>
<p>Profile Page: 
![profile page](https://user-images.githubusercontent.com/99213972/207949731-d6c06fec-b315-429b-8cec-ae05ecc67c56.jpg)</p>
<p>Map Page:
![map page](https://user-images.githubusercontent.com/99213972/207949790-4b1a2864-40a1-4452-a558-7099840ae801.jpg)</p>
<p>Add Item Form:
![add item page](https://user-images.githubusercontent.com/99213972/207949874-8937fc48-fa8c-4a6b-bf62-56358b8844a5.jpg)</p>
<p>Sample Details Page:
![details page](https://user-images.githubusercontent.com/99213972/207949932-506fb793-f42d-4ff0-ad94-e307cb7162e6.jpg)</p>
<p>About Us Page:
![about page](https://user-images.githubusercontent.com/99213972/207949991-899326bc-3af5-4d9b-a733-d273a7c21ab9.jpg)</p>
<h2> Disclaimer </h2>
<p> This site was created strictly for demo purposes. There is no legitimate business application behind this. The server that the site and the database are hosted on 
were strictly for this project, and will be discontinued at the end of the project. </p>
