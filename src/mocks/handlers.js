// src/mocks/handlers.js
import { rest } from 'msw'

export const handlers = [
  rest.get('http://127.0.0.1:8000/check_connection', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        {code: 1, message: 'test.xlsx'}
      )
    )
  }),

  rest.get('http://127.0.0.1:8000/reset', (req, res, ctx) => {
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
          sheet: "Sheet1",
          range: "A1",
          code: 1,
          message: "Success: Connection, Getting selection."
        }
      )
    )
  }),
]