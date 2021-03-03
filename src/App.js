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
