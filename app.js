const express = require ( "express" );
const fs = require("fs");

const app = express(); 

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true})); 

app.set("view engine", "ejs");
app.use(express.json());

const port = 3000; 

app.listen (port, () => {
    console.log (`Server is running on http://localhost:${port}`);
});

let users = [];

function loadUsers() {
    try {
        users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    } catch {
        users = [];
    }
}

function saveUsers() {
    fs.writeFileSync('users.json', JSON.stringify(users));
}

function userExists(username) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return true;
        }
    }
    return false;
}

function findUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}


app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/public/login.html");
});

app.post("/login", (req, res)=> {
    loadUsers();
    const {username, password } = req.body;
    const user = findUser(username, password);
    if (user) {
        activeUser = user.username
        res.redirect(307, "/app");
    } else {
        res.redirect("/");
    }
})


app.post("/register", (req,res)=>{
    loadUsers();
    const { username, password, email} = req.body;
    if (!userExists(username)) {
        users.push({ username, password, email });
        saveUsers();
        res.redirect("/");
    } else {
        console.log("didn't work");
        res.redirect("/");
    }
});

app.post("/app", (req, res) => {
    res.render("home", { username: activeUser});
});
