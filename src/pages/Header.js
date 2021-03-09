import React, { useEffect } from 'react'
import './Header.css'
// import { TiDocument } from "react-icons/ti";
import {GoRepo,GoHome,GoProject} from "react-icons/go";
import {FaAngleDoubleLeft,FaSun,FaMoon,FaBrain} from "react-icons/fa";
import {useHistory} from 'react-router-dom'

export default function Header(){
	    const [dark, setDark] = React.useState(0)
		var theme = localStorage.getItem("--theme")
		useEffect(()=>{
			if(theme === "normal"){
				setDark(0)
				document.body.style.setProperty('--background','#f1f1f1')
				document.body.style.setProperty('--font','#333')

              document.body.style.setProperty('--primary','#a7ff83')
              document.body.style.setProperty('--secundary','#17b978')
                document.body.style.setProperty('--triadic','#086972')
                document.body.style.setProperty('--complementary','#071a52')
			}else{
				document.body.style.setProperty('--background','#212121')
				document.body.style.setProperty('--font','#fff')
                document.body.style.setProperty('--secundary','#071a52')
                document.body.style.setProperty('--primary','#086972')
                  document.body.style.setProperty('--triadic','#17b978')
                  document.body.style.setProperty('--complementary','#a7ff83')
				setDark(1)
			}
		},[dark])
		
		let history = useHistory();
		function navigation(local){
			history.push(local)
		}
		return(
				
					<div className='navBar'>
						<div  className='box-logo' onClick={()=>navigation('/novelbr')}>
							<span className='logo'>NovelBr</span>
							<FaAngleDoubleLeft className="icon"/>
						</div>
						<ul className='navBar-nav'>
							<li  className='navBar-item' onClick={()=>navigation('/novelbr')}>
								<GoHome className='icon'/>
								<span className='nav-link'>home</span>
							</li>
							<li className='navBar-item'  onClick={()=>navigation('/novelbr/?noveis')}>
								<GoRepo className='icon'/>
								<span className='nav-link'>Novels</span>
							</li>
							{/* <li className='navBar-item'>
								<TiDocument className='icon'/>
								<span className='nav-link'>TOP</span>
							</li> */}
							<li className='navBar-item'>
								<FaBrain className='icon'/>
								<span className='nav-link'>Categorias</span>
							</li>
						
							{dark?          
          <li className='navBar-item'  onClick={
            ()=>{    
				
				localStorage.setItem("--theme", "normal")
				setDark(!dark)
            }}>
              <FaMoon className='icon'/>
              <span className='nav-link' >Dark</span>
          </li>:          
          <li className='navBar-item' 
            onClick={
              ()=>{
				
                  setDark(!dark)
				  localStorage.setItem("--theme", "dark")
              }
              }>
              <FaSun className='icon'/>
              <span className='nav-link' >light</span>
            </li>
        }
								<li className='navBar-item'>
								<GoProject className="icon"/>
								<span className='nav-link' >Perfil</span>
							</li>
						</ul>
					</div >
			
		)
}