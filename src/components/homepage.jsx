import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Homepage() {
    const navigate = useNavigate()
    const [alpha, setAlpha] = useState(0)
    const [beta, setBeta] = useState(0)
    const [gamma, setGamma] = useState(0)

    

    const handleClick = () => {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
          // Handle iOS 13+ devices.
          DeviceMotionEvent.requestPermission()
            .then((state) => {
              if (state === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
                // setStarted(true)
              } else {
                console.error('Request to access the orientation was rejected');
              }
            })
            .catch(console.error);
        } else {
          // Handle regular non iOS 13+ devices.
          window.addEventListener('deviceorientation', handleOrientation);
        }
      }
    
      useEffect(() => {
        handleClick()
      }, [])
      
      function handleOrientation(event) {
        const a = event.alpha;
        const b = event.beta;
        const g = event.gamma;
        setAlpha(Math.round(a))
        setBeta(Math.round(b))
        setGamma(Math.round(g))
      }
    return(
        <div className='App'>
            {alpha > 55 && beta < 15 && gamma < -55 ? <div className='center'>
                <button onClick={(e) => navigate('/rooms')} >multiplayer</button>
                <button onClick={(e) => navigate('/main')} >learn</button>
                <button onClick={(e) => navigate('/singlechallenge')} >solo challenge</button>
            </div> : <h1>tilt your phone to landscape</h1>}
            

        </div>
    )
}

export default Homepage