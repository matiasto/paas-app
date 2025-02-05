// main.js

// Parse initialization
Parse.initialize("6vTDvGS025ejo7MuMg3mpSSsbUQ05vjmArGj1iSB", "2VH3nnKExXqMgy2m1t8CNaC6PmBq9Js1cybnl59p");
Parse.serverURL = "https://parseapi.back4app.com";


// Sign Up
const signupForm = document.getElementById("signup-form");
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
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
}

// Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        try {
            const user = await Parse.User.logIn(username, password);
            alert(`Welcome, ${user.get("username")}! You're logged in.`);
        } catch (error) {
            alert(`Login failed: ${error.message}`);
        }
    });
}

// File Upload
const fileUploadForm = document.getElementById("file-upload-form");
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
                // Save
                await parseFile.save();
                alert("file uploaded successfully");

                // We probably should associate the file with a Parse Object
                const FileObject = Parse.Object.extend("FileObject");
                const fileObject = new FileObject();
                fileObject.set("file", parseFile);

                await fileObject.save();
                console.log("File object saved to DB with pointer to the file");
            } catch (error) {
                alert(`File upload failed: ${error.message}`);
        }
        } else {
            alert("select a file before uploading");
        }
        });
}
