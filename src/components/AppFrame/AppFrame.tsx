import * as React from 'react';
import ToastContainer from '../Toast/Toast';

interface AppFrameProps {
    children?: React.ReactNode;
    topBar?: React.ReactNode;
}

const AppFrame = ({ children, topBar }: AppFrameProps): JSX.Element => (
    <div className="flex flex-col w-full min-h-screen bg-white text-gray-700 selection:bg-yellow-200">
        <div className="fixed z-50 top-4 left-3 opacity-0 pointer-events-none">
            <a href="#main-app-content">
                Skip to content
            </a>
        </div>
        {topBar}
        <main
            id="main-app-content"
            className="flex flex-1 items-stretch min-w-0 max-w-full"
        >
            <div className="relative flex-1 min-w-0 max-w-full">
                {children}
            </div>
        </main>
        <ToastContainer />
    </div>
);

export default AppFrame;
