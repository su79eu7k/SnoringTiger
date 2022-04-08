import { HashRouter } from 'react-router-dom'
import Landing from './pages/Landing'
import MiniDrawer from './components/MiniDrawer';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <HashRouter>
      <MiniDrawer />
    </HashRouter>
  );
}

export default App;
