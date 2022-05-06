import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react';
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
  const [file, setFile] = useState(null)
  const [loadingWorkbook, setLoadingWorkbook] = useState(false)
  const [connReqStatus, setConnReqStatus] = useState()
  const [connStatus, setConnStatus] = useState(-1)
  const [connedFile, setConnedFile] = useState(null)
  const [randomCells, setRandomCells] = useState({})
  const [monitoringCells, setMonitoringCells] = useState({})
  const [simConfig, setSimConfig] = useState({})
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

  useEffect(() => {
    const init = () => {
      axios.get("http://127.0.0.1:8000/reset").then((response) => {
        console.log(response)
      })

      setRandomCells({})
      setMonitoringCells({})
    }
    init()
    return () => {
      init()
    }
  }, [file])

  useInterval(() => {
    axios.get("http://127.0.0.1:8000/check_connection").then((response) => {
      setConnStatus(response.data.code)
      setConnedFile(response.data.message)
    })
  }, 3000)

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<MiniDrawer connStatus={connStatus} connedFile={connedFile} />}>
              <Route index element={<Landing />} />
              <Route path="home" element={<Landing />} />
              <Route path="connect_workbook" element={
                <ConnectWorkbook
                  file={file} setFile={setFile}
                  loadingWorkbook={loadingWorkbook} setLoadingWorkbook={setLoadingWorkbook}
                  connReqStatus={connReqStatus} setConnReqStatus={setConnReqStatus}
                  conn={connStatus} setConn={setConnStatus}
                  connWith={connedFile} setConnWith={setConnedFile} />
              } />
              <Route path="add_random_cells" element={
                <AddRandomCells
                  connStatus={connStatus}
                  randomCells={randomCells} setRandomCells={setRandomCells}
                />
              } />
              <Route path="add_monitoring_cells" element={
                <AddMonitoringCells
                  connStatus={connStatus}
                  monitoringCells={monitoringCells} setMonitoringCells={setMonitoringCells} />
              } />
              <Route path="proceed_simulation" element={
                <ProceedSimulation
                  connStatus={connStatus}
                  randomCells={randomCells}
                  monitoringCells={monitoringCells}
                  simConfig={simConfig} setSimConfig={setSimConfig} />
              } />
              <Route path="check_results" element={<CheckResults />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
