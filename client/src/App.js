import Canvas from './Components/Canvas';
import SettingsBar from './Components/SettingsBar';
import ToolBar from './Components/ToolBar';
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Redirect,
} from 'react-router-dom';
import './styles/app.sass';

function App() {
   return (
      <Router>
         <div className='app'>
            <Switch>
               <Route path='/:id'>
                  <ToolBar />
                  <SettingsBar />
                  <Canvas />
               </Route>
               <Redirect to={`f${(+new Date()).toString(16)}`} />
            </Switch>
         </div>
      </Router>
   );
}

export default App;
