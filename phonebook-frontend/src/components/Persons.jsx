const Person = ({person, removePerson}) => {
    return (
        <div>{person.name} {person.number}<button onClick={removePerson}>delete</button></div>
    )
}

const Persons = ({persons, removePerson}) => (
    <div>
        {persons.map((person) => 
            <Person key={person.id} person={person} removePerson={() => removePerson(person)}/>)}
    </div>
)

export default Persons;