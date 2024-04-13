import React, { useState } from 'react'
import { Link, Routes, Route, Navigate } from 'react-router-dom'
import Main from './components/main'
import Rooms from './components/rooms'
import Room from './components/room'
import Challenge from './components/challenge'
import Homepage from './components/homepage'
import Statistics from './components/statistics'


function App() {
  const [enteredName, setEnteredName] = useState(localStorage.getItem('enteredName'))
  const [owner, setOwner] = useState(localStorage.getItem('owner'))
  const [perms, setPerms] = useState(false)

  console.log(JSON.parse(localStorage.getItem('stats')))
  return (
    <div>
      <Routes>
        <Route element={<Main/>} path='/main'/>
        <Route element={<Rooms setEntered={setEnteredName} setOwner={setOwner}/>} path='/rooms'/>
        <Route element={<Room entered={enteredName} owner={owner}/>} path='/room/:uid'/>
        <Route element={<Challenge entered={enteredName} owner={owner}/>} path='/singlechallenge'/>
        <Route element={<Homepage entered={enteredName} owner={owner} perms={perms} setPerms={setPerms}/>} path='/home'/>
        <Route element={<Statistics entered={enteredName} owner={owner}/>} path='/stats'/>

        <Route element={<Navigate to='/home'/>} path='/*'/>

      </Routes>
    </div>
  )
}

export default App