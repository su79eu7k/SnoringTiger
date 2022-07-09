// src/mocks/handlers.js
import { rest } from 'msw'

sessionStorage.setItem('file-uploaded', 'false')

export const handlers = [
  rest.post('http://127.0.0.1:8000/upload_file', (req, res, ctx) => {
    sessionStorage.setItem('file-uploaded', 'true')

    return res(
      ctx.status(200),
      ctx.json(
        {code: 1, message: 'Success: Workbook initiation, Connection, Getting selection.'}
      )
    )
  }),

  rest.get('http://127.0.0.1:8000/check_connection', (req, res, ctx) => {
    if (sessionStorage.getItem('file-uploaded') === 'true') {
      return res(
        ctx.status(200),
        ctx.json(
          {code: 1, message: 'test.xlsx'}
        )
      )  
    }

    return res(
      ctx.status(200),
      ctx.json(
        {code: -1, message: 'Never connected'}
      )
    )
  }),

  rest.get('http://127.0.0.1:8000/reset', (req, res, ctx) => {
    sessionStorage.setItem('file-uploaded', false)

    return res(
      ctx.status(200),
      ctx.json(
        {code: 1, message: 'Success: Session re-initiated.'}
      )
    )
  }),

  rest.get('http://127.0.0.1:8000/get_selection', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        {
          sheet: 'Sheet1',
          range: 'A1',
          code: 1,
          message: 'Success: Connection, Getting selection.'
        }
      )
    )
  }),

  rest.post('http://127.0.0.1:8000/prob', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        {
          code: 1,
          message: 'Success: Variable processed with requested distribution.',
          dist: 'unif',
          x: [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5, 40, 42.5, 45, 47.5, 50],
          prob: [0.05, 0.05, 0.04999999999999999, 0.05000000000000002, 0.04999999999999999, 0.04999999999999999, 0.04999999999999999, 0.050000000000000044, 0.04999999999999999, 0.04999999999999999, 0.050000000000000044, 0.04999999999999993, 0.050000000000000044, 0.04999999999999993, 0.050000000000000044, 0.050000000000000044, 0.04999999999999993, 0.050000000000000044, 0.04999999999999993, 0.050000000000000044],
        }
      )
    )
  }),

  rest.post('http://127.0.0.1:8000/add_random_cell', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        {
          code: 1, message: 'Success: Assigned.',
        }
      )
    )
  }),

  rest.post('http://127.0.0.1:8000/remove_random_cell', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        {
          code: 1, message: 'Success: Unassigned.',
        }
      )
    )
  }),
]