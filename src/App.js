import React from 'react';
import Header from './pages/Header'
import Body from './pages/main/Body'
import Novels from './pages/novels/Novel'
import Novel from './pages/novel/Novel'
import './App.css';
import {Route, Switch, useLocation} from 'react-router-dom'

function App() {
  var lista = require('./list.json')
  return (
    <div className="App">
      <Header className="navBar"/>
      <Switch>
        {Object.keys(lista).map((value, index)=> <Route key={index} path={`/novelbr/novel/${value.replace("(","___").replace(")", "---")}`} component={Novel}/>)}
        <Route path="/novelbr/novel/" component={Novels}/>
        <Route path="/" component={Body}/>
      </Switch>
    </div>
  );
}

export default App;
