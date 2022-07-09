import "@testing-library/react/dont-cleanup-after-each";
import { render, screen, cleanup, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
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

  test('Upload file: Add Random Cells - Input Auto', async () => {
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

    user.click(screen.getByTestId('BtnProb'))

    await waitFor(() => expect(screen.getAllByTestId('BtnRandAssign')[0]).toBeEnabled(), { timeout: 1000 })

    user.click(screen.getAllByTestId('BtnRandAssign')[0])

    await waitFor(() => expect(screen.getByTestId('BtnRandAssigned')).toBeEnabled(), { timeout: 1000 })
  })

  test('Upload file: Add Random Cells - Input Manual', async () => {
    const user = userEvent.setup()

    expect(screen.getAllByTestId('BtnManual')[1]).toBeEnabled()
    user.click(screen.getAllByTestId('BtnManual')[1])
    expect(await screen.findByTestId('BtnAuto')).toBeEnabled()

    expect(screen.getAllByTestId('BtnConnRandCell')[1]).toBeEnabled()
    user.click(screen.getAllByTestId('BtnConnRandCell')[1])
    
    expect(await screen.findByText(/duplicate/)).toBeInTheDocument()

    user.click(screen.getByTestId('AddIcon'))

    
    await user.type((await screen.findAllByTestId('inpRandVar'))[0].querySelector('input'), '0')
    await user.type((await screen.findAllByTestId('inpProb'))[0].querySelector('input'), '70')

    await user.type((await screen.findAllByTestId('inpRandVar'))[1].querySelector('input'), '1')
    await user.type((await screen.findAllByTestId('inpProb'))[1].querySelector('input'), '30')

    user.click(screen.getByTestId('BtnRandAssigned'))
    await waitForElementToBeRemoved(() => screen.getByText(/duplicate/))
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

    expect(await screen.findByTestId('BtnAddPreview')).toBeEnabled()
  })

  test('Upload file: Check History', async () => {
    const user = userEvent.setup()

    user.click(screen.getByTestId('checkHistory'))
    
    expect(await screen.findByText('History')).toBeInTheDocument()
  })

})
