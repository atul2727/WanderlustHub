const express = require("express")
const app = express()
const port = 3000
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const path = require("path");
// const { connect } = require("http2")
const session = require("express-session")
const flash = require("connect-flash")
const methodOverride = require('method-override');
const {listingSchema, reviewSchema} = require("./schemas.js")

const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

// After app has been defined
app.use(methodOverride('_method'));

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust"


main()
    .then(() => {
        console.log("Connected to the database")
    })
    .catch(err => console.log(err))

async function main() {
    await mongoose.connect(mongo_url);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // Allows us to access data from forms in the request body
app.engine("ejs", ejsMate);


const sessionOptions = {
    secret: "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true                          // to prevent from cross scripting attacks
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    // console.log(res.locals.success);
    next()
})

// app.get("/demouser", async (req, res)=>{
//     let fakeuser = new User ({
//         email: "akj@g.com",
//         username: "akj",
//     })
//     let newUser = await User.register(fakeuser, "password");
//     res.send(newUser);
// })

//  Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

// express middleware
app.use((err, req, res, next) => {
    // res.send("Something went wrong");
    const { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.render("listings/error.ejs", { err });
})

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
