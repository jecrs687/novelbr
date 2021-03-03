import React from 'react'
import './main.css'
import {useLocation} from 'react-router-dom'
export default function Main({nome, dados, capitulos}){
    var match = useLocation().search
    return(
            <div className="main-novel">
                <div>
                    <img src={dados['imagem']} alt="imagem do novel">

                    </img>
                    <h1>
                        {nome}
                    </h1>
                    <p>
                        {dados['genero']? `gêneros: ${dados['genero'].map((value)=>value)}`:null}
                    </p>
                    <div>{dados['resumo'].map((value,index )=><p key={index}>{value}</p>)}</div>
                </div>                
                <ul className="capitulos">
                    {capitulos? Object.keys(capitulos[nome]).map((value, index)=><li key={index}><a href={`/novelbr/${match}_${index}`}>{value}</a></li>):null}
                </ul>

            </div>
        )
}