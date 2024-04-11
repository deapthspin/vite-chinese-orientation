import {React, useEffect, useReducer, useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom'

import uuid from 'react-uuid'

function Rooms(props) {
    const [rooms, setRooms] = useState([])
    const [canRender, setCanRender] = useState(false)
    const [roomName, setRoomName] = useState("")
    const [owner, setOwner] = useState("")
    const ws = useRef()
    const navigate = useNavigate()
    setTimeout(() => {
        setCanRender(true)
    }, 100)

    const {setEntered} = props

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:4200')
    },[])

    async function getData() {
        let res = await fetch('http://localhost:4000/rooms')
        let data = await res.json()
        let temp = [...rooms]
        for(const key in data) {
            
            temp.push(data[key])
            

        }
        setRooms(temp)
    }

    function createRoom(e) {
        e.preventDefault()
        setOwner('')
        
            let ownername = window.prompt('type your name')
            let uid = uuid()
            if(ownername.length) {
                console.log('1')
                fetch('http://localhost:4000/rooms', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        roomId: uid,
                        players: [`${ownername}`],
                        owner: ownername
                    })
                })  
                setOwner(ownername)
                setEntered(ownername)
                localStorage.setItem('enteredName', ownername)
                localStorage.setItem('owner', ownername)
            }
        setCanRender(false)
        setRooms([])
        navigate(`/room/${uid}`)
    }


    useEffect(() => {
        if(!canRender) {
            getData()
        }
       
    }, [canRender])

    async function joinRoom(e) {
        const index = e.target.id.split('--')[0]
        const uuid = e.target.id.split('--')[1]
        const joinName = window.prompt('enter a name')
        if(!joinName.trim().length) {
            return;
        }
        const res = await fetch(`http://localhost:4000/room/players/${uuid}`)
        const data = await res.json()
        let currentPlrs = {}
        for(const key in data) {
            currentPlrs = [...data[key].players]
        }
        currentPlrs.push(joinName)
        console.log(currentPlrs)
        
        fetch(`http://localhost:4000/room/players/${uuid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                players: currentPlrs
            })
        })

        ws.current.send(
            JSON.stringify({
                roomId: uuid,
                msgType: 'joinroom'
            })
        )
        setEntered(joinName)
        localStorage.setItem('enteredName', joinName)

        navigate(`/room/${uuid}`)
    }

    return(
        <div>
            {/* <h1>rooms be here</h1> */}
            <button onClick={(e) => navigate('/home')}>back to homepage</button>
            
            <button onClick={createRoom}>create a room</button>
            {canRender && <div className='rooms'>
                {rooms.map((room, index) => (
                    <div className='room' id={`${index}--${room.roomid}`} onClick={joinRoom}>
                        <h1 id={`${index}--${room.roomid}`}>{room.roomid}</h1>
                    </div>
                ))}   
            </div>}
        </div>
    )
}

export default Rooms