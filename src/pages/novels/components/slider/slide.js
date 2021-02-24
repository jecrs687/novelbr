import React,{useState,useEffect} from 'react'
import './slide.css'
const images = ["https://images3.alphacoders.com/975/thumb-1920-975999.png",
                "https://images4.alphacoders.com/936/936378.jpg",
                "https://i.pinimg.com/originals/0a/4d/cb/0a4dcb92fa2d3c601b58d72720d6bec4.jpg",
                "https://images6.alphacoders.com/539/thumb-1920-539561.png",
                "https://meuprojetoparalelo.com.br/wp-content/uploads/2020/04/Wallpaper-Rick-and-Morty.jpg",
                "http://images.unsplash.com/photo-1511447333015-45b65e60f6d5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max"]
export default function Slide(){
    onkeydown = (value) => (
        value.key==="ArrowLeft"?
        left():
        value.key==="ArrowRight"?
        right():null
    )
    const [time,]  = useState(3000)
    const [image, setImg]  = useState(0)
    var timeout;
    const change=()=>{
        images.length-1>image?
        setImg(image+1): setImg(0)
    }
    function update(){timeout = setTimeout(change,time)}
    useEffect(update,[image])
    const left=()=>{
        clearTimeout(timeout)
        0<image?
        setImg(image-1): setImg(images.length-1)

    }
    const right=()=>{
        clearTimeout(timeout)
        images.length-1>image?
        setImg(image+1): setImg(0)
    }
    const nav=(index)=>{
        clearTimeout(timeout)
        setImg(index)
    }
    
    return(
        <div className="slide-container">
            <button onClick={left} className="left">←</button>
            <button onClick={right}  className="right">→</button>
            <div className="map">
                { images.map(
                        (value, index)=>(
                            index===image?
                            <div onClick={()=>{nav(index)}} className="active"/>:
                            <div onClick={()=>{nav(index)}} className="desactive"/>
                        )
                    )
                }
            </div>
            <img src={images[image]} alt="banner" />

        </div>
    )
}