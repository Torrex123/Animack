// FUNCTIONS TO PRINT THE TABLE AND ITS ELEMENTS:

// Function to print the list on the page.
async function PrintList() {

    const totalRows = await GetTotalRowsNumber();

    // If there's NO list.
    if (totalRows == 0) {
        document.getElementById("load-blocker").style.display = "none"; // Removing loading animation
        document.getElementsByClassName("no-content-container")[0].style.display = "flex";


        return;
    }
    
    // If there's at least 1 element.
    document.getElementsByClassName("list-container")[0].style.display = "block"; // Show the list.
    document.getElementById("recommendation-button").style.display = "block";

    // Create and show the elements.
    for (var i = 1; i <= totalRows; i++) {
        var data = await GetRowData(i);
        data = JSON.parse(data);

        CreateListElement(data, i);
    }

    document.getElementById("load-blocker").style.display = "none"; // Removing loading animation
}

// Function to get the total number of rows of a list.
function GetTotalRowsNumber() {
    return new Promise( (resolve) => {
        pywebview.api.getTotalRowsNumber('ANIME').then(function(response) {
            resolve(response);
        });
    });
}

// Function to get a single row of the database in python.
function GetRowData(index) {
    return new Promise( (resolve) => {
        pywebview.api.getDatabaseRow('ANIME',index).then(function(response) {
            resolve(response);
        });
    });
}

// Function to create a single element of the list.
function CreateListElement(data, i) {
    // In case of no information.
    if (data["episodes"] == "-") {
        data["episodes"] = "0";
    }

    // Creating the element
    let newListElement = document.createElement("tr");
    newListElement.innerHTML = `
        <td class="cover-image"><img id="cover-image" src="${data["coverimage"]}" alt=""></td>
        <td class="title">${data["title"]}</td>
        <td class="progress">
            <i class="fa-solid fa-circle-plus action-button" onclick="ChangeEpisodesByButtons(${data["id"]}, ${data["episodes"]}, 1, ${i})"></i>
            <input type="text" onkeypress="ValidateTextInput(event), ChangeEpisodesByEnterPress(${i})" maxlength="4" id="actual-progress-${i}" value="${data["progress"]}" onblur="ChangeEpisodesByTextInput(${data["id"]}, ${data["episodes"]}, value, ${i})"> / <span id="total-episodes">${data["episodes"]}</span>
            <i class="fa-solid fa-circle-minus action-button" onclick="ChangeEpisodesByButtons(${data["id"]}, ${data["episodes"]}, -1, ${i})"></i>
        </td>
        <td class="score">
            <i class="fa-solid fa-circle-plus action-button" onclick="ChangeScoreByButtons(${data["id"]}, 1, ${i})"></i>
            <input type="text" onkeypress="ValidateTextInput(event), ChangeScoreByEnterPress(${i})" maxlength="2" id="actual-score-${i}" value="${data["score"]}" onblur="ChangeScoreByTextInput(${data["id"]}, value, ${i})"> / 10
            <i class="fa-solid fa-circle-minus action-button" onclick="ChangeScoreByButtons(${data["id"]}, -1, ${i})"></i>
        </td>
        <td class="release-date">${data["releasedate"]}</td>
        <td class="status" id="status-${i}">${data["status"]}</td>
        <td class="info"><i class="fa-solid fa-circle-info moreinfo-button" onclick="ShowInfo(${data["id"]})" title="More info."></i></td>
        <td class="remove"><i class="fa-solid fa-trash remove-button" onclick="RemoveFromMyList(${data["id"]})" title="Remove from my list"></i></td>
    `;

    document.getElementById("list").appendChild(newListElement);
}

document.getElementById("load-blocker").style.display = "flex"; // Loading animation
// Print the list.
setTimeout(() => {
    PrintList();
}, 1000);





// Function to validate the characters of a Text Input Field.
function ValidateTextInput(evt) {
    var theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]/;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
}

// FUNCTIONS TO MANAGE PROGRESS:

// Function to change the progress if the Enter key is presseds.
function ChangeEpisodesByEnterPress(i) {
    // Handle enter
    if (event.keyCode === 13) {
        document.getElementById("actual-progress-"+i).blur();
    }
}

// Function to change the progress if the text input is used.
function ChangeEpisodesByTextInput(content_id, max_episodes, value, i) {

    if (value == "") {
        value = "0"
    }

    value = parseInt(value); // Parsing the value to int.

    // Validating the amount of progress.
    if (value < 0) {
        value = 0;
    } else if (value > max_episodes) {
        value = max_episodes;
    }

    document.getElementById("actual-progress-"+i).value = value; // Showing the final output.

    value = value.toString(); // Parsing the value to string.

    const statusField = document.getElementById(`status-${i}`);

    // Changing the watching status.
    if (value == max_episodes) {
        statusField.textContent = "FINISHED";
    } else {
        statusField.textContent = "ONGOING";
    }

    // Invoking the python function to change the progress.
    pywebview.api.changeProgressButton(value, 'ANIME', content_id);
}

// Function to change the progress if the buttons are used.
function ChangeEpisodesByButtons(content_id, max_episodes, value, i) {

    var textInputValue = parseInt(document.getElementById("actual-progress-"+i).value);
    value = parseInt(value);

    // Validating the amount of progress.
    if (textInputValue + value < 0) {
        document.getElementById("actual-progress-"+i).value = 0;
    } else if (textInputValue + value > max_episodes) {
        document.getElementById("actual-progress-"+i).value = max_episodes;
    } else {
        document.getElementById("actual-progress-"+i).value = textInputValue + value
    }

    const statusField = document.getElementById(`status-${i}`);

    // Changing the watching status.
    if (document.getElementById("actual-progress-"+i).value == max_episodes) {
        statusField.textContent = "FINISHED";
    } else {
        statusField.textContent = "ONGOING";
    }

    // Invoking the python function to change the progress.
    pywebview.api.changeProgressButton(document.getElementById("actual-progress-"+i).value, 'ANIME', content_id);
}

