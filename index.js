const express = require("express");
const app = express();
const PORT = 3001;

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Phonebook");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) return res.status(404).end();

  res.json(person);
});

app.get("/info", (req, res) => {
  const numberOfPersons = persons.length;
  const date = new Date();
  res.send(`
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${date}</p>
    `);
});

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!person.name) return res.status(400).json({ error: "name is missing" });

  if (!person.number) return res.status(400).json({ error: "number is missing" });

  const duplicateName = persons.some((el) => el.name === person.name);
  if (duplicateName) return res.status(400).json({ error: "name must be unique" });

  const id = Math.floor(Math.random() * 1000000000);
  person.id = id;

  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
