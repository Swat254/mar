function generateReferralCode(username) {
  return username.slice(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
}

function registerUser() {
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
  const picFile = document.getElementById("profilePic").files[0];

  if (localStorage.getItem(username)) {
    alert("User already exists!");
    return false;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const profilePicData = e.target.result;
    const referralCode = generateReferralCode(username);
    const userData = {
      password,
      profilePic: profilePicData,
      referralCode,
      balance: 0
    };
    localStorage.setItem(username, JSON.stringify(userData));
    localStorage.setItem("loggedInUser", username);
    window.location.href = "dashboard.html";
  };
  reader.readAsDataURL(picFile);
  return false;
}

function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const user = JSON.parse(localStorage.getItem(username));

  if (user && user.password === password) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
  return false;
}

function logout() {
  localStorage.removeItem("loggedInUser");
}

function deposit() {
  const amount = parseFloat(document.getElementById("presetAmounts").value);
  const phone = document.getElementById("phoneNumber").value;
  if (!phone) {
    alert("Phone number required");
    return;
  }
  const user = getUser();
  user.balance += amount;
  localStorage.setItem(user.username, JSON.stringify(user));
  loadDashboard();
}

function withdraw() {
  const user = getUser();
  alert("Withdraw feature to be connected to M-PESA API.");
}

function loadDashboard() {
  const username = localStorage.getItem("loggedInUser");
  const user = JSON.parse(localStorage.getItem(username));
  user.username = username;
  document.getElementById("userName").textContent = username;
  document.getElementById("referralCode").textContent = user.referralCode;
  document.getElementById("userBalance").textContent = user.balance;
  document.getElementById("userPic").src = user.profilePic;

  const preset = document.getElementById("presetAmounts");
  preset.onchange = () => {
    const val = parseFloat(preset.value);
    document.getElementById("commission").textContent = (val * 0.15).toFixed(2);
  };
  preset.dispatchEvent(new Event('change'));
}

function getUser() {
  const username = localStorage.getItem("loggedInUser");
  const user = JSON.parse(localStorage.getItem(username));
  user.username = username;
  return user;
}

if (location.pathname.endsWith("dashboard.html")) {
  if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "index.html";
  } else {
    window.onload = loadDashboard;
  }
}