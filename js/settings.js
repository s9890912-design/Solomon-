// =====================================
// MYWHATSAPP - SETTINGS
// =====================================


// =====================================
// THEME MANAGEMENT
// =====================================

export function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    saveTheme();
}


// =====================================
// SAVE THEME PREFERENCE
// =====================================

function saveTheme() {

    try {

        const theme = document.body.classList.contains("dark-mode")
            ? "enabled"
            : "disabled";

        localStorage.setItem("myWhatsAppDarkMode", theme);

    } catch (error) {

        console.error("Could not save theme preference:", error);

    }
}


// =====================================
// RESTORE SAVED THEME
// =====================================

export function loadTheme() {

    try {

        const savedTheme = localStorage.getItem("myWhatsAppDarkMode");

        if (savedTheme === "enabled") {

            document.body.classList.add("dark-mode");

        } else {

            document.body.classList.remove("dark-mode");

        }

    } catch (error) {

        console.error("Could not restore theme:", error);

    }
}


// =====================================
// INITIALIZE SETTINGS
// =====================================

export function initializeSettings() {

    loadTheme();

    const themeButton = document.getElementById("themeButton");

    const settingsTheme