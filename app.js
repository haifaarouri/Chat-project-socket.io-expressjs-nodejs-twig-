var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const http = require("http")
var Message = require("./models/message")

var msgsRouter = require('./routes/message');
var chatRouter = require('./routes/chat')

var app = express();

// view engine setup
// app.set('views', './views');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/messages', msgsRouter);
app.use('/chat', chatRouter)

var configDB = require("./mongodb.json");
mongoose.connect(configDB.mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à la base de données réussie.');
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données :', err);
  });

const server = http.createServer(app)
const io = require("socket.io")(server)

io.on("connection", function (socket) {
  io.emit("msg", "A new user joined the chat notification");

  socket.on("disconnect", () => {
    io.emit("deconx", "A user left the chat");
  });

  socket.on("IsTyping", (data) => {
    io.emit("msgTyping", data)
  })

  // Gestion de l'événement 'deleteNotification'
  socket.on('deleteNotification', async (data) => {
    const { msgId } = data;

    try {
      // Supprimer le message de la base de données
      await Message.findByIdAndDelete(msgId);

      console.log(`Notification de suppression reçue : Message ID ${msgId}`);
      io.emit("delete", `suppression de Message aved l'ID : ${msgId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du message :', error);
    }
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3000, () => console.log("server is running on port 3000"))

module.exports = app;
