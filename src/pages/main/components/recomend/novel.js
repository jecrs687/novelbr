import React from 'react'
import './novel.css'


async function getHtml(){return fetch("saikaiscan.com.br").then(res => console.log(res))}
export default function nove(){
    return(
        <div className="recomend-novel">
            <div className="title">
                <p>
                    {()=>(getHtml())}
                   Dungeons and dragons    
                </p>
            </div>
            <img className="image" alt="imagem do novel" src="https://saikaiscan.com.br/media/cache/b0/65/b065019a8e1a6da43e84108f1f4b195b.png"/>
        </div>
    )
}