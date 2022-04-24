import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useState, useMemo } from 'react';
import { useInterval } from './components/useInterval'
import MiniDrawer from './components/MiniDrawer';
import Landing from './pages/Landing'
import ConnectWorkbook from './pages/ConnectWorkbook';
import AddRandomCells from './pages/AddRandomCells';
import AddMonitoringCells from './pages/AddMonitoringCells';
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
            main: '#aad5aa'
          },
          background: {
            default: '#15202b',
            paper: '#141f2b',
          },
          text: {
            primary: '#ffffff',
            secondary: '#626a72'
          }
        }),
    },
  });

  useInterval(() => {
    axios.get("http://127.0.0.1:8000/check_connection").then((response) => {
      setConn(response.data.code)
      setConnWith(response.data.message)
    })
  }, 5000)

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
              <Route path="add_monitoring_cells" element={<AddMonitoringCells monitoringCells={monitoringCells} setMonitoringCells={setMonitoringCells} />} />
              <Route path="proceed_simulation" element={<ProceedSimulation conn={conn} randomCells={randomCells} monitoringCells={monitoringCells} />} />
              <Route path="check_results" element={<CheckResults />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
