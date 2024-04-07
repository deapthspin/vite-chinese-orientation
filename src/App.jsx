import React, { useState } from 'react'
import { Link, Routes, Route, Navigate } from 'react-router-dom'
import Main from './components/main'
import Rooms from './components/rooms'
import Room from './components/room'

function App() {
  const [enteredName, setEnteredName] = useState(localStorage.getItem('enteredName'))
  const [owner, setOwner] = useState(localStorage.getItem('owner'))
  return (
    <div>
      <Routes>
        <Route element={<Main/>} path='/main'/>
        <Route element={<Rooms setEntered={setEnteredName} setOwner={setOwner}/>} path='/rooms'/>
        <Route element={<Room entered={enteredName} owner={owner}/>} path='/room/:uid'/>
        <Route element={<Navigate to='/main'/>} path='/*'/>

      </Routes>
    </div>
  )
}

export default App