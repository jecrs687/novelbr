import React, {useState,useEffect} from 'react'
import './leitura.css'
import {useLocation} from 'react-router-dom'

export default function Leitura({nome, cap}){
    const [capitulo, setDados] = useState()
    const [capitulos, setCapitulo] = useState(null)
    var match = useLocation().search.split("_")
    match = match[0]

    useEffect(()=>{
        var receber = nome
        receber = receber.replace(" ", "%20").replace(" ", "%20").replace(" ", "%20").replace(" ", "%20").replace(" ", "%20")
        var xhr = new XMLHttpRequest();
        var xhr2 = new XMLHttpRequest();
        xhr.open('GET',`https://raw.githubusercontent.com/jecrs687/novelbr/master/noveis/${receber}/${cap}.json`, true )
        xhr.responseType = 'json'
        xhr.onload = function() {
            var status = xhr.status;
            if (status === 200) {
              setDados(xhr.response);
              console.log("capitulo adquiridos")
            }
          };
        xhr.send();
        xhr2.open('GET','https://raw.githubusercontent.com/jecrs687/novelbr/master/links.json', true )
        xhr2.responseType = 'json'
        xhr2.onload = function() {
            var status = xhr2.status;
            if (status === 200) {
            setCapitulo(xhr2.response);
            }
        };
        xhr2.send();
    },[nome, cap])
    // const novels = require('https://jecrs687.github.io/novelbr/links.json')

    return(
        capitulo?
            <div className="main-leitura">
                <div className="changes">
                    <button className="font">+</button>
                    <button className="font">-</button>
                </div>
                <h1>
                    {Object.keys(capitulo).map(value=>value)}</h1>
                {capitulos? Object.keys(capitulos[nome])[Number.parseInt(cap)-1]? <a className="buttom" href={`/novelbr/${match}_${Number.parseInt(cap)-1}`}>Anterior</a>:null:null}
                {capitulos? Object.keys(capitulos[nome])[Number.parseInt(cap)+1]? <a className="buttom" href={`/novelbr/${match}_${Number.parseInt(cap)+1}`}>Proximo</a>:null:null}
               
              {Object.keys(capitulo).map(value=>capitulo[value].map((value2, index)=><p key={index}>{value2}</p>))}
               {capitulos? Object.keys(capitulos[nome])[Number.parseInt(cap)-1]? <a className="buttom" href={`/novelbr/${match}_${Number.parseInt(cap)-1}`}>Anterior</a>:null:null}
                {capitulos? Object.keys(capitulos[nome])[Number.parseInt(cap)+1]?<a className="buttom" href={`/novelbr/${match}_${Number.parseInt(cap)+1}`}>Proximo</a>:null:null}
                
            </div>:null
        )
}