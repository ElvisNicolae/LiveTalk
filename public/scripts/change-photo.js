const baseURL = "http://localhost:3000";

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const handleDefaultPhotoClick = () => {
  // clear userPhoto from cookies so that the default photo will be selected
  document.cookie = "userPhoto=; expires=Thu, 18 Dec 1099 12:00:00 UTC; path=/";

  // if there are query params redirect them to the chat with those query params added
  if(params.socketId) {
    window.location.href = `${baseURL}/chat?socketId=${params.socketId}`;
  }
  else {
    window.location.href = `${baseURL}/chat`;
  }
}
