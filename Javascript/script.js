// define html elements here
const submitButton = document.getElementById("submit_btn");

const loadingSpinner = document.querySelector(".loading-container");

const alertMessage = document.querySelector(".alert-message");
const alertContainer = document.querySelector(".alert-container");

const profileName = document.querySelector("#profile-name");
const profleBlog = document.querySelector("#profile-blog");
const profileAdderes = document.querySelector("#profile-adderes");
const profilePhoto = document.querySelector(".profile-photo");
const profileBio = document.querySelector("#profile-bio");

//this function sends the http GET request
const sendRequest = async (e) => {
  //prevent default browser action
  e.preventDefault();

  // check username validity
  const username = document.getElementById("text_input").value;
  if (!username) {
    showAlert("Please enter a valid username !");
    return;
  }

  // check local storage
  const data = await JSON.parse(window.localStorage.getItem(username));
  if (data) {
    addDataToScreen(data);
    return;
  }

  const url = "https://api.github.com/users/" + username;

  try {
    showSpinner(true);
    const response = await fetch(url);
    const data = await response.json(); //extract JSON from the http response

    if (response.ok) {
      console.log(data);
      addDataToLocalStorage(data);
      addDataToScreen(data);
      showSpinner(false);

      document.querySelector(".profile-container").style.display = "block";
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log(error);
    showAlert(error.message);
    showSpinner(false);
  }
};

//inject request data to the screen elements
const addDataToScreen = (data) => {
  profileName.textContent = data.name ? data.name : "---";
  profleBlog.textContent = data.blog ? data.blog : "---";
  profileBio.innerHTML = data.bio ? data.bio.replace("\n", "<br>") : "---";
  profileAdderes.textContent = data.location ? data.location : "---";
  profilePhoto.src = data.avatar_url ? data.avatar_url : "---";
};

//alert show for error messages
const showAlert = (message) => {
  alertMessage.textContent = message;
  alertContainer.style.visibility = "visible";
  alertContainer.style.opacity = 1;

  //remove alert after 4 seconds
  setTimeout(() => {
    alertContainer.style.visibility = "hidden";
    alertContainer.style.opacity = 0;
  }, 4000);
};

//show spinner until request arrived
const showSpinner = (show) => {
  if (!show) {
    loadingSpinner.style.display = "none";
  } else {
    document.querySelector(".profile-container").style.display = "none";
    loadingSpinner.style.display = "block";
  }
};

//remove entered value from input after submission
const resetForm = () => {
  document.getElementById("text_input").value = "";
};

//add data to local storage
const addDataToLocalStorage = (data) => {
  const username = document.getElementById("text_input").value;

  const githubData = {
    name: data.name ? data.name : "---",
    blog: data.blog ? data.blog : "---",
    bio: data.bio ? data.bio.replace("\n", "<br>") : "---",
    location: data.location ? data.location : "---",
    avatar_url: data.avatar_url ? data.avatar_url : "---",
  };

  window.localStorage.setItem(username, JSON.stringify(githubData));
  resetForm();
};

submitButton.addEventListener("click", sendRequest);

window.localStorage.clear();
