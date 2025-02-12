// public/js/main.js

// back4app setup (Parse initialization)
Parse.initialize("6vTDvGS025ejo7MuMg3mpSSsbUQ05vjmArGj1iSB", "2VH3nnKExXqMgy2m1t8CNaC6PmBq9Js1cybnl59p");
Parse.serverURL = "https://parseapi.back4app.com";

// testing out to cache some DOM elements for quicker access (works pretty shit right now)
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const fileUploadForm = document.getElementById("file-upload-form");
const gallery = document.getElementById("gallery");
const logoutBtn = document.getElementById("logout-btn");

// check if logged in
window.addEventListener("load", async () => {
    const currentUser = Parse.User.current();
    if (currentUser) {
        // If logged in, show app section
        showAppSection();
        // Populate the gallery with existing files
        await fetchUserFiles();
    } else {
        // else, show auth section
        showAuthSection();
    }
});

// Helper function to show/hide sections
function showAuthSection() {
    authSection.style.display = "block";
    appSection.style.display = "none";
}

function showAppSection() {
    authSection.style.display = "none";
    appSection.style.display = "block";
}

// Sign Up
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;

        try {
            const user = new Parse.User();
            user.set("username", username);
            user.set("password", password);

            await user.signUp();
            alert("User signed up successfully!");
            showAppSection();
            await fetchUserFiles();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
}

// Login
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        try {
            const user = await Parse.User.logIn(username, password);
            alert(`Welcome, ${user.get("username")}! You're logged in.`);
            showAppSection();
            await fetchUserFiles();
        } catch (error) {
            alert(`Login failed: ${error.message}`);
        }
    });
}

// File Upload + associate with the user
if (fileUploadForm) {
    fileUploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById("file-input");
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const name = file.name;

            // Create a new Parse.File
            const parseFile = new Parse.File(name, file);

            try {
                // Save the file
                await parseFile.save();
                alert("File uploaded successfully");

                // Save a FileObject record in DB, associating it with the user
                const FileObject = Parse.Object.extend("FileObject");
                const fileObject = new FileObject();
                fileObject.set("file", parseFile);
                fileObject.set("owner", Parse.User.current()); // <--- Here we associate to current user

                await fileObject.save();
                console.log("File object saved to DB with pointer to the file.");

                // Reload to show the newly uploaded file
                await fetchUserFiles();
            } catch (error) {
                alert(`File upload failed: ${error.message}`);
            }
        } else {
            alert("Select a file before uploading");
        }
    });
}

// Fetch only the current user's files and render them
async function fetchUserFiles() {
    gallery.innerHTML = ""; // Clear current gallery
    const FileObject = Parse.Object.extend("FileObject");
    const query = new Parse.Query(FileObject);

    // Only get files belonging to the current user
    query.equalTo("owner", Parse.User.current());

    try {
        const results = await query.find();
        results.forEach((fileObj) => {
            const file = fileObj.get("file");
            if (!file) return;

            const fileUrl = file.url();
            const fileId = fileObj.id; // Get the object ID of the file entry

            // a container for image + delete button
            const fileContainer = document.createElement("div");
            fileContainer.className = "m-2 d-flex flex-column align-items-center";

            // display the imagers
            if (/\.(jpe?g|png|gif|bmp)$/i.test(fileUrl)) {
                const img = document.createElement("img");
                img.src = fileUrl;
                img.alt = "User uploaded file";
                img.className = "img-thumbnail";
                img.style.maxWidth = "200px";
                fileContainer.appendChild(img);
            }

            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "btn btn-danger btn-sm mt-2";
            deleteBtn.onclick = () => deleteFile(fileId, fileContainer);
            fileContainer.appendChild(deleteBtn);

            // container to gallery
            gallery.appendChild(fileContainer);
        });
    } catch (error) {
        console.error("Error fetching user files:", error);
    }
}


// Logout
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await Parse.User.logOut();
            alert("You have been logged out.");
            showAuthSection();
        } catch (error) {
            alert(`Logout failed: ${error.message}`);
        }
    });
}

// Model call, now just a skeleton to see if it works
// The docker is an local instance.
const callModelBtn = document.getElementById("call-model-btn");
if (callModelBtn) {
    callModelBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("http://localhost:8001/message");
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const data = await response.json();
            alert(`${data.funny_message}`);
        } catch (error) {
            console.error(error);
            alert(`Error fetching funny message: ${error.message}`);
        }
    });
}


// Function to delete a file from Parse and update UI
async function deleteFile(fileId, fileElement) {
    const confirmDelete = confirm("Are you sure you want to delete this photo?");
    if (!confirmDelete) return;

    try {
        const FileObject = Parse.Object.extend("FileObject");
        const query = new Parse.Query(FileObject);

        const fileObj = await query.get(fileId);

        if (!fileObj) {
            alert("File not found.");
            return;
        }

        await fileObj.destroy();
        alert("File deleted successfully!");

        fileElement.remove();
    } catch (error) {
        console.error("Error deleting file:", error);
        alert(`Failed to delete file: ${error.message}`);
    }
}
