// FUNCTIONS TO ADJUST PREFERENCES

// Get the user default preference on page load.
function GetDefaultPreference() {
    pywebview.api.defaultPreference().then(function(response) {
    
        const checkbox = document.getElementById("mature-checkbox");
        
        if (response == 'adult') {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }

        document.getElementById("load-blocker").style.display = "none"; // Removing the loading animation

    });
}

// Set the user new preference
function ChangePreference(checked) {
    var preference;

    if (checked == true) {
        preference = 'adult';
    } else {
        preference = 'noadult';
    }

    pywebview.api.preferenceButton(preference);
}

document.getElementById("load-blocker").style.display = "flex"; // Loading animation
// Print the list.
try {
    setTimeout(() => {
        GetDefaultPreference();
    }, 1000);
} catch {
    window.location.reload(); // Reload the page.
}






// FUNCTIONS TO MANAGE THE USER LIST

// Pop-up
const pop_up = document.getElementById("pop-up");

// Function to display the pop-up on the screen.
function ConfirmDialog(purpose) {

    // This toggles the pop-up on the screen.
    pop_up.classList.toggle("active");

    // This closes the pop-up.
    document.getElementById("cancel-btn")
        .addEventListener("click", function(event) {
            pop_up.classList.remove("active");
    });

    // Overlay to hide the background contents on the screen.
    document.getElementById("overlay")
        .addEventListener("click", function(event) {
            pop_up.classList.remove("active");
    });

    // Depending on user's purpose, the confirm button will do different things.
    if (purpose == "delete") {  // Delete the user list.
        document.getElementById("pop-up-message").innerHTML = "This action will delete your list <span>permanently</span>. Proceed?"
        document.getElementById("confirm-btn").setAttribute("onclick","DeleteList()");
    } else { // Import a different list.
        document.getElementById("pop-up-message").innerHTML = "This action will <span>overwrite</span> your current list. Proceed?"
        document.getElementById("confirm-btn").setAttribute("onclick","ImportList()");
    }

}

// Function to get the OS of the user.
function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator?.userAgentData?.platform ?? window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
}

// Function to import a different list.
function ImportList() {
    
    pop_up.classList.remove("active"); // Removing the pop-up
    document.getElementById("load-blocker").style.display = "flex"; // Loading animation

    pywebview.api.openFileDialog().then(function(response) {
        try {
            const filePath = String.raw`${response[0]}`; // Specifying the file path.

            pywebview.api.importButton(filePath); // Python function to import the new list.

            document.getElementById("load-blocker").style.display = "none"; // Removing loading animation
            document.getElementById("import-note").classList.add("active"); // Showing a warning message

            setTimeout(() => {
                document.getElementById("import-note").classList.remove("active"); // Deleting a warning message
            }, 5000);
        } catch {
            document.getElementById("load-blocker").style.display = "none"; // Removing loading animation
        }

    });

}

// Function to export the current list.
function ExportList() {

    pop_up.classList.remove("active"); // Removing the pop-up
    document.getElementById("load-blocker").style.display = "flex"; // Loading animation

    pywebview.api.saveFileDialog().then(function(response) {
        try {
            var routeArray;

            // Getting the OS of the user and splitting the path depending on it.
            if (getOS() == 'Windows') {
                routeArray = response.split('\\');
            } else if (getOS() == 'Linux') {
                response = response.join('');
                routeArray = response.split('/');
            }

            let lastIndex = routeArray.length - 1;

            var fileName = routeArray[lastIndex]; // Specifying the file name.

            const fileNameArray = fileName.split('.');
            lastIndex = fileNameArray.length - 1;

            // Validating the extension on the file name.
            if (fileNameArray[lastIndex] != "db") {
                fileName = fileName + ".db";
            }

            routeArray.pop();

            const filePath = String.raw`${routeArray.join('/') + '/'}`; // Specifying the file path.

            pywebview.api.exportButton(filePath, fileName); // Python function to export the list.

            document.getElementById("load-blocker").style.display = "none"; // Removing loading animation
        } catch {
            document.getElementById("load-blocker").style.display = "none"; // Removing loading animation
        }
        
    });
}

// Function to delete the user list.
function DeleteList() {

    pop_up.classList.remove("active"); // Removing the pop-up
    document.getElementById("load-blocker").style.display = "flex"; // Loading animation

    pywebview.api.deleteDatabaseButton().then(function() { // Deleting the user list.
        document.getElementById("load-blocker").style.display = "none"; // Removing loading animation
    });;
}
