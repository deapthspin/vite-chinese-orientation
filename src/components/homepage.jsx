import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Homepage(props) {
    const navigate = useNavigate()
    const [alpha, setAlpha] = useState(0)
    const [beta, setBeta] = useState(0)
    const [gamma, setGamma] = useState(0)
    const {perms, setPerms} = props

    

    const handleClick = () => {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
          // Handle iOS 13+ devices.
          DeviceMotionEvent.requestPermission()
            .then((state) => {
              if (state === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
                setPerms(true)
              } else {
                console.error('Request to access the orientation was rejected');
              }
            })
            .catch(console.error);
        } else {
          // Handle regular non iOS 13+ devices.
          setPerms(true)
          window.addEventListener('deviceorientation', handleOrientation);
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
        if(!localStorage.getItem('stats')) {
          localStorage.setItem('stats', JSON.stringify([{char: '\u7684', pinyin: `de`, correct: 1, wrong: 0}]))
        }
      }, [])
    return(
        <div className='App'>
          <div>
            {!perms && <button onClick={(e) => handleClick()}>enable gyro</button>}
            <br/>
            <br/>
            
            {!perms && <h3>the app requires the permission to use gyro to function</h3>}            
          </div>

            {perms && <div className='center'>
              <button onClick={(e) => navigate('/main')} >learn</button>
              <button onClick={(e) => navigate('/singlechallenge')} >solo</button>
              <button onClick={(e) => navigate('/rooms')} >group</button>
              <br/>
              <br/>
              <button onClick={(e) => navigate('/stats')} >your statistics</button>
            </div>}
            

        </div>
    )
}

export default Homepage