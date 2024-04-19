import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Define a function to fetch user data from the backend API
    const fetchUserData = async () => {
      try {
        // Make a GET request to the backend API endpoint to fetch user data
        const response = await axios.get(
          "/api/v1/users/662104b9301aaf6909080434",
          {
            withCredentials: true, // Include cookies in the request
          }
        );

        // Check if the response is successful (status code 200)
        if (response.status === 200) {
          // Set the user data in state
          setUserData(response.data);
        } else {
          // Handle non-successful responses
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.error("Error fetching user data:", error);
      }
    };

    // Call the fetchUserData function when the component mounts
    fetchUserData();
  }, []); // Empty dependency array ensures the effect runs only once after mounting

  return (
    <div className="App">
      <h1>Hello World</h1>
      {/* Conditional rendering to display user data if available */}
      {userData && (
        <div>
          <h2>User Data:</h2>
          <p>Username: {userData.data.username}</p>
          <p>Full Name: {userData.data.fullName}</p>
          {/* Display watch history array */}
          <div>
            <h3>Watch History:</h3>
            <ul>
              {userData.data.watchHistory.map((video) => (
                <li key={video._id}>
                  {/* Display individual video details */}
                  <p>Title: {video.title}</p>
                  {/* Embed full video */}
                  <video controls width="400">
                    <source src={video.videoFile} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Add link to video */}
                  <a
                    href={video.videoFile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch Video
                  </a>
                  <p>Description: {video.description}</p>
                  {/* Add more fields as needed */}
                </li>
              ))}
            </ul>
          </div>

          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
}

export default App;
