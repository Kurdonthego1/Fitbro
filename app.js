const express = require("express");
const fs = require("fs");
const mongoose = require( "mongoose" );

const session = require("express-session");

const app = express(); 

const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
require("dotenv").config();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.set("view engine", "ejs");

app.use(session({
    secret: process.env.SECRET, // Replace with a strong secret key
    resave: false,
    saveUninitialized: false, // Only save sessions if there is data to save
}));

app.use (passport.initialize());
app.use (passport.session());

const port = 3000;

mongoose.connect('mongodb://localhost:27017/FitBro')
    .then(() => {
        console.log("Connected");

        // Insert data after successful connection
        //insertData();
    })
    .catch(error => {
        console.error("Connection error:", error);
    });

//Schemas ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const setSchema = new mongoose.Schema({
    setNumber: Number,
    weight: Number,
    reps: Number,
    creator: String,
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
});

const Set = mongoose.model("Set", setSchema);

const exerciseSchema = new mongoose.Schema({
    name: String,
    sets: [setSchema],
    creator: String,
    workout: { type: mongoose.Schema.Types.ObjectId, ref: "Workout" },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

const exListSchema = new mongoose.Schema({
    name: String,
    desc: String,
    creator: String,
});

const exList = mongoose.model("exList", exListSchema);

const workoutSchema = new mongoose.Schema({
    title: String,
    creator: String,
    desc: String,
    exercises: [exerciseSchema],
});

const Workout = mongoose.model("Workout", workoutSchema);

// END OF SCHEMAS  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// Route for login page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

// Process login
app.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, (err) => {
        if(err){
            console.log( err );
            return res.redirect("/");
        } else {
            passport.authenticate("local")(req, res, () => {
                return res.redirect("/home");
            });
        }
    });
});

//Logout Route
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
          return next(err); 
      }
      res.redirect('/');
    });
  });

// Registration route
app.post("/register", (req, res) => {
    User.register({username : req.body.username}, req.body.password, (err, user) =>{
        if(err) {
            console.log (err);
            return res.redirect("/");
        } else {
            passport.authenticate("local")(req, res, () => {
                return res.redirect('/home');
            });
        }
    });
});

// Route to render home page with workouts
app.get("/home", async(req, res) => {
    if (req.isAuthenticated()){
        try{
        const Workouts = await Workout.find({});
        res.render("home", {username: req.user.username, Workouts});
    } catch (err){
        console.log(err);
    }
    } else {
        console.log (" was not authorized");
        res.redirect("/");
    }
});

app.post("/add-workout", async (req, res) =>{
    if(!req.isAuthenticated()) return res.redirect("/");

    const newWorkout = new Workout({
        title: null,
        creator: req.user.username,
        desc: null,
        exercises: []
    });

    try{
        await newWorkout.save();
        res.redirect("/workout");
    } catch ( err ){
        console.log ( err );
    }
});

app.get("/workout", async(req, res) => {
    if(req.isAuthenticated()){
        try{
            const activeworkout = await Workout.find({});
            const activeEx = await Exercise.find({})
            const activeSet = await Set.find({})
            res.render("workout", {activeworkout, username: req.user.username, activeEx, activeSet});
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log ("was not authorized");
        res.redirect("/");
    }
})

app.post("/addSet", async (req, res) => {
    if(!req.isAuthenticated()) return res.redirect("/");

    const { exerciseId } = req.body;
    const { workoutId } = req.body;

    const exercise = await Exercise.findById(exerciseId);
    const activeworkout = await Workout.findById(workoutId);

    const userExSets = await Set.find({ creator: req.user.username, exercise: exerciseId });
    const newSetNumber = userExSets.length + 1;

    const newSet = new Set({
        setNumber: newSetNumber,
        weight: null,
        reps: null,
        creator: req.user.username,
        exercise: exercise._id,
    });

    try{
        await newSet.save();

        exercise.sets.push(newSet);
        await exercise.save();
        await activeworkout.save();

        res.redirect("/workout");
    } catch ( err ){
        console.log ( err );
    }
})

app.post("/addExtoList", async (req, res) => {
    if(!req.isAuthenticated()) return res.redirect("/");

    const newListEx = new exList({
        name: req.body.Exname,
        desc: req.body.Desc,
        creator: req.user.username,
    });
    try{
        await newListEx.save();
        res.redirect("/add-exercisepage");
    } catch ( err ){
        console.log ( err );
    }
});

app.get("/add-exercisepage", async (req, res) => {
    if(req.isAuthenticated()){
        try{
            const exLists = await exList.find({});
            const activeworkout = await Workout.findOne({});

            activeworkout._id = activeworkout._id.toString();
            
            res.render("add-exercise", {exLists, username: req.user.username, activeworkout});
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log ("User was not authorized");
        res.redirect("/");
    }
});

app.post("/addExtoWorkout", async (req, res) => {
    if(!req.isAuthenticated()) return res.redirect("/");

    const { workoutId } = req.body;

    const workout = await Workout.findById(workoutId);

    const newEx = new Exercise({
        name: req.body.Exname,
        sets: [],
        creator: req.user.username,
        workout: workout._id,
    });

    try{
        await newEx.save();
        
        workout.exercises.push(newEx);
        await workout.save();

        res.redirect("/workout");
    } catch ( err ){
        console.log ( err );
    }
});

app.post("/finishSet", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/");

    const { setId, exerciseId, Weight, Reps } = req.body;

    try {
        // Find the set to update
        const set = await Set.findById(setId);
        
        // Update the weight and reps for this set
        set.weight = Weight;
        set.reps = Reps;

        // Save the updated set
        await set.save();

        // Find the exercise and update if necessary
        const exercise = await Exercise.findById(exerciseId);
        if (exercise) {
            // Ensure the set is included in the exercise (should already be there, but this ensures it's updated correctly)
            const setIndex = exercise.sets.findIndex(s => s._id.toString() === setId);
            if (setIndex !== -1) {
                exercise.sets[setIndex] = set;
                await exercise.save();
            }
        }

        // Redirect back to the workout page to see the updated set
        res.redirect("/workout");
    } catch (err) {
        console.log(err);
        res.redirect("/workout");
    }
})




//Add an exercise
// app.post("/addEx", async(req, res) => {
//     if (req.session.user) {
//         const { Exname, Desc } = req.body;

//         const newEx =  {
//             Exname,
//             Desc,
//             creator: req.session.user.username
//         };

//         exercises.push(newEx);
//         saveEx();
//         res.redirect("/add-exercises");
//     } else {
//         res.redirect("/");
//     }
// });

// // 9. Submit an exercise to the database ////////////////////////////////
// // Note that in the username, we are using the username from the
// // session rather than the form
// app.post( "/addEx", async( req, res ) => {
//     console.log( "User " + req.user.username + " is adding the exercise:" );
//     console.log( req.body )
//     const exercise = new exercise({
//         userName:   req.user.username,
//         exerciseName:   req.body.exerciseName,
//         exercise: req.body.exercise
//     });

//     game.save();
//     res.redirect( "/home" );
// });
// ////////////////////////////////////////////////////////////////////


// // Route to render add-exercise page
// app.get("/add-exercises", (req, res) => {
//     if (req.session.user) {
//         loadEx();
//         console.log("Logged in as:", req.session.user.username);
//         res.render("add-exercise", { exercises, username: req.session.user.username });
//     } else {
//         res.redirect("/");
//     }
// });
