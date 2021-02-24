import React, {useState,useEffect} from 'react'
import './Novel.css'
import {useLocation} from 'react-router-dom'

export default function Novel(){
    var match = useLocation();
    

    const [novels, setDados] = useState(null)
    const [capitulo, setCapitulo] = useState(null)
    useEffect(()=>{
    var xhr = new XMLHttpRequest();
    var xhr2 = new XMLHttpRequest();
    xhr.open('GET','https://raw.githubusercontent.com/jecrs687/novelbr/master/list.json', true )
    xhr.responseType = 'json'
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
          setDados(xhr.response);
          console.log("dados adquiridos")
        }
      };
    xhr.send();
    xhr2.open('GET','https://raw.githubusercontent.com/jecrs687/novelbr/master/links.json', true )
    xhr2.responseType = 'json'
    xhr2.onload = function() {
        var status = xhr2.status;
        if (status === 200) {
          setCapitulo(xhr2.response);
          console.log("capitulos adquiridos")

        }
      };
    xhr2.send();},[])
    // const novels = require('https://jecrs687.github.io/novelbr/links.json')
    var nome = match.pathname.split('l/')[1].replace("___","(").replace("---",")")
        return(
            novels? 
            <div className="main-novel">
                <div>
                    <img src={novels[nome]['imagem']} alt="imagem do novel">

                    </img>
                    <h1>
                        {nome}
                    </h1>
                    <p>
                        {novels[nome]['genero']? `gêneros: ${novels[nome]['genero'].map((value)=>value)}`:null}
                    </p>
                    <div>{novels[nome]['resumo'].map((value,index )=><p key={index}>{value}</p>)}</div>
                </div>                
                <div className="capitulos">
                    
                    {capitulo? Object.keys(capitulo[nome]).map((value, index)=><p key={index}><a href={`${match.pathname}/${index}`}>{value}</a></p>):null}
                </div>

            </div>:null
        )
}