// FUNCTIONS TO MANAGE SCORE:

// Function to change the score if the Enter key is presseds.
function ChangeScoreByEnterPress(i) {
    // Handle enter
    if (event.keyCode === 13) {
        document.getElementById("actual-score-"+i).blur();
    }
}

// Function to change the score if the text input is used.
function ChangeScoreByTextInput(content_id, value, i) {
    if (value == "") {
        value = "0"
    }

    value = parseInt(value); // Parsing the value to int.

    // Validating the amount of progress.
    if (value < 0) {
        value = 0;
    } else if (value > 10) {
        value = 10;
    }

    document.getElementById("actual-score-"+i).value = value; // Showing the final output.

    value = value.toString(); // Parsing the value to string.

    // Invoking the python function to change the progress.
    pywebview.api.changeScoreButton(value, 'ANIME', content_id);
}

// Function to change the score if the buttons are used.
function ChangeScoreByButtons(content_id, value, i) {
    var textInputValue = parseInt(document.getElementById("actual-score-"+i).value);
    value = parseInt(value);

    // Validating the amount of score.
    if (textInputValue + value < 0) {
        document.getElementById("actual-score-"+i).value = 0;
    } else if (textInputValue + value > 10) {
        document.getElementById("actual-score-"+i).value = 10;
    } else {
        document.getElementById("actual-score-"+i).value = textInputValue + value
    }

    // Invoking the python function to change the progress.
    pywebview.api.changeScoreButton(document.getElementById("actual-score-"+i).value, 'ANIME', content_id);
}





// FUNCTIONS FOR THE REST OF BUTTONS:

// Function to get more info about an anime.
function ShowInfo(content_id) {

    document.getElementById("load-blocker").style.display = "flex"; // Loading animation.

    // Invoking the python function the get more detailed information about a certain production.
    pywebview.api.dataPreviewButton(parseInt(content_id), 'ANIME').then(function(response) {

        document.getElementById("load-blocker").style.display = "none"; // Stops loading animation.

        const data = JSON.parse(response); // Parsing the response into json format.

        // This toggles the pop-up on the screen.
        const pop_up = document.getElementById("pop-up");
        pop_up.classList.toggle("active");

        // This closes the pop-up.
        document.getElementById("close-btn")
            .addEventListener("click", function(event) {
                pop_up.classList.remove("active");
        });

        // Overlay to hide the background contents on the screen.
        document.getElementById("overlay")
            .addEventListener("click", function(event) {
                pop_up.classList.remove("active");
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

        // Editing some elements in base to the 'ANIME' content type.
        
        // Setting the information.
        document.getElementById("production-studio").innerHTML = "";
        if (data["Animationstudio"] != "" && data["Animationstudio"] != null) {
            document.getElementById("production-studio").innerHTML = "<b>Animation studio: </b>" + data["Animationstudio"];
        }
        
        document.getElementById("production-episodes").innerHTML = "";
        if (data["Episodes"] != "" && data["Episodes"] != null) {
            document.getElementById("production-episodes").innerHTML = "<b>Episodes: </b>" + data["Episodes"];
        }

        
    });
}

// Function to delete an anime from the user list.
function RemoveFromMyList(content_id) {
    document.getElementById("load-blocker").style.display = "flex"; // Loading animation.

    pywebview.api.removeButton('ANIME', content_id).then(function() {
        window.location.reload(); // Reload the page.
    });
}

// Function to get recommendations.
function GetRecommendation() {
    // Changing the styles of the rec. button.
    const recButton = document.getElementById("recommendation-button");
    recButton.setAttribute("onclick",""); // Removing the function of the button for a while
    recButton.classList.toggle("active");

    // Python function to get recommendations.
    pywebview.api.recommendationButton('ANIME').then(function (response) {
        
        const data = JSON.parse(response);

        // Showing the list
        const list = document.getElementById("recommendations-list");
        list.classList.toggle("active");

        if (response == 'No recommendations available') {
            // If there are no recommendations.
            list.innerHTML = `
                <div class="rec-close-btn" id="rec-close-btn">&times;</div>
                <p>${response}</p>
            `;
        } else {
            // If there are some recommendations.

            // Creating the elements:
            list.innerHTML = `
                <div class="rec-close-btn" id="rec-close-btn">&times;</div>
                <p>Since you have <span>${data["0"]["title"]}</span> in your list, you may like:</p>
                <div id="recommendations-container">

                </div>
            `;

            const container = document.getElementById("recommendations-container");

            for (var i = 1; i <= Object.keys(data).length - 1; i++) {
                let button = document.createElement("button");
                let index = i.toString()
                button.setAttribute("onclick",`ShowInfo(${data[index]["id"]})`);

                button.innerHTML = `
                    <img src="${data[index]["coverImage"]}">
                    <p>${data[index]["Title"]}</p>
                `;

                container.appendChild(button);
            }

        }

        // Close button
        const closeButton = document.getElementById("rec-close-btn");
        closeButton.addEventListener("click", function(event) {
            list.classList.remove("active");
            recButton.classList.remove("active");
            recButton.setAttribute("onclick","GetRecommendation()"); // Restoring the rec. button function.
        });

    });
}