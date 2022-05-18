var searchName, list, fixedType, actualPage; // Global variables for global scope.

// Submit action event for "Enter" key in the search bar.
document.getElementById("searchbar")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("submit").click();
        document.getElementById("searchbar").blur();
    }
});

// Function to create a single element of the results list.
function CreateListElement(i, data) {
    var queryIndex = (i - 1).toString();

    var resultTitle = data[queryIndex]["Title"]; var completeTitle = resultTitle; if (resultTitle.length > 35) resultTitle = resultTitle.substring(0,35)+"..."; // Getting the title of the anime/manga.
    var coverUrl = data[queryIndex]["coverImage"]; var contentId = data[queryIndex]["id"]; // Getting the image url and ID from each anime/manga.

    // Creating EACH element for the list.
    const newListElement = document.createElement("button"); newListElement.classList.add("list-element"); newListElement.setAttribute("onclick","ShowInfo(content_id, content_type)"); newListElement.content_type = fixedType; newListElement.content_id = contentId; list.appendChild(newListElement);
    const elementImage = document.createElement("img"); elementImage.src = coverUrl; newListElement.appendChild(elementImage); // Setting the image.
    const elementTitle = document.createElement("p"); elementTitle.textContent = resultTitle; elementTitle.setAttribute("title",completeTitle); newListElement.appendChild(elementTitle);
}

// Function to get the anime/manga by the user input.
function GetResult() {

    // Getting the anime/manga name from the search bar.
    searchName = document.getElementById("searchbar").value;
    document.getElementById("searchbar").value = "";

    // Checking which type of production the user wants to search (anime/manga).
    const radioButtons = document.querySelectorAll('input[name="type"]');
    var selectedType;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedType = radioButton.value;
            break;
        }
    }

    list = document.getElementById("results-list"); // Getting the results box in the HTML in which the query results will be going.

    // Validation for an empty input in the search bar.
    if (searchName == "") {
        document.getElementById("results-query").textContent = 'Write something in the search bar, uwu~';
        list.innerHTML = ""; document.getElementById("prev-page").style.display = "none"; document.getElementById("page-number").style.display = "none"; document.getElementById("next-page").style.display = "none";
        return;
    }

    document.getElementById("load-blocker").style.display = "flex"; // Loading animation to restrict user inputs while the python function loads.
    
    // Invoking the python function to get the results.
    pywebview.api.searchClickButton(searchName, selectedType.toUpperCase(), 1).then(function(response) {

        document.getElementById("load-blocker").style.display = "none"; // Removing the loading animation.

        // If statement to validate both cases:
        if (response == "No results") { // No results from the query.
            
            document.getElementById("results-query").textContent = 'No results for "'+searchName+'".';
            list.innerHTML = ""; document.getElementById("prev-page").style.display = "none"; document.getElementById("page-number").style.display = "none"; document.getElementById("next-page").style.display = "none";

        } else {    // Succesfully got results from the query.

            document.getElementById("results-query").textContent = 'Results for "'+searchName+'" ('+selectedType+')';
            fixedType = selectedType; actualPage = 1;

            const data = JSON.parse(response);  // Parsing the response into json format.

            list.innerHTML = "";

            // Creating the elements for the list.
            for (var i = 2 ; i <= Object.keys(data).length ; i++) {
                CreateListElement(i, data);
            }

            // Setting the buttons for the pages.
            document.getElementById("prev-page").style.display = "none"; document.getElementById("page-number").style.display = "none"; document.getElementById("next-page").style.display = "none";

            document.getElementById("page-number").textContent = "Page " + actualPage;document.getElementById("page-number").style.display = "block";
            
            if (data["0"]["Hasnextpage"] == true) {
                document.getElementById("next-page").style.display = "block";
            }
 
        }

    });

}

