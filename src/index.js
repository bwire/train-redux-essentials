import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'
import { worker } from './api/server'
import { apiSlice } from './features/api/apiSlice'

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start mock API server
  await worker.start({ onUnhandledRequest: 'bypass' })

  store.dispatch(apiSlice.endpoints.getUsers.initiate())

  const root = createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}

start()
