import { AdjustmentsIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { BrowserRouter as Router, Link, NavLink, Route, Switch } from 'react-router-dom';
import AppFrame from './components/AppFrame/AppFrame';
import TopBar from './components/TopBar/TopBar';
import { SettingsProvider } from './contexts/SettingsContext/SettingsContext';
import Customize from './pages/Customize/Customize';
import Draft from './pages/Draft/Draft';

const App = (): JSX.Element => (
    <SettingsProvider>
        <Router basename={import.meta.env.BASE_URL}>
            <AppFrame
                topBar={
                    <TopBar>
                        <TopBar.Section>
                            <Link to="/" className="mr-10 text-lg font-medium tracking-wide truncate">
                                fantasy hockey draft tool
                            </Link>
                        </TopBar.Section>
                        <TopBar.Section end>
                            <div className="mr-2">
                                <NavLink
                                    to="/customize"
                                    activeClassName="bg-blue-700"
                                    className="flex items-center rounded-md px-3 py-1.5 font-medium hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
                                >
                                    <AdjustmentsIcon className="h-5 w-5 mr-2 -ml-0.5" />
                                    Customize
                                </NavLink>
                            </div>
                            <a
                                href="https://github.com/mattellig/fantasy-hockey-draft-tool"
                                className="rounded-md p-1.5 hover:bg-blue-700"
                                target="_blank"
                                aria-label="View on GitHub"
                            >
                                <svg width="24" height="24" fill="currentColor">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"></path>
                                </svg>
                            </a>
                        </TopBar.Section>
                    </TopBar>
                }
            >
                <Switch>
                    <Route path="/" exact>
                        <Draft />
                    </Route>
                    <Route path="/customize">
                        <Customize />
                    </Route>
                </Switch>
            </AppFrame>
        </Router>
    </SettingsProvider>
);

export default App;
