import React from 'react'
import './novel.css'
export default function Novel({titulo, dados}){
    return(
        <div className="novel-container">
            <div>
            <img className="image" alt="imagem do novel" src="https://saikaiscan.com.br/media/cache/b0/65/b065019a8e1a6da43e84108f1f4b195b.png"/>
            </div>
            <div className="information">
                <a href={`/novelbr/?novelTitleOF${titulo}`}>{titulo}</a>
                <p>{dados['resumo'].map((value=>value))}</p>
                <div className="cap">
                <h3>caps</h3>
                <h4>15</h4>
                <h4>16</h4>
                <h4>17</h4>
                </div>
            </div>
        </div>
    )
}