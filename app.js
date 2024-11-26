const express = require("express");
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
    sets: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "Set"}],
        default:[],
    },
    creator: String,
    workout: { type: mongoose.Schema.Types.ObjectId, ref: "Workout" },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

const exListSchema = new mongoose.Schema({
    name: String,
    desc: String,
    creator: String,
    templateEx: {type: Boolean, default: true},
});

const exList = mongoose.model("exList", exListSchema);

const workoutSchema = new mongoose.Schema({
    title: String,
    creator: String,
    desc: String,
    exercises: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
        default:[],
    },
    isTemplate: { type: Boolean, default: false },
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
        const Workouts = await Workout.find({creator: req.user.username});
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

    const workout = new Workout({
        title: null,
        creator: req.user.username,
        desc: null,
        exercises: []
    });

    try{
        await workout.save();
        res.redirect("/workout?workoutId=" + workout._id);
    } catch ( err ){
        console.log ( err );
    }
});

app.get("/workout", async(req, res) => {
    if(req.isAuthenticated()){
        try{
            const activeworkout = await Workout.findById(req.query.workoutId).populate({
                path: "exercises",
                populate: { path: "sets" },
              });
            res.render("workout", {activeworkout, username: req.user.username});
        } catch (err) {
            console.log(err);
        }
        
    } else {
        console.log ("was not authorized");
        res.redirect("/");
    }
});

app.post("/addSet", async (req, res) => {
    if(!req.isAuthenticated()) return res.redirect("/");

    const { exerciseId, workoutId } = req.body;

    const exercise = await Exercise.findById(exerciseId);
    const activeworkout = await Workout.findById(workoutId);

    const totalSets = await Set.find({ exercise: exerciseId });
    const newSetNumber = totalSets.length + 1;

    const newSet = new Set({
        setNumber: newSetNumber,
        weight: null,
        reps: null,
        creator: req.user.username,
        exercise: exercise._id,
    });

    try{
        await newSet.save();

        exercise.sets.push(newSet); // why not pushing id?
        await exercise.save();

        res.redirect(`/workout?workoutId=${workoutId}`);
    } catch ( err ){
        console.log ( err );
    }
});

app.post("/addExtoList", async (req, res) => {
    if(!req.isAuthenticated()) return res.redirect("/");

    const { workoutId } = req.body;

    const newListEx = new exList({
        name: req.body.Exname,
        desc: req.body.Desc,
        creator: req.user.username,
        templateEx: false,
    });
    try{
        await newListEx.save();
        res.redirect("/add-exercisepage?workoutId=" + workoutId);
    } catch ( err ){
        console.log ( err );
    }
});

app.get("/add-exercisepage", async (req, res) => {
    if(req.isAuthenticated()){
        try{
            const exLists = await exList.find({
                $or: [
                    {creator: req.user.username},
                    {templateEx: true},
                ]
        });
            const activeworkout = await Workout.findById(req.query.workoutId);
            
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
        
        workout.exercises.push(newEx._id);
        await workout.save();

        res.redirect(`/workout?workoutId=${workoutId}`);
    } catch ( err ){
        console.log ( err );
    }
});

app.post("/finishSet", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/");

    const { setId, workoutId, Weight, Reps } = req.body;

    try {
        // Find the set to update
        const set = await Set.findById(setId);
        
        // Update the weight and reps for this set
        set.weight = parseFloat(Weight) || 0;
        set.reps = parseInt(Reps) || 0;

        // Save the updated set
        await set.save();

        // Redirect back to the workout page to see the updated set
        res.redirect(`/workout?workoutId=${workoutId}`);
    } catch (err) {
        console.log(err);
        res.redirect(`/workout?workoutId=${workoutId}`);
    }
});

app.post("/finishWorkout", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/");

    const { workoutId, workoutname, WorkoutDesc } = req.body;
    const isTemp = !!req.body.Template;

    try {
        // Find the workout by ID
        const workout = await Workout.findById(workoutId);

        if (!workout) {
            console.log("Workout not found");
            return res.redirect("/home");
        }

        if(workout.exercises.length === 0) {
            await Workout.findByIdAndDelete(workoutId);
            console.log("No exercises in workout, workout deleted");
            return res.redirect("/home");
        }

        // Update the workout's title and description
        workout.title = workoutname;
        workout.desc = WorkoutDesc;
        workout.isTemplate = isTemp;

        // Save the updated workout
        await workout.save();

        // Redirect back to the home page
        res.redirect("/home");
    } catch (err) {
        console.log(err);
        res.redirect("/home");
    }
});


app.post("/useTemplate", async (req, res) =>{
    if (!req.isAuthenticated()) return res.redirect("/");

    const {workoutId} = req.body;

    try{
        const templateWorkout = await Workout.findById(workoutId).populate({
            path: "exercises",
            populate: { path: "sets"},
        });

        if(!templateWorkout){
            console.log("Template workout not found");
            return res.redirect("/home");
        }

        const newWorkout = new Workout ({
            title: null,
            creator: req.user.username,
            desc: null,
            exercises: [],
            isTemplate: false,
        });

        await newWorkout.save();

        for (const exercise of templateWorkout.exercises) {
            const newExercise = new Exercise ({
                name: exercise.name,
                sets: [],
                creator: req.user.username,
                workout: newWorkout._id,
            });

            await newExercise.save();

            for (const set of exercise.sets) {
                const newSet = new Set({
                    setNumber: set.setNumber,
                    weight: set.weight,
                    reps: set.reps,
                    creator: req.user.username,
                    exercise: newExercise._id,
                });

                await newSet.save();
                newExercise.sets.push(newSet._id);
            }

            await newExercise.save();
            newWorkout.exercises.push(newExercise._id);
        }
        
        await newWorkout.save();

        res.redirect(`/workout?workoutId=${newWorkout._id}`);

    } catch (err) {
        console.log (err);
        res.redirect("/home");
    }
});

app.post("/workoutunfinished", async (req, res) => {

const {workoutId} = req.body;

await Workout.findByIdAndDelete(workoutId);
            console.log("No exercises in workout, workout deleted");
            return res.redirect("/home");

});

app.post("/logoutworkout", async (req, res) => {

    const {workoutId} = req.body;
    
    await Workout.findByIdAndDelete(workoutId);
                console.log("No exercises in workout, workout deleted");
                return res.redirect("/logout");
    
    });

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
