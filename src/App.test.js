import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';


describe('app before upload file', () => {
  test('darkmode click', () => {
    render(<App />)

    expect(screen.getByTestId("Brightness7Icon")).toBeInTheDocument()
    fireEvent.click(screen.getByTestId("darkmodeButton"))
    expect(screen.getByTestId("Brightness4Icon")).toBeInTheDocument()
  })

  test('connect workbook click', () => {
    render(<App />)

    fireEvent.click(screen.getByTestId("connectWorkbook"))
    expect(screen.getByLabelText("Select")).toBeInTheDocument()
    expect(screen.getByText("Connect").closest('button')).toBeEnabled()
  })

  test('add random cells click', () => {
    render(<App />)

    fireEvent.click(screen.getByTestId("addRandomCells"))
    expect(screen.getByText("Connect").closest('button')).toBeDisabled()
    expect(screen.getByText("Manual").closest('button')).toBeDisabled()
    expect(screen.getByText("Assign").closest('button')).toBeDisabled()
  })

  test('add monitoring cells click', () => {
    render(<App />)

    fireEvent.click(screen.getByTestId("addMonitoringCells"))
    expect(screen.getByText("Connect").closest('button')).toBeDisabled()
    expect(screen.getByText("Assign").closest('button')).toBeDisabled()
  })

  test('proceed simulation click', () => {
    render(<App />)

    fireEvent.click(screen.getByTestId("proceedSimulation"))
    expect(screen.getByText("Start").closest('button')).toBeDisabled()
    expect(screen.getByText("Pause").closest('button')).toBeDisabled()
    expect(screen.getByText("Cancel").closest('button')).toBeDisabled()
    expect(screen.getByText("Save").closest('button')).toBeDisabled()

    expect(screen.getByText("Add Preview").closest('button')).toBeDisabled()
  })

  test('check history click', () => {
    render(<App />)

    fireEvent.click(screen.getByTestId("checkHistory"))
    expect(screen.getByText("History")).toBeInTheDocument()
  })
})


