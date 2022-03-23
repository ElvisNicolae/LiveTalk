const {
  getChat,
  postProcessingName,
  getProcessingPhoto,
  postProcessingPhoto
} = require('../controllers/chat.js');

module.exports = app => {
  app.get("/chat", getChat);
  app.post("/processing-name", postProcessingName);
  app.get("/processing-photo", getProcessingPhoto);
  app.post("/processing-photo",  postProcessingPhoto);

}
