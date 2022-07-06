import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import App from './App';


describe('app before upload file', () => {
  test('darkmode click', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId("Brightness7Icon")).toBeInTheDocument()
    await user.click(screen.getByTestId("darkmodeButton"))
    expect(screen.getByTestId("Brightness4Icon")).toBeInTheDocument()
  })

  test('connect workbook click', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId("connectWorkbook"))
    expect(screen.getByLabelText("Select")).toBeInTheDocument()
    expect(screen.getByText("Connect").closest('button')).toBeEnabled()
  })

  test('add random cells click', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId("addRandomCells"))
    expect(screen.getByText("Connect").closest('button')).toBeDisabled()
    expect(screen.getByText("Manual").closest('button')).toBeDisabled()
    expect(screen.getByText("Assign").closest('button')).toBeDisabled()
  })

  test('add monitoring cells click', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId("addMonitoringCells"))
    expect(screen.getByText("Connect").closest('button')).toBeDisabled()
    expect(screen.getByText("Assign").closest('button')).toBeDisabled()
  })

  test('proceed simulation click', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId("proceedSimulation"))
    expect(screen.getByText("Start").closest('button')).toBeDisabled()
    expect(screen.getByText("Pause").closest('button')).toBeDisabled()
    expect(screen.getByText("Cancel").closest('button')).toBeDisabled()
    expect(screen.getByText("Save").closest('button')).toBeDisabled()

    expect(screen.getByText("Add Preview").closest('button')).toBeDisabled()
  })

  test('check history click', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId("checkHistory"))
    expect(screen.getByText("History")).toBeInTheDocument()
  })
})

// describe('app after upload file', () => {
//   test('upload file', () => {
//     render(<App />)

//     userEvent.click(screen.getByTestId("connectWorkbook"))
//     userEvent.upload(screen.getByLabelText("contained-button-file"), './App.js')
//   })
// })


