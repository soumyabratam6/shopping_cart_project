document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger .open");
  const closeButton = document.querySelector(".links-container .close");
  const linksContainer = document.querySelector(".links-container");
  const navLinks = document.querySelectorAll(".nav_active_class");

  const toggleMenu = () => {
    linksContainer.classList.toggle("active");
  };

  hamburger.addEventListener("click", toggleMenu);
  closeButton.addEventListener("click", toggleMenu);
  /* navication active add... */
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      link.classList.add("active");
      linksContainer.classList.remove("active");
    });
  });
  // Set the initial active link based on the current URL
  const currentPath = window.location.pathname;
  navLinks.forEach((link) => {
    if (link.href.includes(`${currentPath}`)) {
      link.classList.add("active");
    }
  });
  const loginForm = document.getElementById("login-form");
  const profileForm = document.getElementById("profile-form");
  const changePasswordForm = document.getElementById("password-form");
  const logoutButton = document.querySelector(".Logout_btn");
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
  if (profileForm) {
    profileForm.addEventListener("submit", handleProfileUpdate);
  }

  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", handleChangePassword);
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  if (window.location.pathname.includes("profile.html")) {
    loadProfile();
  }
});
// Utility function to get user data from local storage
function getUserData() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Utility function to save user data to local storage
function saveUserData(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Utility function to get the logged-in user from local storage
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

// Utility function to save the logged-in user to local storage
function saveLoggedInUser(user) {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

// Utility function to generate a random token
function generateToken() {
  return Math.random().toString(36).substr(2);
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation criteria
const passwordMinLength = 8;
// Signup functionality
function handleSignup(event) {
  //console.log("signup");
  event.preventDefault();
  const firstName = document.getElementById("first_name").value;
  const lastName = document.getElementById("last_name").value;
  const email = document.getElementById("email_sigin").value;
  const password = document.getElementById("password_signin").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  const errorElement = document.querySelector(".error");
  const successElement = document.querySelector(".success");
  successElement.style.color = "green";

  errorElement.textContent = "";
  successElement.textContent = "";
  //validation
  if (!firstName) {
    errorElement.textContent = "First name is required.";
    return;
  }

  if (!lastName) {
    errorElement.textContent = "Last name is required.";
    return;
  }

  if (!email) {
    errorElement.textContent = "Email is required.";
    return;
  }

  if (!emailRegex.test(email)) {
    errorElement.textContent = "Invalid email format.";
    return;
  }

  if (!password) {
    errorElement.textContent = "Password is required.";
    return;
  }

  if (password.length < passwordMinLength) {
    errorElement.textContent = `Password must be at least ${passwordMinLength} characters long.`;
    return;
  }
  if (password !== confirmPassword) {
    errorElement.textContent = "Passwords do not match.";
    return;
  }

  const users = getUserData();
  if (users.some((user) => user.email === email)) {
    errorElement.textContent = "Email is already registered.";
    return;
  }

  const newUser = {
    firstName,
    lastName,
    email,
    password,
    token: generateToken(),
  };
  users.push(newUser);
  saveUserData(users);
  successElement.textContent = "Signup successful! You can now log in.";
  window.location.href = "login.html";
}

// Login functionality
function handleLogin(event) {
  //console.log("login");
  event.preventDefault();
  const email = document.getElementById("email_sigin").value;
  const password = document.getElementById("password_signin").value;

  const errorElement = document.querySelector(".error");
  const successElement = document.querySelector(".success");
  errorElement.textContent = "";
  successElement.textContent = "";

  // Validation
  if (!email) {
    errorElement.textContent = "Email is required.";
    return;
  }

  if (!emailRegex.test(email)) {
    errorElement.textContent = "Invalid email format.";
    return;
  }

  if (!password) {
    errorElement.textContent = "Password is required.";
    return;
  }
  const users = getUserData();
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    errorElement.textContent =
      "Invalid email or password.please signup first...";
    // errorElement.textContent = "";
    return;
  }

  saveLoggedInUser(user);
  successElement.textContent =
    "Login successful! Redirecting to profile page...";
  successElement.style.color = "green";
  setTimeout(() => {
    window.location.href = "profile.html";
  }, 2000);
}

// Profile page functionality
function loadProfile() {
  const user = getLoggedInUser();
  if (!user) {
    alert("You need to log in first.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("first_name").value = user.firstName;
  document.getElementById("last_name").value = user.lastName;
}

function handleProfileUpdate(event) {
  event.preventDefault();
  const firstName = document.getElementById("first_name").value;
  const lastName = document.getElementById("last_name").value;

  let user = getLoggedInUser();
  user.firstName = firstName;
  user.lastName = lastName;

  const users = getUserData();
  const userIndex = users.findIndex((u) => u.email === user.email);
  users[userIndex] = user;

  saveUserData(users);
  saveLoggedInUser(user);

  document.querySelector(".success").textContent =
    "Profile updated successfully.";
}

function handleChangePassword(event) {
  event.preventDefault();
  const oldPassword = document.getElementById("old_password").value;
  const newPassword = document.getElementById("new_password").value;
  const confirmPassword = document.getElementById("confirm_new_password").value;

  const errorElement = document.querySelector(".error_pass");
  const successElement = document.querySelector(".success");
  errorElement.textContent = "";
  successElement.textContent = "";

  let user = getLoggedInUser();

  if (oldPassword !== user.password) {
    errorElement.textContent = "Old password is incorrect.";
    return;
  }

  if (newPassword.length < passwordMinLength) {
    errorElement.textContent = `New password must be at least ${passwordMinLength} characters long.`;
    return;
  }

  if (newPassword !== confirmPassword) {
    errorElement.textContent = "New passwords do not match.";
    return;
  }

  user.password = newPassword;

  const users = getUserData();
  const userIndex = users.findIndex((u) => u.email === user.email);
  users[userIndex] = user;

  saveUserData(users);
  saveLoggedInUser(user);

  successElement.textContent = "Password changed successfully.";
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 2000);
}

function handleLogout(event) {
  event.preventDefault();
  localStorage.removeItem("loggedInUser");
  window.location.href = "../index.html";
}
