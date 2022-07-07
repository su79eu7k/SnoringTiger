import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import App from './App';

describe('app before upload file', () => {
  test('darkmode click', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId("Brightness7Icon")).toBeInTheDocument()

    user.click(screen.getByTestId("BtnDarkmode"))

    expect(await screen.findByTestId("Brightness4Icon")).toBeInTheDocument()
  })

  test('connect workbook click', async () => {
    const user = userEvent.setup()
    render(<App />)

    user.click(screen.getByTestId("connectWorkbook"))

    expect(await screen.findByTestId("BtnSelectWorkbook")).toBeInTheDocument()
    expect(await screen.findByTestId("BtnConnWorkbook")).toBeEnabled()
  })

  test('add random cells click', async () => {
    const user = userEvent.setup()
    render(<App />)

    user.click(screen.getByTestId("addRandomCells"))

    expect(await screen.findByTestId("BtnConnRandCell")).toBeDisabled()
    expect(await screen.findByTestId("BtnManual")).toBeDisabled()
    expect(await screen.findByTestId("BtnRandAssign")).toBeDisabled()
  })

  test('add monitoring cells click', async () => {
    const user = userEvent.setup()
    render(<App />)

    user.click(screen.getByTestId("addMonitoringCells"))

    expect(await screen.findByTestId("BtnConnMonitCell")).toBeDisabled()
    expect(await screen.findByTestId("BtnMonitAssign")).toBeDisabled()
  })

  test('proceed simulation click', async () => {
    const user = userEvent.setup()
    render(<App />)

    user.click(screen.getByTestId("proceedSimulation"))

    expect(await screen.findByTestId("BtnSimStart")).toBeDisabled()
    expect(await screen.findByTestId("BtnSimPause")).toBeDisabled()
    expect(await screen.findByTestId("BtnSimCancel")).toBeDisabled()
    expect(await screen.findByTestId("BtnSimSave")).toBeDisabled()

    expect(await screen.findByTestId("BtnAddPreview")).toBeDisabled()
  })

  test('check history click', async () => {
    const user = userEvent.setup()
    render(<App />)

    user.click(screen.getByTestId("checkHistory"))
    
    expect(await screen.findByText("History")).toBeInTheDocument()
  })
})
