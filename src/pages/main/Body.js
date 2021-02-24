import React from 'react'
import Slide from './components/slider/slide'
import Best from './components/best'
import Recomend from './components/recomend/recomend'
import Feed from './components/feed/feed'
import './Body.css'
export default function Body(){
        return(
            <div>
                <Slide/>				
                <div className="best">
                    <Recomend/>
                    <Best/>
				</div>
                <Feed/>
            </div>
        )
}