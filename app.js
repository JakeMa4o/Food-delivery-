require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const https = require("https");
const { error } = require("console");


mongoose.connect(`mongodb+srv://admin-Jake:${process.env.PASSWORD}@cluster0.hzll9.mongodb.net/foodDB`, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Database connection Successful!");
});

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));



// Food API
const config = {
  endpoint: "https://api.spoonacular.com/recipes/complexSearch",
  key: `${process.env.API_KEY}`,
  query: "beef",
  maxFat: 25,
  number: 50
}
const apiLink = `${config.endpoint}?apiKey=${config.key}&query=${config.query}&maxFat=${config.maxFat}&number=${config.number}`;

// Items we get from https call
const foodsApi = [];

// HTTPS request through API
https.get(apiLink, (response) => {
  let body = "";
  response.on("data", (chunk) => {
    body += chunk;
  });
  response.on("end", () => {
    const data = JSON.parse(body);
    data.results.forEach((item => {
      foodsApi.push(item);
      // console.log(foodsApi);
    }));
  });
}).on("error", (error) => console.error(error.message));

// User's backet of purchases
const foodSchema = new mongoose.Schema({
  title: String,
  url: String,
  nutrientsTitle: String,
  nutrientsAmount: Number,
  _id: String
});

const Food = mongoose.model("Food", foodSchema);


app.get("/", (req, res) => {
  res.render("home", { data: foodsApi});
});


// I do not know if this is legal but i works somehow
app.post("/", (req, res) => {

  // console.log(foodsApi);
  if (foodsApi !== "") {
      foodsApi.forEach(item => {

        Food.findOne({_id: req.body.id}, (err,obj)=> {
          if (err) {
            console.error(error.message);
          } else {
            // Sort out if document already exist or not then add to db
            if (!obj) {
              if (item.id === Number(req.body.id)) {
                  const foodItem = new Food({
                    title: item.title,
                    url: item.image,
                    nutrientsTitle: item.nutrition.nutrients[0].title,
                    nutrientsAmount: item.nutrition.nutrients[0].amount,
                    _id: item.id
                  })
                  foodItem.save((err, doc) => {
                    if (err) {
                      console.error(error.message);
                    } else {
                      console.log("Document inserted succussfully!");
                    }
                  });
              }
            } else {
              if (item.id === Number(req.body.id)) {
                console.log("this item already exists");
              }
            }
          }
        })
      })
  }
});




app.get("/bag", (req, res) => {
  Food.find({}, (err, foods)=>{
    // Number of items on db
    Food.count({}, (err, result)=>{
      if (err) {
        console.error(error.message);
      } else {
        res.render("bag", {foods: foods, amountOfFoods: result});
      }
    })
  });
})


app.post("/bag", (req, res) => {
  Food.findOneAndDelete({_id: req.body.id}, (err, docs)=> {
    if (err) {
      console.error(error.message);
    } else {
      console.log("Deleted doc: ", docs);
      res.redirect("/bag");
    }
  })
})



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen( port, () => {
  console.log("server is up and running on port 3000");
})