import { HashRouter, Routes, Route } from 'react-router-dom'
import MiniDrawer from './components/MiniDrawer';
import Landing from './pages/Landing'
import ConnectWorkbook from './pages/ConnectWorkbook';
import AssignVariables from './pages/AssignVariables';
import ProceedSimulation from './pages/ProceedSimulation';
import CheckResults from './pages/CheckResults';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MiniDrawer />}>
          <Route index element={<Landing />} />
          <Route path="home" element={<Landing />} />
          <Route path="connect_workbook" element={<ConnectWorkbook />} />
          <Route path="assign_variables" element={<AssignVariables />} />
          <Route path="proceed_simulation" element={<ProceedSimulation />} />
          <Route path="check_results" element={<CheckResults />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
