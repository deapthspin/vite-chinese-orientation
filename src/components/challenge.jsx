import React, { useEffect, useState } from 'react'
import jsonData from './data.json'
import { useSwipeable } from 'react-swipeable';
import { Slider } from '@mui/material'
import {useNavigate} from 'react-router-dom'
function Challenge() {
    const [canRender, setCanRender] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [gameEnded, setGameEnded] = useState(false)
    const [words, setWords] = useState([])
    const [score, setScore] = useState(0)
    const [qnsDone, setQnsDone] = useState(0)
    const [difficulty, setDifficulty] = useState(1)
    const [fullData,setFullData] = useState(jsonData)
    const [combo, setCombo] = useState(0)
    let [timeLeft, setTimeLeft] = useState(30)
    const [randomPinyin, setRandomPinyin] = useState('')

    const navigate = useNavigate()

    const handlers = useSwipeable({
        onSwipedRight: (e) => userKnow(e),
        onSwipedLeft: (e) => userNotKnow(e),
        onSwiping: (e) => changeColour(e),
        
      });

    useEffect(() => {
        let intid
        if(gameStarted && !gameEnded) {
            intid = setInterval(() => {
                if(timeLeft > 0) {
                    setTimeLeft(timeLeft -= 1)

                } else {
                    console.log('ended')
                    setGameEnded(true)
                    setGameStarted(false)
                    clearInterval(intid)
                }
            }, 1000)
        } else {
            
            clearInterval(intid)
        }
    }, [gameStarted, gameEnded])

    function startGame(e) {
        e.preventDefault()
        setGameStarted(true)
        chooseimage()
        
    }

    function changeColour(e) {
        console.log('something happens now')
    }

    function chooseimage() { // IHUGDSJHFGSJHFGJDSFJDSFJGHDSVKJHFVDJSGF
    
        
        
        
          

        
          const filtered = fullData.filter((item) => item.hsk_levl === `${difficulty}`)
          for(let i = 0; i < 30; i++) {
            if(filtered.length >= 1) {
                const rand = Math.floor(Math.random() * filtered.length)
                // console.log(infant)
                setWords(old => [...old, {char: `${filtered[rand].charcter}`, pinyin: `${filtered[rand].pinyin}`, button: Math.floor(Math.random() * 2)}])


                // fullData.filter((item) => item.hsk_levl === `${difficulty}` && item.charcter !== words[qnsDone].char)[Math.floor(Math.random() * fullData.filter((item) => item.hsk_levl === `${difficulty}` && item.charcter !== words[qnsDone].char).length)].pinyin

            } else {
                console.log('all gone')
            }
          }
          
          
        
    
      }

      useEffect(() => {
        setRandomPinyin(fullData[Math.floor(Math.random() * fullData.length)].pinyin)
      }, [qnsDone])


      function userKnow(e) {

        if(!words[qnsDone].button) {

            
            setCombo(combo + 1)
            setScore(score + 1)
        } else {
            setScore(score - 1)
            setCombo(0)
        }
        setQnsDone(qnsDone + 1)
    }

    function userNotKnow(e) {

        if(words[qnsDone].button) {

            
            setCombo(combo + 1)
            setScore(score + 1)
        } else {
            setScore(score - 1)
            setCombo(0)
        }
        setQnsDone(qnsDone + 1)
    }

    return (
        <div className='App'>
            {!gameStarted && !gameEnded && <div className='center'>
          <button onClick={navigate('/home')}>back to homepage</button>

                <button onClick={startGame}>start</button>
                <br/>
                <Slider
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
                />
            </div>}
        
            {gameStarted && <div>
                <h3 style={score < 0 ? {color: 'red'} : {color: 'black'}} >score: {score}</h3>
                <h2>time left: {timeLeft}</h2>
            {qnsDone < words.length && <div className='game swipeable' {...handlers}>

                <h1>{words[qnsDone].char}</h1>
                
                <h3>{words[qnsDone].button == 0 ? words[qnsDone].pinyin : randomPinyin}</h3>
            </div>}
            </div>}
            {gameEnded && <div className='center'>
                <h1>FINAL SCORE: {score}</h1>
            </div>}
        </div>
    )
}

export default Challenge