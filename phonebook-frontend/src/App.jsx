import { useState, useEffect, useRef } from 'react'

import Persons from './components/Persons'
import NewPersonForm from './components/NewPersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'

import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([
  ])
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const notificationTimeoutId = useRef(null) // should persist between renders, needed to clear timeouts so that old timeout doesn't clear new notification

  const nameFilterLc = nameFilter.toLowerCase()
  const personsToShow = persons.filter( (p) => p.name.toLowerCase().indexOf(nameFilterLc) === 0 )

  const newNotification = (message, isError) => {
    return {
      message, isError 
    }
  }
  const spawnNotification = (message, isError) => {
    if (notificationTimeoutId.current !== null) {
      clearTimeout(notificationTimeoutId.current)
    }

    setNotification(newNotification(message, isError))
    notificationTimeoutId.current = setTimeout( 
      () => setNotification(null),
      3000
    )
  }
  const addPerson = (name, number) => {
    const newPerson = {
      name,
      number
    }

    const samePerson = persons.find(p => p.name === name)
    if (samePerson) {
      if (window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
        personsService
          .update(samePerson.id, {
            ...newPerson,
            id: samePerson.id
          })
          .then(
            (returnedPerson) => {
              setPersons( persons.map( p => p.name === name ? returnedPerson : p ) ) 
            }
          )
          .catch(
            (err) => {
              spawnNotification(err.response.data.error, true)
              if (err.response.status === 404) {
                setPersons( persons.filter( p => p.name !== name ) ) 
              }
            }
          )
      }

      return
    }

    personsService
      .create(newPerson)
      .then(
        returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          spawnNotification(`Added ${name}`, false)
        }
      )
      .catch( err => spawnNotification(err.response.data.error, true) )
  }
  const removePerson = (person) => {
    const id = person.id

    if (window.confirm(`Delete ${person.name}?`)){
      personsService
        .remove(id) 
        .then( 
          () => setPersons(persons.filter( p => p.id !== id) ) 
        )
        .catch( 
          () => {
            spawnNotification(`Information of ${person.name} has already been removed from server`, true)
            setPersons(persons.filter( p => p.id !== id ))
          }
        )
    }
  }

  useEffect(
    () => {
      personsService
        .getAll()
        .then(
          (allPersons) => setPersons(allPersons)
        )
    },
    []
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filterValue={nameFilter} setFilterValue={setNameFilter} />
      <h2>add a new</h2>
      <NewPersonForm addPerson={addPerson}/>
      <h2>Numbers</h2>
      <Persons persons={personsToShow} removePerson={removePerson}/>
    </div>
  )
}

export default App