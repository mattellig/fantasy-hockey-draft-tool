import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext/SettingsContext';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <SettingsProvider>
            <App />
        </SettingsProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
