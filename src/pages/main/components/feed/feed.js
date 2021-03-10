import React,{useState,useEffect} from 'react'
import './feed.css'
import Novel from './novel'
export default function Feed(){
    const [novels, setNoveis] = useState({})
    useEffect(()=>{setNoveis(require("../../../../list.json"))},[])
    // var database = firebase.database()
    // useEffect(
    // ()=>{database.ref('/noveis').on("value", (value)=>{setNoveis(value.val())})
    // },[])
    return(
        <div className="feed-container">
            {Object.keys(novels).map((titulo, index)=> <Novel key={index} titulo={titulo} dados={novels[titulo]}/>)}
        </div>
    )
}