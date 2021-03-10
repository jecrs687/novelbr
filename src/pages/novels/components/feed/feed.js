import React from 'react'
import './feed.css'
import Novel from './novel'

export default function Feed(novels){
    // const [test, setTest] = useState('temp')
    return(
        <div className="feed-container">
            {Object.keys(novels).map((titulo)=> <Novel titulo={titulo} dados={novels[titulo]}/>)}
        </div>
    )
}