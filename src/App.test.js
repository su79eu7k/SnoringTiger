import "@testing-library/react/dont-cleanup-after-each";
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from './mocks/server';
import App from './App';

describe('Integration test', () => {
  beforeAll(() => {
    server.listen()
    render(<App />)
  });
  afterAll(() => {
    cleanup()
    server.close()
  });

  test('Darkmode', async () => {
    const user = userEvent.setup()

    expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument()

    user.click(screen.getByTestId('BtnDarkmode'))

    expect(await screen.findByTestId('Brightness4Icon')).toBeInTheDocument()
  })

  test('Connect Workbook', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('connectWorkbook'))

    expect(await screen.findByTestId('BtnSelectWorkbook')).toBeInTheDocument()
    expect(await screen.findByTestId('BtnConnWorkbook')).toBeEnabled()
  })

  test('Add Random Cells', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('addRandomCells'))

    expect(await screen.findByTestId('BtnConnRandCell')).toBeDisabled()
    expect(await screen.findByTestId('BtnManual')).toBeDisabled()
    expect(await screen.findByTestId('BtnRandAssign')).toBeDisabled()
  })

  test('Add Monitoring Cells', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('addMonitoringCells'))

    expect(await screen.findByTestId('BtnConnMonitCell')).toBeDisabled()
    expect(await screen.findByTestId('BtnMonitAssign')).toBeDisabled()
  })

  test('Proceed Simulation', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('proceedSimulation'))

    expect(await screen.findByTestId('BtnSimStart')).toBeDisabled()
    expect(await screen.findByTestId('BtnSimPause')).toBeDisabled()
    expect(await screen.findByTestId('BtnSimCancel')).toBeDisabled()
    expect(await screen.findByTestId('BtnSimSave')).toBeDisabled()

    expect(await screen.findByTestId('BtnAddPreview')).toBeDisabled()
  })

  test('Check History', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('checkHistory'))
    
    expect(await screen.findByText('History')).toBeInTheDocument()
  })

  test('Upload file: Connect Workbook', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('connectWorkbook'))

    expect(await screen.findByTestId('BtnSelectWorkbook')).toBeInTheDocument()
    expect(await screen.findByTestId('BtnConnWorkbook')).toBeEnabled()

    user.click(await screen.findByTestId('BtnSelectWorkbook'))

    const input = await screen.findByLabelText('Select')
    const file = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    user.upload(input, file)

    expect(await screen.findByText('test.xlsx')).toBeInTheDocument()

    user.click(await screen.findByTestId('BtnConnWorkbook'))

    expect(await screen.findByText('Connected to test.xlsx')).toBeInTheDocument()
  })

  test('Upload file: Add Random Cells', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('addRandomCells'))

    expect(await screen.findByTestId('BtnConnRandCell')).toBeEnabled()
    expect(await screen.findByTestId('BtnManual')).toBeEnabled()
    expect(await screen.findByTestId('BtnRandAssign')).toBeDisabled()

    user.click(screen.getByTestId('BtnConnRandCell'))

    expect(await screen.findByText('Uniform')).toBeInTheDocument()

    await user.type((await screen.findByTestId('inpStart')).querySelector('input'), '0')
    await user.type((await screen.findByTestId('inpEnd')).querySelector('input'), '50')
    await user.type((await screen.findByTestId('inpStep')).querySelector('input'), '20')
    
    expect((await screen.findByTestId('inpLoc')).querySelector('input')).toHaveValue('0')
    expect((await screen.findByTestId('inpScale')).querySelector('input')).toHaveValue('50')
  })

  test('Upload file: Add Monitoring Cells', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('addMonitoringCells'))

    expect(await screen.findByTestId('BtnConnMonitCell')).toBeEnabled()
    expect(await screen.findByTestId('BtnMonitAssign')).toBeDisabled()
  })

  test('Upload file: Proceed Simulation', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('proceedSimulation'))

    expect(await screen.findByTestId('BtnSimStart')).toBeDisabled()
    expect(await screen.findByTestId('BtnSimPause')).toBeDisabled()
    expect(await screen.findByTestId('BtnSimCancel')).toBeDisabled()
    expect(await screen.findByTestId('BtnSimSave')).toBeDisabled()

    expect(await screen.findByTestId('BtnAddPreview')).toBeDisabled()
  })

  test('Upload file: Check History', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('checkHistory'))
    
    expect(await screen.findByText('History')).toBeInTheDocument()
  })

})
