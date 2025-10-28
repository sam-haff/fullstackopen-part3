const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage:\n node mongo.js <your_password>\n node mongo.js <your_password> <name> <number>')
  process.exit(1)
  return
}
const mongoPwd = process.argv[2]
const mongoUrl = `mongodb+srv://fullstack:${mongoPwd}@goalsappdbcluster.gqbpm.mongodb.net/phonebookApp?appName=GoalsAppDBCluster`

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)

const personSchema = mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number })
  person.save().then(() => {
    console.log('added ', name, ' ', number, ' to phonebook')
    mongoose.connection.close()
  })
  return
}

Person.find({}).then(result => {
  console.log('phonebook:')
  result.forEach( p => console.log(p.name, p.number) )
  mongoose.connection.close()
})


