const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const port = 7000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sequelize = new Sequelize("DB_name", "DB_username", "DB_password", {
  dialect: "mysql",
});

const blog_table = sequelize.define(
  "blog_table",
  {
    title: Sequelize.STRING,
    desc: Sequelize.TEXT,
  },
  { tableName: "blog_table" }
);

blog_table.sync();

sequelize
  .authenticate()
  .then(() => {
    console.log("connection made successfully");
  })
  .catch((err) => console.log(err, "this has a error"));

app.post("/", async (req, res) => {
  const title = req.body.title;
  const desc = req.body.desc;
  const saveBlog = blog_table.build({
    title,
    desc,
  });
  await saveBlog.save();
  res.send("data posted ");
});

app.get("/", async (req, res) => {
  const alldata = await blog_table.findAll();
  res.json(alldata);
});

app.put("/:id", (req, res) => {
  const data = req.body.data;
  blog_table.update(
    {
      desc: data,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  res.redirect("/");
});

app.delete("/:id", (req, res) => {
  blog_table.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`server starts at http://localhost:${port}`);
});
