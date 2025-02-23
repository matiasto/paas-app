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
        // populate models
        initModelCards();
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

// selected Image init
let selectedImage = null;

// models
const models = [
    { name: "Model A", url: "http://localhost:8001/process_image" },
    { name: "Model B", url: "http://localhost:8002/process_image" },
    { name: "Model C", url: "http://localhost:8003/process_image" }
];

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
                img.className = "img-thumbnail selectable-image";
                img.style.maxWidth = "200px";
                fileContainer.appendChild(img);

                // Click to select the image
                img.onclick = function () {
                    document.querySelectorAll(".selectable-image").forEach(image => {
                        image.style.border = "none";
                    });
                    img.style.border = "3px solid blue";
                    selectedImage = img.src; // Store selected image URL
                };
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

function initModelCards(){
    const modelsContainer = document.getElementById("modelsContainer");
    models.forEach(model => {
        const modelContainer = document.createElement("div");
        modelContainer.className = "model-container";
        modelContainer.id = `container-${model.name.replace(/\s+/g, "-").toLowerCase()}`;

        modelsContainer.appendChild(modelContainer);
        createModelCard(model, modelContainer);
    });
}

function createModelCard(model, container) {
    const card = document.createElement("div");
    card.className = "card mt-3";

    card.innerHTML = `
        <div class="card-body">
            <h2>${model.name} API Call on ${model.url}</h2>
            <p>Calls the ${model.name} container.</p>
            <button class="btn btn-info process-btn">Process Image!</button>
            <input type="number" class="argNr" placeholder="Enter Argument_number">
            <input type="number" class="slice_id" placeholder="Enter slice_id">
            <img class="resultImage" style="display:none; max-width:100%;">
        </div>
    `;

    // Attach event listener to the button
    card.querySelector(".process-btn").addEventListener("click", async function () {
        const argNr = card.querySelector(".argNr").value;
        const slice_id = card.querySelector(".slice_id").value;

        if (!selectedImage) {
            alert("Please select an image first.");
            return;
        }

        if (!argNr || !slice_id) {
            alert("Please enter argNr and slice_id.");
            return;
        }

        try {
            const response = await fetch(model.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl: selectedImage, argNr, slice_id })
            });

            if (!response.ok) {
                throw new Error("Failed to process image.");
            }

            const blob = await response.blob();
            const resultURL = URL.createObjectURL(blob);
            const imgElement = card.querySelector(".resultImage");
            imgElement.src = resultURL;
            imgElement.style.display = "block";
        } catch (error) {
            console.error("Error:", error);
            alert("Error processing image.");
        }
    });

    container.appendChild(card);
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