// Function to get the next page.
function GetNextPage() {

    actualPage = actualPage + 1; // Setting the new page.

    document.getElementById("load-blocker").style.display = "flex"; // Loading animation to restrict user inputs while the python function loads.

    // Invoking the python function to get the results for the next page.
    pywebview.api.searchClickButton(searchName, fixedType.toUpperCase(), actualPage).then(function(response) {
        
        document.getElementById("load-blocker").style.display = "none"; // Removing the loading animation.

        const data = JSON.parse(response); // Parsing the response into json format.

        list.innerHTML = "";

        // Creating the elements for the list.
        for (var i = 2 ; i <= Object.keys(data).length ; i++) {
            CreateListElement(i, data);
        }

        // Creating the buttons for the pages.
        document.getElementById("prev-page").style.display = "none"; document.getElementById("page-number").style.display = "none"; document.getElementById("next-page").style.display = "none";

        document.getElementById("prev-page").style.display = "block";

        document.getElementById("page-number").textContent = "Page " + actualPage;document.getElementById("page-number").style.display = "block";
            
        if (data["0"]["Hasnextpage"] == true) {
            document.getElementById("next-page").style.display = "block";
        }

    });
}

// Function to get the prev. page.
function GetPrevPage() {
    
    actualPage = actualPage - 1; // Setting the new page.

    document.getElementById("load-blocker").style.display = "flex"; // Loading animation.

    // Invoking the python function to get the previous results.
    pywebview.api.searchClickButton(searchName, fixedType.toUpperCase(), actualPage).then(function(response) {

        document.getElementById("load-blocker").style.display = "none"; // Stops loading animation.

        const data = JSON.parse(response); // Parsing the response into json format.

        list.innerHTML = "";

        // Creating the elements for the list.
        for (var i = 2 ; i <= Object.keys(data).length ; i++) {
            CreateListElement(i, data);
        }

        // Creating the buttons for the pages.
        document.getElementById("prev-page").style.display = "none"; document.getElementById("page-number").style.display = "none"; document.getElementById("next-page").style.display = "none";

        if (actualPage > 1) {
            document.getElementById("prev-page").style.display = "block";
        }

        document.getElementById("page-number").textContent = "Page " + actualPage;document.getElementById("page-number").style.display = "block";
            
        if (data["0"]["Hasnextpage"] == true) {
            document.getElementById("next-page").style.display = "block";
        }

    });
}

