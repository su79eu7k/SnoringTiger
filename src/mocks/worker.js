// src/mocks/browser.js
import { setupWorker } from 'msw'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)

// Start the worker by default
worker.start()

// Write the stop method on the window
// to access during runtime.
window.__mswStop = worker.stop