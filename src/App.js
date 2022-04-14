import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HashRouter, Routes, Route } from 'react-router-dom'
import MiniDrawer from './components/MiniDrawer';
import Landing from './pages/Landing'
import ConnectWorkbook from './pages/ConnectWorkbook';
import AssignVariables from './pages/AssignVariables';
import ProceedSimulation from './pages/ProceedSimulation';
import CheckResults from './pages/CheckResults';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ColorModeContext from './contexts/ColorModeContext';

function App() {
  const [conn, setConn] = useState()
  const [connWith, setConnWith] = useState()
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
          <Route path="assign_variables" element={<AssignVariables />} />
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
