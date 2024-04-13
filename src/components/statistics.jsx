import React from 'react'
import { useNavigate } from 'react-router-dom'

function Statistics() {
    const stats = JSON.parse(localStorage.getItem('stats'))
    const navigate = useNavigate()

    return (
        <div className='App'>
            
            <div className='center'>
            <button onClick={(e) => navigate('/home')}>back to homepage</button>
            <br/>
            <br/>
            <br/>
                <div className='stats'>
                    {stats.map((item) => (
                        <div className='char-stat'>
                            <h2>{item.char}</h2>
                            <h3>{item.pinyin}</h3>
                            <h3>{Math.round((item.correct / (item.correct + item.wrong)) * 100)}%</h3>
                            
                            {(item.correct / (item.correct + item.wrong)) * 100 < 65 && <h3>
                                {(item.correct / (item.correct + item.wrong)) * 100 < 15 ? 
                                'practice immedietely'
                                : (item.correct / (item.correct + item.wrong)) * 100 < 40 ?
                                'practice is reccommended'
                                : 'needs practice'

                                }

                            </h3>}
                        </div>
                    ))}
                </div>
                
            </div>
            s
        </div>
    )
}

export default Statistics