const { da, faker } = require("@faker-js/faker");
const { createConnection } = require("mysql2");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const connection = createConnection({
  host: "localhost",
  user: "root",
  database: "my_app",
  password: "Parveen@8889",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user;`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in db");
  }
});

app.get("/user", (req, res) => {
  let q = `SELECT * FROM user;`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in db");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in db");
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formpass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formpass != user.password) {
        res.send("wrong password...");
      } else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        })
      }
    });
  } catch (err) {
    console.log(err);
    
    res.send("some error in db");
  }
});

app.listen("8080", () => {
  console.log("Server is lisenting to port 8080");
});

/*let q = "INSERT INTO user (id,username,email,password) VALUES ?";  -->inserting new randam data using faker
let data = [];
for (let i = 0; i < 1; i++) {
  data.push(getRandomUser());
  try {
  connection.query(q, [data], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
} catch (error) {
  console.log(error);
}
}*/
