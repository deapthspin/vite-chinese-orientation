import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import jsonData from './data.json'

import { useSwipeable } from 'react-swipeable';
import { Slider } from '@mui/material'


function Room(props) {
    const uid = useParams().uid
    const ws = useRef()
    const {entered, owner} = props
    const [players, setPlayers] = useState([])
    const [canRender, setCanRender] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [gameEnded, setGameEnded] = useState(false)
    const [words, setWords] = useState([])
    const [score, setScore] = useState(0)
    const [qnsDone, setQnsDone] = useState(0)
    const [difficulty, setDifficulty] = useState(1)
    const [fullData,setFullData] = useState(jsonData)
    const [playersDone, setPlayersDone] = useState(0)
    const [combo, setCombo] = useState(0)



    const handlers = useSwipeable({
        onSwipedRight: (e) => userKnow(e),
        onSwipedLeft: (e) => userNotKnow(e),
        onSwiping: (e) => changeColour(e),
        
      });

    function userKnow(e) {
        console.log(words[qnsDone])
        if(!words[qnsDone].button) {
            console.log('correct')
            setCombo(combo + 1)
            setScore(score + Math.floor((combo / 3) + 1))

            let temp = [...players]
            for(let i = 0;i< temp.length; i++) {
                if(temp[i].name === localStorage.getItem('enteredName')) {
                    temp[i].score += Math.floor((combo / 3) + 1)
                }
            }
            setPlayers(temp)
        } else {
            setScore(score - 1)
            setCombo(0)

            let temp = [...players]
            for(let i = 0;i< temp.length; i++) {
                if(temp[i].name === localStorage.getItem('enteredName')) {
                    temp[i].score -= 1
                }
            }
            setPlayers(temp)
        }
        setQnsDone(qnsDone + 1)

    }
 
    function userNotKnow(e) {
        console.log(words[qnsDone])
        if(words[qnsDone].button) {
            console.log('correct')
            
            setCombo(combo + 1)
            setScore(score + Math.floor((combo / 3) + 1))
            let temp = [...players]
            for(let i = 0;i< temp.length; i++) {
                if(temp[i].name === localStorage.getItem('enteredName')) {
                    temp[i].score += Math.floor((combo / 3) + 1)
                }
            }
            setPlayers(temp)


            console.log(temp)
        } else {
            setScore(score - 1)
            setCombo(0)

            let temp = [...players]
            for(let i = 0;i< temp.length; i++) {
                if(temp[i].name === localStorage.getItem('enteredName')) {
                    temp[i].score -= 1
                }
            }
            setPlayers(temp)
        }
        setQnsDone(qnsDone + 1)
    }


    function changeColour(e) {
        console.log('something happens now')
    }

    useEffect(() => {
        setCanRender(false)
        setTimeout(() => {
            setCanRender(true)
        },100)
    }, [players])

    async function getData() {
        const res = await fetch(`http://localhost:4000/room/players/${uid}`)
        const data = await res.json()

        for(const key in data) {
            for(let i = 0; i < data[key].players.length; i++) {
                setPlayers(old => [...old, {name: data[key].players[i], score: 0}])
            }
            
            // console.log(data[key])
        }
        
    }

    function chooseimage() { // IHUGDSJHFGSJHFGJDSFJDSFJGHDSVKJHFVDJSGF
    
        
        
        
          
        console.log('choosing')
        
          const filtered = fullData.filter((item) => item.hsk_levl === `${difficulty}`)
          for(let i = 0; i < 10; i++) {
            if(filtered.length >= 1) {
                const rand = Math.floor(Math.random() * filtered.length)
                // console.log(infant)
                setWords(old => [...old, {char: `${filtered[rand].charcter}`, pinyin: `${filtered[rand].pinyin}`, button: Math.floor(Math.random() * 2)}])
                console.log('choosing', filtered[rand].charcter)

            } else {
                console.log('all gone')
            }
          }
          
          
        
    
      }

    useEffect(() => {
        getData()
        console.log(players)
    }, [])

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:4200')


        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if(data.msgType === 'joinroom' && data.roomId === uid) {
                // getData()
                setTimeout(() => {
                    getData()
                }, 150)
                
            } else if(data.msgType === 'startgame' && data.roomId === uid) {
                console.log('game start')
                setGameStarted(true)
                chooseimage()
                if(localStorage.getItem('owner') === localStorage.getItem('enteredName')) {
                    ws.current.send(JSON.stringify({
                        roomId: uid,
                        words: words,
                        msgType: 'sendwords'
                    }))
                }
            
            } else if(data.msgType === 'sendwords' && data.roomId === uid) {
                if(localStorage.getItem('owner') !== localStorage.getItem('enteredName')) {
                    setWords(data.words)
                }
            } else if(data.msgType === 'plrdone' && data.roomId === uid) {
                if(localStorage.getItem('owner') === localStorage.getItem('enteredName')) {
                    setPlayersDone(playersDone + 1)
                    console.log(`this guy done:`, data)
                }
            }

        }
    }, [])

    useEffect(() => {
        if(playersDone >= players.length && players.length > 0) {
            setGameStarted(false)
            setGameEnded(true)
            let temp = [...players]
            temp.sort((a, b) => a.score - b.score)
            setPlayers(temp)
        }
    }, [playersDone])

    function startGame(e) {
        e.preventDefault()
        ws.current.send(JSON.stringify({
            roomId: uid,
            msgType: 'startgame'
        }))
    }

    useEffect(() => {
        if(gameStarted && localStorage.getItem('owner') === localStorage.getItem('enteredName')) {

        }
    }, [gameStarted])

    useEffect(() => {
        if(qnsDone >= words.length && words.length > 0) {
            ws.current.send(JSON.stringify({
                roomId: uid,
                name: localStorage.getItem('enteredName'),
                msgType: 'plrdone'
            }))
        }
    }, [qnsDone])

    return  (
        <div>
            {!gameStarted && !gameEnded && <div>
                
                <h1>WELCOME TO ROOM {uid}</h1>
                {localStorage.getItem('owner') === localStorage.getItem('enteredName') && <Slider
          defaultValue={1}
          step={1}
          min={1}
          max={6}
          marks={
            [
              {
                value: 1,
                label: 'hsk level 1'
              },
              {
                value: 6,
                label: 'hsk level 6'
              }
            ]
          }
          onChange={(e) => {setDifficulty(e.target.value)}}
          valueLabelDisplay='auto'
          className='slider'
        />}
                {console.log(localStorage.getItem('owner'), localStorage.getItem('enteredName'))}
                <h2>owner: {localStorage.getItem('owner')}</h2>
                {localStorage.getItem('owner') === localStorage.getItem('enteredName') && <button onClick={startGame}>start</button>}
                {canRender && <div className='players'>
                    {console.log(players)}
                    {players.map((player) => (
                        <div className='player'>
                            <h3>{player.name}</h3>
                        </div>
                    ))}
                    
                    {entered && !players.map(player => player.name).includes(entered) && <div className='player'>
                            <h3>{entered}</h3>
                        </div>}
                </div>}
            </div>}
            {gameStarted && <div>
                <h3 style={score < 0 ? {color: 'red'} : {color: 'black'}} >score: {score}</h3>
            {qnsDone < words.length && <div className='game swipeable' {...handlers}>
                {console.log(words)}
                <h1>{words[qnsDone].char}</h1>
                
                <h3>{words[qnsDone].button == 0 ? words[qnsDone].pinyin : fullData.filter((item) => item.hsk_levl === `${difficulty}` && item.charcter !== words[qnsDone].char)[Math.floor(Math.random() * fullData.filter((item) => item.hsk_levl === `${difficulty}` && item.charcter !== words[qnsDone].char).length)].pinyin}</h3>
            </div>}
            </div>}
            
            {gameEnded && <div>

                <div className='leaderboards'>
                    {players.map((item) => (
                        <div>
                            <h1>{item.name}: {item.score}</h1>
                        </div>
                    ))}

                </div>
            </div>}
        </div>
    )
}

export default Room