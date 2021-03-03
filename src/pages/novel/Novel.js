import React, {useState,useEffect} from 'react'
import './Novel.css'
import {useLocation} from 'react-router-dom'
import Leitura from './components/leitura/leitura'
import Main from './components/main/main'
export default function Novel(){
    var titulo = useLocation().search.split("TitleOF")[1];
    var param = titulo.split("_")
    var nome = param[0].replace("%20", " ").replace("%20", " ").replace("%20", " ").replace("%20", " ").replace("%20", " ")
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
    xhr2.send();},[])
    return(
            novels? 
                param[1]?
                     <Leitura nome={nome} cap={param[param.length-1]}/>:<Main nome={nome} dados={novels[nome]} capitulos={capitulo} />:null
        )
}