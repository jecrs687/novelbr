import React from 'react'
import './feed.css'
import Novel from './novel'

const novels = require('../../../../list.json')
export default function Feed(){
    // const [test, setTest] = useState('temp')
    return(
        <div className="feed-container">
            {Object.keys(novels).map((titulo)=> <Novel titulo={titulo} dados={novels[titulo]}/>)}
        </div>
    )
}