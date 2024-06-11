require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const Person = require("./models/person");

const morgan = require("morgan");
const cors = require("cors");

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

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

//app.use(morgan("tiny"));
morgan.token("customBody", function (req, res) {
  if (req.method === "POST") return JSON.stringify({ name: req.body.name, number: req.body.number });
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :customBody"));

/* ----------------------------------------------------------------------------------------------- */

app
  .route("/api/persons")
  .get((req, res, next) => {
    Person.find({})
      .then((persons) => res.json(persons))
      .catch((error) => next(error));
  })
  .post((req, res, next) => {
    const person = req.body;

    if (!person.name) return res.status(400).json({ error: "name is missing" });
    if (!person.number) return res.status(400).json({ error: "number is missing" });

    const newPerson = new Person(person);

    newPerson
      .save()
      .then((person) => res.json(person))
      .catch((error) => next(error));
  });

app
  .route("/api/persons/:id")
  .get((req, res, next) => {
    const id = req.params.id;

    Person.findById(id)
      .then((person) => {
        if (!person) return res.status(404).end();
        res.json(person);
      })
      .catch((error) => next(error));
  })
  .put((req, res, next) => {
    const id = req.params.id;
    const { name, number } = req.body;

    Person.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context: "query" })
      .then((updatedPerson) => res.json(updatedPerson))
      .catch((error) => next(error));
  })
  .delete((req, res, next) => {
    const id = req.params.id;

    Person.findByIdAndDelete(id)
      .then((deletedPerson) => res.json(deletedPerson))
      .catch((error) => next(error));
  });

app.get("/info", (req, res) => {
  const numberOfPersons = persons.length;
  const date = new Date();
  res.send(`
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${date}</p>
    `);
});

/* ----------------------------------------------------------------------------------------------- */

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") return res.status(400).send({ error: "Malformatted id" });

  if (error.name === "ValidationError") return res.status(400).json({ error: error.message });

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
