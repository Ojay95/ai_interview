
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Application failed to mount:", error);
  rootElement.innerHTML = `
    <div style="
        color: #ef4444; 
        background: #111521; 
        height: 100vh; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        font-family: sans-serif;
        text-align: center;
        padding: 20px;
    ">
        <h1 style="font-size: 24px; margin-bottom: 10px;">Critical Application Error</h1>
        <p style="color: #9da4b8; margin-bottom: 20px;">The app failed to start. Check the browser console for technical details.</p>
        <div style="
            background: #1c1e26; 
            padding: 20px; 
            border-radius: 8px; 
            border: 1px solid #3c4253; 
            overflow: auto; 
            max-width: 800px; 
            text-align: left;
            font-family: monospace;
            font-size: 12px;
        ">
          ${(error as Error).message}<br/>
          ${(error as Error).stack?.replace(/\n/g, '<br/>')}
        </div>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #194ce6; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Reload Application
        </button>
    </div>`;
}
