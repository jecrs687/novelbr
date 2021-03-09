import React from 'react';
import Header from './pages/Header'
import Body from './pages/main/Body'
import Novels from './pages/novels/Novel'
import Novel from './pages/novel/Novel'
import {useLocation} from 'react-router-dom'
import './App.css';
import {Route, Switch} from 'react-router-dom'

function App() {
  // var lista = require('./list.json')
  var theme = localStorage.getItem("--theme")
  if(!theme){
    localStorage.setItem("--theme", "normal")
  }else{
    if(theme === "normal"){
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
    }
  }
  var match = useLocation().search.split("?")
  if(match[1]) match = match[1].split("TitleOF")
  return (
    <div className="App">
      <Header className="navBar"/>

      <Switch>
        {
            match[0]?
            match[0] === "novel"?
                 <Route path="/" component={Novel}/>:
            match[0] === "noveis"?
                     <Route path="/" component={Novels}/>
                    
                :null:null
        }

        <Route path="/" component={Body}/>
      </Switch>
    </div>
  );
}

export default App;
