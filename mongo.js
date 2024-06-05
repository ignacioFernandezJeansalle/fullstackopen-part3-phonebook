const mongoose = require("mongoose");
//require("dotenv").config();

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://ignaciofj:${password}@cluster0.6hgqkmt.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

const getAll = process.argv.length === 3;
const createPerson = process.argv.length === 5;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (getAll || createPerson) {
  mongoose.connect(url);
}

if (getAll) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (createPerson) {
  const newName = process.argv[3];
  const newNumber = process.argv[4];

  const newPerson = new Person({
    name: newName,
    number: newNumber,
  });

  newPerson.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
