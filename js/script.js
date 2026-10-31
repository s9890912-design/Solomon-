// ==========================================
// MYWHATSAPP - MAIN APPLICATION
// ==========================================

import {
auth,
registerUser,
loginUser,
logoutUser,
onAuthStateChanged,
friendlyError
} from "./auth.js";

import {
initializeSettings
} from "./settings.js";

// ==========================================
// HTML ELEMENTS
// ==========================================

const loginScreen = document.getElementById("loginScreen");
const registerScreen = document.getElementById("registerScreen");
const appScreen = document.getElementById("appScreen");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMethod = document.getElementById("loginMethod");
const loginPhoneGroup = document.getElementById("loginPhoneGroup");
const loginEmailGroup = document.getElementById("loginEmailGroup");

// ==========================================
// DISPLAY AUTHENTICATION SCREENS
// ==========================================

function showAuth() {

loginScreen.classList.remove("hidden");
loginScreen.classList.add("active");

registerScreen.classList.add("hidden");
registerScreen.classList.remove("active");

appScreen.classList.add("hidden");
appScreen.classList.remove("active");

}

function showRegister() {

loginScreen.classList.add("hidden");
loginScreen.classList.remove("active");

registerScreen.classList.remove("hidden");
registerScreen.classList.add("active");

appScreen.classList.add("hidden");
appScreen.classList.remove("active");

}

function showLogin() {

registerScreen.classList.add("hidden");
registerScreen.classList.remove("active");

loginScreen.classList.remove("hidden");
loginScreen.classList.add("active");

appScreen.classList.add("hidden");
appScreen.classList.remove("active");

}

// ==========================================
// DISPLAY MAIN APPLICATION
// ==========================================

function showApp(user) {

loginScreen.classList.add("hidden");
loginScreen.classList.remove("active");

registerScreen.classList.add("hidden");
registerScreen.classList.remove("active");

appScreen.classList.remove("hidden");
appScreen.classList.add("active");

const profileName = document.getElementById("profileName");

if (profileName) {
    profileName.textContent =
        user.displayName || "MyWhatsApp User";
}

const profileEmail = document.getElementById("profileEmail");

if (profileEmail) {
    profileEmail.textContent = user.email || "";
}

}

// ==========================================
// SWITCH BETWEEN LOGIN METHODS
// EMAIL IS ENABLED FOR NOW
// ==========================================

function initializeLoginMethod() {

if (!loginMethod) return;

loginMethod.value = "email";

if (loginPhoneGroup) {
    loginPhoneGroup.style.display = "none";
}

if (loginEmailGroup) {
    loginEmailGroup.style.display = "block";
}

const loginPhone = document.getElementById("loginPhone");
const loginEmail = document.getElementById("loginEmail");

if (loginPhone) {
    loginPhone.required = false;
}

if (loginEmail) {
    loginEmail.required = true;
}

loginMethod.addEventListener("change", function () {

    if (this.value === "email") {

        if (loginPhoneGroup) {
            loginPhoneGroup.style.display = "none";
        }

        if (loginEmailGroup) {
            loginEmailGroup.style.display = "block";
        }

        if (loginPhone) {
            loginPhone.required = false;
        }

        if (loginEmail) {
            loginEmail.required = true;
        }

    } else {

        if (loginPhoneGroup) {
            loginPhoneGroup.style.display = "block";
        }

        if (loginEmailGroup) {
            loginEmailGroup.style.display = "none";
        }

        if (loginPhone) {
            loginPhone.required = false;
        }

        if (loginEmail) {
            loginEmail.required = false;
        }

        alert("Phone number login is coming soon. Please use email login.");

        loginMethod.value = "email";

        if (loginPhoneGroup) {
            loginPhoneGroup.style.display = "none";
        }

        if (loginEmailGroup) {
            loginEmailGroup.style.display = "block";
        }

        if (loginEmail) {
            loginEmail.required = true;
        }
    }

});

}

// ==========================================
// OPEN REGISTRATION SCREEN
// ==========================================

const showRegisterButton = document.getElementById("showRegister");

if (showRegisterButton) {

showRegisterButton.addEventListener("click", function (event) {

    event.preventDefault();

    showRegister();

});

}

// ==========================================
// RETURN TO LOGIN SCREEN
// ==========================================

const showLoginButton = document.getElementById("showLogin");

