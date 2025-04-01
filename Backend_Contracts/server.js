const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex")(require("./knexfile").development);

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get("/contacts", async (req, res) => {
  try {
    let query = knex("contacts");
    if (req.query.query) {
      query = query.where("name", "like", `%${req.query.query}%`).orWhere("email", "like", `%${req.query.query}%`);
    }
    const contacts = await query;
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve contacts" });
  }
});


app.post("/contacts", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const newContact = await knex("contacts").insert({ name, email }).returning("*");
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: "Failed to add contact" });
  }
});

app.delete("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await knex("contacts").where({ id }).del();

    if (deleted) {
      res.json({ message: "Contact deleted successfully" });
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
