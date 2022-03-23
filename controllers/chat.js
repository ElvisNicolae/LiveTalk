exports.getChat = (req, res) => {
  if(!req.cookies.userName){
    // if the user has a query param, it means it got the link from someone
    // as such, remember that socketId to redirect them to the right room
    if(req.query.socketId){
      res.redirect(`/?socketId=${req.query.socketId}`) // addname page
    } 
    else {
      res.redirect("/"); // addname page
    }
  }
  else {
    res.render("chat", {
      pageTitle: "LiveTalk",
      yourPhoto: req.cookies.userPhoto ? req.cookies.userPhoto : null,
      yourName: req.cookies.userName,
      socketId: req.query.socketId ? req.query.socketId : null
    });
  }
}

exports.postProcessingName = (req, res) => {
  // add the name to cookies
  res.cookie("userName", req.body.name);
  
  if(req.query.socketId) {
    res.redirect(`/chat?socketId=${req.query.socketId}`)
  } else {
    res.redirect("/chat");
  }
}

exports.getProcessingPhoto = (req, res) => {
  if(req.query.socketId) {
    res.render("change-photo", {
      pageTitle: "LiveTalk | Change your photo",
      socketId: req.query.socketId
    })
  } else {
    res.render("change-photo", {
      pageTitle: "LiveTalk | Change your photo",
      socketId: null
    })
  }
}

exports.postProcessingPhoto = (req, res) => {
  // add the photo url to cookies
  res.cookie("userPhoto", req.body.userPhoto)

  if(req.query.socketId) {
    res.redirect(`/chat?socketId=${req.query.socketId}`)
  } else {
    res.redirect("/chat");
  }
}
