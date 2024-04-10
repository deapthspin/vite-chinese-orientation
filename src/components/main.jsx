
import { useEffect, useState } from 'react';
import '../App.css';

import jsonData from './data.json'
import { FormControl, FormControlLabel, Link, Slider, Switch } from '@mui/material';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom'


function Main() {
  const navigate = useNavigate()

  const [alpha, setAlpha] = useState(0)
  const [beta, setBeta] = useState(0)
  const [gamma, setGamma] = useState(0)
  const [chosenChar, setChosenChar] = useState('')
  const [chosenCharAns, setChosenCharAns] = useState('')
  const [chosenCharDef, setChosenCharDef] = useState('')
  const [difficulty, setDifficulty] = useState(1)
  const [completed, setCompleted] = useState(false)
  const [started, setStarted] = useState(false)
  const[style, setStyle]= useState({
    backgroundColor: `rgb(255,255,255)`
  })
  const [data,setData] = useState(jsonData)

  const handleClick = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // Handle iOS 13+ devices.
      DeviceMotionEvent.requestPermission()
        .then((state) => {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            chooseimage()
            setStarted(true)
          } else {
            console.error('Request to access the orientation was rejected');
          }
        })
        .catch(console.error);
    } else {
      // Handle regular non iOS 13+ devices.
      window.addEventListener('deviceorientation', handleOrientation);
      chooseimage()
      setStarted(true)
    }
  }

  const handlers = useSwipeable({
    onSwipedRight: (e) => userKnow(e),
    onSwipedLeft: (e) => userNotKnow(e),
    onSwiping: (e) => changeColour(e),
    
  });

  function userKnow(e) {
    // console.log('know')
    if (e.absX > 75 ) {
      setCompleted(true)
      // let newData = 
      // console.log(newData, data)
      setData(data.filter(item => item.charcter !== chosenChar))
      chooseimage()
    }
    setStyle({
      backgroundColor: 'rgb(255,255,255)'
    })

  }

  function changeColour(e) {
    if (e.dir === 'Right' && e.absX <= 255) {
      setStyle({
        backgroundColor: `rgb(${255 - e.absX}, 255, ${255 -e.absX})`
      })
    } else if(e.dir === 'Left' && e.absX <= 255) {
      setStyle({
        backgroundColor: `rgb(255, ${255 - e.absX}, ${255 - e.absX})`
      })
    }
    
  }

  function userNotKnow(e) {
    // console.log('not know')
    if (e.absX > 75 ) {
      setCompleted(true)
      chooseimage()
    }
    setStyle({
      backgroundColor: 'rgb(255,255,255)'
    })
  }
  

  function chooseimage() {
    
    // console.log(data)
    
    
    
      
    
      const filtered = data.filter((item) => item.hsk_levl === `${difficulty}`)
      if(filtered.length >= 1) {
        const rand = Math.floor(Math.random() * filtered.length)
        // console.log(infant)
        setChosenChar(filtered[rand].charcter)
        setChosenCharAns(filtered[rand].pinyin)
        setChosenCharDef(filtered[rand].definition)
      } else {
        setChosenChar(`you have finished hsk level ${difficulty}`)
        setChosenCharAns('')
        setChosenCharDef('')
      }
      
    

  }

    


  function handleOrientation(event) {
    const a = event.alpha;
    const b = event.beta;
    const g = event.gamma;
    setAlpha(Math.round(a))
    setBeta(Math.round(b))
    setGamma(Math.round(g))
  }
  useEffect(() => {
    if(gamma <= 45 && gamma >= -45 && (beta > 170 || beta < -170)) {


      chooseimage()
    }
    // if(beta < 3 && beta >= -1 && gamma <= 20 && gamma >= -20) {
    //   showans()
    // }
    if(((beta <= 35 && beta >= -35) || (beta >= 160 || beta <= -160)) && ((gamma <= -35 && gamma >= -90) || (gamma <= 90 && gamma >= 35))) {
      setCompleted(false)
    }
  }, [beta, gamma])

  function changeDifficulty(e) {
    setDifficulty(e.target.value)
  }

  return (
    <div className="App">
      <br/> 
      <div className='center'>
          {!started && <button onClick={handleClick}>enable</button>}
          {!started && <button onClick={(e) => navigate('/rooms')} >test</button>}
          {!started && <button onClick={(e) => navigate('/singlechallenge')} >challenge solo</button>}
          <br/>
          <br/>
          {/* <h2>alpha: {Math.round(alpha)}</h2>
          <h2>beta: {Math.round(beta)}</h2>
          <h2>gamma: {Math.round(gamma)}</h2> */}
          {/* {} */}
          {/* <div className='swipeable' {...handlers} style={style}></div> */}
          {beta < 15 && beta >= -15 && gamma <= 34 && gamma >= -34 && <div>
            {!completed && <div className='swipeable' {...handlers} style={style}>
              <h1 className='pinyin'>{chosenCharAns}</h1>
              <br/>
              <h2>{chosenCharDef}</h2>
            </div>}
            {completed && <h1>tilt phone up to view next word</h1>}

          </div>}
          {/* {beta < 95 && beta > 80 && <h1>upright</h1>} */}
          {((beta <= 35 && beta >= -35) || (beta >= 160 || beta <= -160)) && ((gamma <= -35 && gamma >= -90) || (gamma <= 90 && gamma >= 35)) && <div
          {...handlers} style={style}
          >
            <div className='char center'>
              <h1>{chosenChar}</h1>
            </div>
          </div>}
          {gamma <= 34 && gamma >= -45 && ((beta > 155 || beta < -155)) && <div>
            
            <h1>picking words</h1>
          </div>}
          {/* <FormControl>
            <FormControlLabel control={<Switch onChange={changeDifficulty} />} label={difficulty ? 'adult' : 'infant'}/>
          </FormControl> */}

            {!started && <Slider
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
              onChange={changeDifficulty}
              valueLabelDisplay='auto'
              className='slider'
            />}
      </div>
      
      

        
        
      
    </div>
  );
}

export default Main;
