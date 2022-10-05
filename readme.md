# MERN-stack Blog
A simple blog app created with Node.js, Express, React and MongoDB.

You can see the entire project on www.architekturo.pl

## Table of contents
* [Technologies](#technologies)
* [Launch](#launch)
* [Functionalities](#functionalities)

## Technologies
- **Node.js** *16*
- **Express** *4*
- **React** *18*
- **Redux** *4*
- **MongoDB**

### Libraries
- **mongoose** for Node.js connection to a serverless MongoDB instance
- **redux-thunk** for asynchronous redux actions
- **SCSS** for styling
- **jwt**, **passport-local**, **js-cookie** for authentication 
- **axios** for sending requests to our Express server API


### Other
- design created in Figma
- deployed to Heroku
- added Google Analytics
- got an SSL certificate with Let's Encrypt
- added automatic http&rarr;https redirects

## Launch
In order to clone this project you need to run
```
git clone https://github.com/jakubSzuminski/blog-mern-architekturo.git
```
Then, run ``` npm install ``` in both server and client directories to install all necessary packages based on *package.json* files.

You need to add your own environment variables with following properties:
- DATABASE_URL &rarr; *url to connect to your MongoDB*
- JWT_SECRET &rarr; *your JWT secret key*
- ADMIN_EMAIL &rarr; *email of an admin account*

## Functionalities
### All Devices
The site is fully responsive and works on all devices.
### Authentication
Users can register, login, add comments to posts, and delete their own comments. 
### Admin Panel
Admin, after logging in, can go to '/admin' route and use the admin panel. He can create new posts as well as edit or delete existing ones.
The forms are validated, therefore preventing errors based on incorrect client input (no title, no slug, etc.)
**For post creation, rich text editor is included. An admin can create posts on website with headlines, images, coloring, etc. Everything is then converted to HTML code.**
### Posts
Users can search through posts by a phrase or selected tags. The search query is included in the link (so a user can send a link with the same search results to a friend). 


