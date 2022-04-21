import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react';
import MiniDrawer from './components/MiniDrawer';
import Landing from './pages/Landing'
import ConnectWorkbook from './pages/ConnectWorkbook';
import AddRandomCells from './pages/AddRandomCells';
import AddMonitorCells from './pages/AddMonitorCells';
import ProceedSimulation from './pages/ProceedSimulation';
import CheckResults from './pages/CheckResults';
import ColorModeContext from './contexts/ColorModeContext';
import axios from 'axios';

function App() {
  const [conn, setConn] = useState()
  const [connWith, setConnWith] = useState()
  const [randomCells, setRandomCells] = useState({})
  const [monitoringCells, setMonitoringCells] = useState({})
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
          // palette values for light mode
          primary: {
            main: '#2e7d32'
          }
        }
        : {
          // palette values for dark mode
          primary: {
            main: '#ffffff'
          }
        }),
    },
  });

  useEffect(() => {
    setInterval(() => {
      axios.get("http://127.0.0.1:8000/check_connection").then((response) => {
        setConn(response.data.code)
        setConnWith(response.data.message)
      });
    }, 5000)
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<MiniDrawer conn={conn} connWith={connWith} />}>
              <Route index element={<Landing />} />
              <Route path="home" element={<Landing />} />
              <Route path="connect_workbook" element={<ConnectWorkbook />} />
              <Route path="add_random_cells" element={<AddRandomCells randomCells={randomCells} setRandomCells={setRandomCells} />} />
              <Route path="add_monitor_cells" element={<AddMonitorCells monitoringCells={monitoringCells} setMonitoringCells={setMonitoringCells} />} />
              <Route path="proceed_simulation" element={<ProceedSimulation />} />
              <Route path="check_results" element={<CheckResults />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
