import { useState } from "react"

const NewPersonForm = ({addPerson}) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const onNameChange = (e) => setNewName(e.target.value)
    const onNumberChange = (e) => setNewNumber(e.target.value)
    const onAdd = (e) => {
        e.preventDefault()
        addPerson(newName, newNumber)
    }

    return (
        <form onSubmit={onAdd}>
            <div>
                name<input value={newName} onChange={onNameChange}/>
            </div>
            <div>
                number<input value={newNumber} onChange={onNumberChange}/>
            </div>
            <button type="submit">add</button>
        </form>
    )
}

export default NewPersonForm
