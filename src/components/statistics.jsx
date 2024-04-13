import React from 'react'

function Statistics() {
    const stats = JSON.parse(localStorage.getItem('stats'))


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
                            <h2>{item.char}</h2><h3>{item.correct / item.wrong > 100 ? '100' : Math.round(item.correct / item.wrong)}%</h3>
                            {item.correct / item.wrong < 65 && <h3>
                                {item.correct / item.wrong < 65 ? 
                                'needs practice'
                                : item.correct / item.wrong < 40 ?
                                'bad. recommended'
                                : 'practice immedietely'

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