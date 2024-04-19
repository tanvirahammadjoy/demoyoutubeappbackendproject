window.onload = function () {
    fetchData();
  };
  
  function fetchData() {
    fetch("http://localhost:8000/api/v1/users/662104b9301aaf6909080434")
      .then((response) => response.json())
      .then((data) => {
        displayData(data.data); // Access the 'data' property of the response JSON
        displayWatchHistory(data.data.watchHistory); // Access the 'watchHistory' property of the user data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  
  function displayData(data) {
    const container = document.getElementById("data-container");
    container.innerHTML = ""; // Clear previous content
  
    const userInfo = document.createElement("div");
  
    // Create elements to display user information
    const username = document.createElement("p");
    username.textContent = "Username: " + data.username;
    userInfo.appendChild(username);
  
    const fullName = document.createElement("p");
    fullName.textContent = "Full Name: " + data.fullName;
    userInfo.appendChild(fullName);
  
    const email = document.createElement("p");
    email.textContent = "Email: " + data.email;
    userInfo.appendChild(email);

    const video = document.createElement("video")
  
    // Display the user information
    container.appendChild(userInfo);
  }

  function displayWatchHistory(watchHistory) {
    const container = document.getElementById("video-container");
    container.innerHTML = ""; // Clear previous content
  
    watchHistory.forEach((video) => {
      // Create elements for each video
      const videoContainer = document.createElement("div");
      videoContainer.classList.add("video");
  
      const videoTitle = document.createElement("h3");
      videoTitle.textContent = video.title;
  
      const videoDescription = document.createElement("p");
      videoDescription.textContent = video.description;
  
      const videoPlayer = document.createElement("video");
      videoPlayer.src = video.videoFile;
      videoPlayer.controls = true;
  
      // Append elements to the video container
      videoContainer.appendChild(videoTitle);
      videoContainer.appendChild(videoDescription);
      videoContainer.appendChild(videoPlayer);
  
      // Append video container to the main container
      container.appendChild(videoContainer);
    });
  }
  