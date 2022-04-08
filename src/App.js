import { HashRouter } from 'react-router-dom'
import Landing from './pages/Landing'

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Landing />
    </HashRouter>
  );
}

export default App;
