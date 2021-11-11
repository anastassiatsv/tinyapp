const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");    //telling Express to use EJS as templating engine

const bodyParser = require("body-parser");    //installed body-parser
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');  // installed cookie-parser
const { resolveInclude } = require("ejs");
app.use(cookieParser());  ////DO I NEED THIS LINE???

// -----------------//

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Function that generates random alphanumeric string
const generateRandomString = function()  {
  const result = Math.random().toString(36).substr(2,6);
  return result;
};

// Object that stores all the users
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};



// Main page
app.get("/urls", (req, res) => {
  // get user id from cookie
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});

// Page where we make a new request
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// generates a short URL and adds it to the database
app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  //console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});



//requests to the endpoint "/u/:shortURL" will redirect to its longURL website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(`http://${longURL}`);
});



////requests to Delete a url
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});


// app.post('/urls/:id', (req, res) => {

// // console.log(req.params.id);
// // console.log(req.body.longURL);
// urlDatabase[req.params.id] = req.body.longURL;

// //res.send('ok');
// //console.log(updateLongURL);
// //res.redirect('/urls');

// //});


app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  //console.log(shortURL)
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});


// Login page
app.post("/login", (req, res) => {
//const username = req.body.username;
//console.log(username);
  res.cookie('username', req.body.username);
  // res.cookie('user_id', req.body.username);
  res.redirect("/urls");
});


// REGISTRATION page, allowing user to register, using email and password
app.get("/register", (req, res) => {
  // get user id from cookie
  const userId = req.cookies["user_id"];
  console.log("This is the userId:", userId);
  console.log("the global user object: ", users);
  const user = users[userId];
  console.log("this is the USER: ", user);
  const templateVars = { urls: urlDatabase, user: user };
  res.render('urls_registration', templateVars);
});



//REGISTRATION page: handles the registration form data
app.post("/register", (req, res) => {
  console.log("this is our users before adding a new user:", users);
  const {email, password} = req.body;
  let userID = generateRandomString();
  //updatings users object
  const user = {
    id: userID,
    email: email,
    password: password
  };

  users[userID] = user;
  // users[abcd] = {
        //  id: abcd,
        // email: abcd@gmail.com,
        // password: hello
  //}
  res.cookie('user_id', userID);
  console.log("this is our users after adding a new user:", users);
  res.redirect('/urls');

});



//code for the server to listen to the client...
app.listen(PORT, () => {
  console.log(`tinyapp listening on port ${PORT}!`);
});


// app.get("/", (req, res) => {
//   res.send("Hello!");
// });
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


