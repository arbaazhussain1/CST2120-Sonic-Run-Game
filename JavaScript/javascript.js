// Sign-up page Validations
// Function to validate and register user input
function registerVal() {
  // Regular expression for email validation
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // Regular expression for password validation
  var pas = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  // Object to store user input data
  let userObj = {};
  // Retrieve user input values from HTML input elements
  userObj.firstname = document.getElementById("firstname").value;
  userObj.lastname = document.getElementById("lastname").value;
  userObj.username = document.getElementById("username").value;
  userObj.email = document.getElementById("email").value;
  userObj.password = document.getElementById("password").value;
  userObj.topScore = 0; // Initialize top score to 0

  // Check if any of the required fields are empty
  if (
    userObj.username == "" ||
    userObj.firstname == "" ||
    userObj.lastname == "" ||
    userObj.email == "" ||
    userObj.password == ""
  ) {
    document.getElementById("validation").innerHTML =
      "Enter All the Textfields.";
  } else if (re.test(userObj.email) == false) {
    // Check if the email format is incorrect
    document.getElementById("validationRed").innerHTML =
      "Incorrect Email Format.";
  } else if (
    userObj.password.length < 8 ||
    pas.test(userObj.password) == false
  ) {
    // Check if the password length is less than 8 characters or does not meet the specified criteria
    document.getElementById("validationRed").innerHTML =
      "Password must have Special Characters/Numbers, and Required to be 8 Characters long.";
  } else {
    // Check if the username or email already exists in the users array
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (
      users.some(
        (u) => u.username === userObj.username || u.email === userObj.email
      )
    ) {
      // Check if the username or email already exists
      document.getElementById("validationRed").innerHTML =
        "Username or Email already exists.";
    } else {
      // Validation successful; no existing username or email found
      document.getElementById("validationGreen").innerHTML =
        "Successfully Created an Account";

      // Save user information in localStorage, including the score
      userObj.topScore = 0; // Set initial score to 0
      users.push(userObj);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem(userObj.username, JSON.stringify(userObj));

      // Save user information in sessionStorage after successful registration
    }
  }
}

// Login page Validations
function loginVal() {
  // Get the data
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Reset validation messages
  document.getElementById("validation").innerHTML = "";
  document.getElementById("validationRed").innerHTML = "";
  document.getElementById("validationGreen").innerHTML = "";

  if (username === "" || password === "") {
    // Display a message if fields are empty
    document.getElementById("validation").innerHTML = "Enter All Fields";
  } else {
    // Check if the user exists in the "users" array in local storage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((u) => u.username === username);

    if (!foundUser) {
      // Display a message if the user is not found
      document.getElementById("validationRed").innerHTML =
        "User Has Not Been Found";
    } else {
      // Retrieve user object from the "users" array
      const userObj = foundUser;

      // Convert the stored password to a string before comparison
      const storedPassword = String(userObj.password);

      // Check if the entered password matches the stored password
      if (storedPassword === password) {
        // Display a success message if login is successful
        document.getElementById("validationGreen").innerHTML =
          "Login Successfully";

        // Save user information in sessionStorage after successful login
        sessionStorage.setItem("loggedInUser", username);
      } else {
        // Display a message if the entered password is incorrect
        document.getElementById("validationRed").innerHTML =
          "User Password is Incorrect";
      }
    }
  }
}