if (showLoginButton) {

showLoginButton.addEventListener("click", function (event) {

    event.preventDefault();

    showLogin();

});

}

// ==========================================
// USER REGISTRATION
// ==========================================

if (registerForm) {

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();

    const phone = document.getElementById("registerPhone").value.trim();

    const email = document.getElementById("registerEmail").value.trim();

    const password = document.getElementById("registerPassword").value;

    const confirmPassword = document.getElementById("confirmPassword").value;


    if (!name || !phone || !email || !password || !confirmPassword) {

        alert("Please complete all registration fields.");

        return;
    }


    if (password.length < 8) {

        alert("Your password must contain at least 8 characters.");

        return;
    }


    if (password !== confirmPassword) {

        alert("Your passwords do not match.");

        return;
    }


    const submitButton = registerForm.querySelector(
        'button[type="submit"]'
    );

    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent = "Creating account...";

    }


    try {

        await registerUser(
            name,
            phone,
            email,
            password
        );

        alert("Your MyWhatsApp account has been created successfully!");

        registerForm.reset();

    } catch (error) {

        console.error("Registration error:", error);

        alert(friendlyError(error.code));

    } finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent = "Create Account";

        }

    }

});

}

// ==========================================
// EMAIL LOGIN
// ==========================================

if (loginForm) {

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;


    if (!email || !password) {

        alert("Please enter your email and password.");

        return;
    }


    const submitButton = loginForm.querySelector(
        'button[type="submit"]'
    );

    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent = "Logging in...";

    }


    try {

        await loginUser(email, password);

    } catch (error) {

        console.error("Login error:", error);

        alert(friendlyError(error.code));

    } finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent = "Log In";

        }

    }

});

}

// ==========================================
// MAIN NAVIGATION
// ==========================================

function switchTab(tabName) {

const tabs = [
    "chatsTab",
    "statusTab",
    "communitiesTab",
    "callsTab",
    "settingsTab"
];


tabs.forEach(function (tabId) {

    const tab = document.getElementById(tabId);

    if (tab) {

        tab.classList.remove("active");

        tab.classList.add("hidden");

    }

});


const selectedTab = document.getElementById(tabName);

if (selectedTab) {

    selectedTab.classList.remove("hidden");

    selectedTab.classList.add("active");

}


document.querySelectorAll("[data-tab]").forEach(function (button) {

    button.classList.toggle(
        "active",
        button.dataset.tab === tabName
    );

});

}

// Connect navigation buttons.

document.querySelectorAll("[data-tab]").forEach(function (button) {

button.addEventListener("click", function () {

    switchTab(button.dataset.tab);

});

});

// ==========================================
// SEARCH BUTTON
// ==========================================

const searchButton = document.getElementById("searchButton");

const searchArea = document.getElementById("searchArea");

const searchInput = document.getElementById("searchInput");

if (searchButton && searchArea) {

searchButton.addEventListener("click", function () {

    const isHidden = searchArea.classList.contains("hidden");

    if (isHidden) {

        searchArea.classList.remove("hidden");

        if (searchInput) {
            searchInput.focus();
        }

    } else {

        searchArea.classList.add("hidden");

    }

});

}

// ==========================================
// LOGOUT
// ==========================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {

logoutButton.addEventListener("click", async function () {

    const confirmed = confirm(
        "Are you sure you want to log out?"
    );

    if (!confirmed) return;


    try {

        await logoutUser();

    } catch (error) {

        console.error("Logout error:", error);

        alert(friendlyError(error.code));

    }

});

}

// ==========================================
// FIREBASE LOGIN STATE
// ==========================================

onAuthStateChanged(auth, function (user) {

if (user) {

    showApp(user);

} else {

    showAuth();

}

});

// ==========================================
// INITIALIZE SETTINGS
// ==========================================

initializeSettings();

// ==========================================
// INITIALIZE LOGIN METHOD
// ==========================================

initializeLoginMethod();

// ==========================================
// SERVICE WORKER REGISTRATION
// ==========================================

if ("serviceWorker" in navigator) {

window.addEventListener("load", function () {

    navigator.serviceWorker.register("./sw.js")

        .then(function (registration) {

            console.log(
                "MyWhatsApp service worker registered:",
                registration.scope
            );

        })

        .catch(function (error) {

            console.error(
                "Service worker registration failed:",
                error
            );

        });

});

  }
