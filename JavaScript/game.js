// gamebox
let gamebox;
let gameboxWidth = 900;
let gameboxHeight = 400;
let context;
let backgroundImage;

// Sonic
// Sonic player configurations
let sonicWidth = 88;
let sonicHeight = 94;
let sonicx = 50;
let sonicy = gameboxHeight - sonicHeight;
let sonicImg;

let sonic = {
  x: sonicx,
  y: sonicy,
  width: sonicWidth,
  height: sonicHeight,
};

// Barrels
// Barrels configurations
let barrelsArray = [];
let barrels1Width = 35;
let barrels2Width = 70;
let barrels3Width = 102;
let barrelsHeight = 70;
let barrelsX = 700;
let barrelsY = gameboxHeight - barrelsHeight;
let barrels1Img;
let barrels2Img;
let barrels3Img;

// The Sonic Run game physics
// Game physics parameters
let VelocityX = -8; // Barrels moving left speed
let VelocityY = 0;
let gravity = 0.4;

let gameOver = false;
let topScore = 0;

// JSON Score
// Load user data from sessionStorage and localStorage
let username = sessionStorage.getItem("loggedInUser");
const user = JSON.parse(localStorage.getItem(username)) || { topScore: 0 };

// Initialize game canvas and context
window.onload = function () {
  gamebox = document.getElementById("gamebox");
  gamebox.width = gameboxWidth;
  gamebox.height = gameboxHeight;
  context = gamebox.getContext("2d");

  // Load images for sonic player and barrels
  sonicImg = new Image();
  sonicImg.src = "./Images/sonicplayer.png";
  sonicImg.onload = function () {
    context.drawImage(sonicImg, sonic.x, sonic.y, sonic.width, sonic.height);
  };

  barrels1Img = new Image();
  barrels1Img.src = "./Images/barrels1.png";

  barrels2Img = new Image();
  barrels2Img.src = "./Images/barrels2.png";

  barrels3Img = new Image();
  barrels3Img.src = "./Images/barrels3.png";

  // Start the game loop and set interval for placing barrels
  requestAnimationFrame(update);
  setInterval(placeBarrels, 1000);
  document.addEventListener("keydown", moveSonic); // Listen for key events in game
};
// The main game loop
function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    updateTopScore(username, topScore); // Update high score
    return;
  }

  context.clearRect(0, 0, gamebox.width, gamebox.height);

  VelocityY += gravity;
  sonic.y = Math.min(sonic.y + VelocityY, sonicy);
  context.drawImage(sonicImg, sonic.x, sonic.y, sonic.width, sonic.height);

  // Update and draw barrels, check for collisions
  for (let i = 0; i < barrelsArray.length; i++) {
    let barrels = barrelsArray[i];
    barrels.x += VelocityX;
    context.drawImage(
      barrels.img,
      barrels.x,
      barrels.y,
      barrels.width,
      barrels.height
    );

    if (detectCollision(sonic, barrels)) {
      gameOver = true;
      sonicImg.src = "./Images/sonicDead.png";
      sonicImg.onload = function () {
        context.drawImage(
          sonicImg,
          sonic.x,
          sonic.y,
          sonic.width,
          sonic.height
        );
      };
    }
  }
  // Displaying Top Score
  context.fillStyle = "white";
  context.font = "20px courier";
  topScore++;
  context.fillText("Top Score: " + topScore, 5, 20);
}
// Handle sonic's jump
function moveSonic(e) {
  if (gameOver) {
    return;
  }

  if ((e.code === "Space" || e.code === "ArrowUp") && sonic.y >= sonicy - 1) {
    VelocityY = -10;
  }
}
// Place barrels randomly
function placeBarrels() {
  if (gameOver) {
    return;
  }

  let barrels = {
    img: null,
    x: barrelsX,
    y: barrelsY,
    width: null,
    height: barrelsHeight,
  };

  let placeBarrelsProbability = Math.random();

  // Set barrel type based on probability
  if (placeBarrelsProbability > 0.9) {
    barrels.img = barrels3Img;
    barrels.width = barrels3Width;
    barrelsArray.push(barrels);
  } else if (placeBarrelsProbability > 0.7) {
    barrels.img = barrels2Img;
    barrels.width = barrels2Width;
    barrelsArray.push(barrels);
  } else if (placeBarrelsProbability > 0.5) {
    barrels.img = barrels1Img;
    barrels.width = barrels1Width;
    barrelsArray.push(barrels);
  }
  // Limit the number of barrels on screen
  if (barrelsArray.length > 5) {
    barrelsArray.shift();
  }
}
// Check for collision between two objects
function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.width &&
    a.y + a.height > b.y
  );
}
// Sonic game Leaderboard
function updateTopScore(username, newScore) {
  // Retrieve existing users array or create a new one
  let usersArray = JSON.parse(localStorage.getItem("users")) || [];
  let userObjByKey = JSON.parse(localStorage.getItem(username)) || {
    topScore: 0,
  };

  // Find the user in the array or create a new user object
  let userObj = usersArray.find((user) => user.username === username) || {
    username,
    topScore: 0,
  };

  // Check if the new score is higher than the previous top score
  if (newScore > userObj.topScore) {
    userObj.topScore = newScore;
    userObjByKey.topScore = newScore;

    // Update the individual user in the array or add a new user
    let index = usersArray.findIndex((user) => user.username === username);
    if (index !== -1) {
      usersArray[index] = userObj;
    } else {
      usersArray.push(userObj);
    }

    // Update the users array in local storage
    localStorage.setItem("users", JSON.stringify(usersArray));
    localStorage.setItem(username, JSON.stringify(userObjByKey));
  } else {
  }
}
// Display the leaderboard
function displayLeaderboard() {
  // Retrieve user data from local storage or initialize an empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Sort the array based on the topScore property in descending order
  users.sort((a, b) => b.topScore - a.topScore);

  // Get the leaderboard table
  let leaderboardTable = document.querySelector(".tableLeaderboard");

  // Clear existing rows in the table
  while (leaderboardTable.rows.length > 1) {
    leaderboardTable.deleteRow(1);
  }

  // Display the top 10 players in the leaderboard
  for (let i = 0; i < Math.min(users.length, 10); i++) {
    // Insert a new row for each player
    let row = leaderboardTable.insertRow(i + 1);
    // Insert cells in the row for rank, username, and top score
    let rankCell = row.insertCell(0);
    let usernameCell = row.insertCell(1);
    let topScoreCell = row.insertCell(2);
    // Populate cells with player data
    rankCell.innerHTML = i + 1; // Rank is determined by the loop index
    usernameCell.innerHTML = users[i].username; // Username from the user data
    topScoreCell.innerHTML = users[i].topScore; // Top score from the user data
  }
}