// Function to show the info about an anime/manga.
function ShowInfo(content_id, content_type) {

    document.getElementById("load-blocker").style.display = "flex"; // Loading animation.

    // Invoking the python function the get more detailed information about a certain production.
    pywebview.api.dataPreviewButton(parseInt(content_id), content_type.toUpperCase()).then(function(response) {

        document.getElementById("load-blocker").style.display = "none"; // Stops loading animation.

        const data = JSON.parse(response); // Parsing the response into json format.

        // This toggles the pop-up on the screen.
        const pop_up = document.getElementById("pop-up");
        pop_up.classList.toggle("active");

        // This closes the pop-up.
        document.getElementById("close-btn")
            .addEventListener("click", function(event) {
                pop_up.classList.remove("active");
                document.getElementById("add-to-list-alert").classList.remove("active");
        });

        // Overlay to hide the background contents on the screen.
        document.getElementById("overlay")
            .addEventListener("click", function(event) {
                pop_up.classList.remove("active");
                document.getElementById("add-to-list-alert").classList.remove("active");
        });

        // Creating the contents in the pop-up.

        document.getElementById("production-title").textContent = data["Title"]; document.getElementById("production-img").src = data["coverImage"];
        document.getElementById("production-status").innerHTML = "<b>Status: </b>" + data["Status"];

        document.getElementById("production-score").textContent = "- / 100"; if (data["Averagescore"] != null) document.getElementById("production-score").textContent = data["Averagescore"] + " / 100";
        document.getElementById("production-ranking").textContent = "# -"; if (data["Ranking"] != null) document.getElementById("production-ranking").textContent = "# " + data["Ranking"];

        const genres_tags = document.getElementById("genres-tags");
        genres_tags.innerHTML = "";
        for (let i in data["genres"]) {
            const genre = document.createElement("div");
            genre.classList.add("tag");
            genre.textContent = data["genres"][i];

            genres_tags.appendChild(genre);
        }

        if (data["Description"] == "" || data["Description"] == null) {
            document.getElementById("production-description").textContent = "No description available.";
        } else {
            if (data["Description"].length > 1000) data["Description"] = data["Description"].substring(0,1000) + "..."
            document.getElementById("production-description").innerHTML = data["Description"];
        }

        document.getElementById("anilist-link").href = "https://anilist.co/" + data["Type"].toLowerCase() + "/" + data["Id"];

        // Some elements in the pop-up may change depending on which type of content it is.
        if (data["Type"] == "ANIME") { // Anime case.

            // Clearing fields in case of null information.
            document.getElementById("production-volumes").innerHTML = ""; document.getElementById("production-chapters").innerHTML = "";
            
            // Setting the information.
            document.getElementById("production-studio").innerHTML = "";
            if (data["Animationstudio"] != "" && data["Animationstudio"] != null) {
                document.getElementById("production-studio").innerHTML = "<b>Animation studio: </b>" + data["Animationstudio"];
            }
            
            document.getElementById("production-episodes").innerHTML = "";
            if (data["Episodes"] != "" && data["Episodes"] != null) {
                document.getElementById("production-episodes").innerHTML = "<b>Episodes: </b>" + data["Episodes"];
            }

            // Setting attributes for the "Add to my List" button.
            document.getElementById("add-to-list").content_id = data["Id"]; document.getElementById("add-to-list").content_type = data["Type"];

        } else { // Manga case.

            // Clearing fields in case of null information.
            document.getElementById("production-studio").innerHTML = ""; document.getElementById("production-episodes").innerHTML = "";

            // Setting the information.
            document.getElementById("production-volumes").innerHTML = "";
            if (data["Volumes"] != "" && data["Volumes"] != null) {
                document.getElementById("production-volumes").innerHTML = "<b>Volumes: </b>" + data["Volumes"];
            }
            
            document.getElementById("production-chapters").innerHTML = "";
            if (data["Episodes"] != "" && data["Episodes"] != null) {
                document.getElementById("production-chapters").innerHTML = "<b>Chapters: </b>" + data["Episodes"];
            }

            // Setting attributes for the "Add to my List" button.
            document.getElementById("add-to-list").content_id = data["Id"]; document.getElementById("add-to-list").content_type = data["Type"];

        }
    });
}

// Function to add an anime/manga to the user list.
function AddToMyList(content_id, content_type) {
    
    document.getElementById("add-to-list-loader").classList.add("active");  // Loading animation for the button.
    
    document.getElementById("add-to-list").setAttribute("onclick",""); // Blocking the function of the button.
    document.getElementById("add-to-list").classList.add("active"); // Changing the styles for the button.

    // Invoking the python function to add the content to the user list.
    pywebview.api.addButton(content_id, content_type).then(function(response) {

        // Printing the message from the backend on the alert.
        document.getElementById("alert-msg").textContent = response;

        // If added:
        if (response == "Succesfully added!") {
            document.getElementById("alert-icon").classList.remove("fa-circle-exclamation"); document.getElementById("alert-icon").classList.add("fa-circle-check");
            document.getElementById("add-to-list-alert").classList.add("added");
        // If it already exists:
        } else {
            document.getElementById("alert-icon").classList.remove("fa-circle-check"); document.getElementById("alert-icon").classList.add("fa-circle-exclamation");
            document.getElementById("add-to-list-alert").classList.remove("added");
        }

        // Showing the alert.
        document.getElementById("add-to-list-alert").classList.remove("active");
        setTimeout(function() {
            document.getElementById("add-to-list-alert").classList.add("active");
        }, 100);
        document.getElementById("add-to-list-loader").classList.remove("active"); // Un-loading animation for the button.
        document.getElementById("add-to-list").setAttribute("onclick","AddToMyList(content_id, content_type)"); // Un-blocking the function of the button.
        document.getElementById("add-to-list").classList.remove("active"); //Changing the styles for the button after loading.

        // Event listener in the close button to close the alert.
        document.getElementById("close-alert")
            .addEventListener("click", function(event) {
                document.getElementById("add-to-list-alert").classList.remove("active");
        });

    });

}