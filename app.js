const express = require("express");
const fs = require("fs");
const session = require("express-session");

const app = express(); 

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.set("view engine", "ejs");

app.use(session({
    secret: "yourSecretKey", // Replace with a strong secret key
    resave: false,
    saveUninitialized: false, // Only save sessions if there is data to save
}));

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

let users = [];
let workouts = [];
let exercises = [];
let activeExercises = [];

// Load and save functions
function loadUsers() {
    try {
        users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    } catch {
        users = [];
    }
}

function loadWorkouts() {
    try {
        workouts = JSON.parse(fs.readFileSync('workout.json', 'utf8'));
    } catch {
        workouts = [];
    }
}

function loadEx() {
    try {
        exercises = JSON.parse(fs.readFileSync('exercise.json', 'utf8'));
    } catch {
        exercises = [];
    }
}

function loadActiveExercises() {
    try {
        activeExercises = JSON.parse(fs.readFileSync('activeEx.json', 'utf8'));
    } catch {
        activeExercises = [];
    }
}


function saveUsers() {
    fs.writeFileSync('users.json', JSON.stringify(users));
}

function saveWorkouts() {
    fs.writeFileSync('workout.json', JSON.stringify(workouts));
}

function saveEx() {
    fs.writeFileSync('exercise.json', JSON.stringify(exercises));
}

function userExists(username) {
    return users.some(user => user.username === username);
}

function findUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

function saveActiveExercises() {
    fs.writeFileSync('activeEx.json', JSON.stringify(activeExercises));
}

// Route for login page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

// Process login
app.post("/login", (req, res) => {
    loadUsers();
    const { username, password } = req.body;
    const user = findUser(username, password);

    if (user) {
        req.session.user = user; // Store full user object in session
        console.log("Logged in as:", req.session.user.username);
        res.redirect("/app");
    } else {
        res.redirect("/");
    }
});

// Registration route
app.post("/register", (req, res) => {
    loadUsers();
    const { username, password, email } = req.body;

    if (!userExists(username)) {
        users.push({ username, password, email });
        saveUsers();
        res.redirect("/");
    } else {
        console.log("Username already exists");
        res.redirect("/");
    }
});

// Route to render home page with workouts
app.get("/app", (req, res) => {
    if (req.session.user) {
        loadWorkouts();
        console.log("Logged in as:", req.session.user.username);
        res.render("home", { username: req.session.user.username, workouts });
    } else {
        res.redirect("/"); // Redirect to login if session is missing
    }
});

// Route to add a new exercise
app.post("/addEx", (req, res) => {
    if (req.session.user) {
        const { Exname, Desc } = req.body;

        const newEx = {
            Exname,
            Desc,
            creator: req.session.user.username
        };

        exercises.push(newEx);
        saveEx();
        res.redirect("/add-exercises");
    } else {
        res.redirect("/");
    }
});

// Route to render add-exercise page
app.get("/add-exercises", (req, res) => {
    if (req.session.user) {
        loadEx();
        console.log("Logged in as:", req.session.user.username);
        res.render("add-exercise", { exercises, username: req.session.user.username });
    } else {
        res.redirect("/");
    }
});

