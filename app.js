const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-parser');

// handle socket.io stuff
io.on('connection', socket => {

  // get the name of the user that just established a connection
  const matchUserName = socket.handshake.headers.cookie.match(new RegExp('(^| )' + "userName" + '=([^;]+)'));
  let userName = null;

  if(matchUserName) {
    userName = matchUserName[2];
  }
  
  // get the photo of the user that just established a connection
  const matchPhoto = socket.handshake.headers.cookie.match(new RegExp('(^| )' + "userPhoto" + '=([^;]+)'));
  let userPhoto = null;
  
  if(matchPhoto){
    userPhoto = matchPhoto[2];
  }

  // send the socketid to the frontend/client
  socket.emit('socket-id', socket.id);


  socket.on('join-room', room => {
    socket.join(room);
  })

  socket.on('message', (msg, room) => {
    // when someone sends a message, emit that message to all the other participants
    socket.to(room).emit("gotMessage", msg, userName, userPhoto);
  })
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.set('view engine', 'ejs');


const routes = require('./routes/routes');
routes(app);


// if there is no middleware that handles the request
// always render the addusername page if they don't have a username
// otherwise redirect them to the chat page  
app.use((req, res, next) => {

  // if there is a query param with socketId it means the user got the 
  // link from someone, as such, proceed to get him in the room
  // with the person that shared the link
  if(req.query.socketId) {

    if(req.cookies.userName){
      res.redirect(`/chat?socketId=${req.query.socketId}`);
    } 
    else {
      res.render("addname", {
        pageTitle: "LiveTalk | Enter your name",
        socketId: req.query.socketId
      });
    }

  } 
  else {

    if(req.cookies.userName){
      res.redirect("/chat");
    } 
    else {
      res.render("addname", {
        pageTitle: "LiveTalk | Enter your name",
        socketId: null
      });
    }
  }
})

server.listen(3000);
