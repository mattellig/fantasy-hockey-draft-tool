import { CogIcon, DatabaseIcon, HomeIcon, UsersIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { getLinkStyles } from '../../components/Link/Link';
import Data from './components/Data/Data';
import Settings from './components/Settings/Settings';
import Teams from './components/Teams/Teams';

const mainLinkStyles = `${getLinkStyles(true)} font-medium text-base`;

const Customize = (): JSX.Element => {
    const { path, url } = useRouteMatch();

    return (
        <div className="max-w-7xl mx-auto sm:px-5 md:px-8 py-6">
            <div className="grid grid-cols-12 gap-8">
                <nav className="col-span-2 py-1 -mt-1">
                    <ul className="space-y-1 text-gray-600">
                        <li>
                            <NavLink
                                to={url}
                                activeClassName="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                                className="flex items-center px-3 py-1.5 rounded-md text-base font-medium hover:bg-gray-100 hover:text-gray-800 transition-colors"
                                exact
                            >
                                <HomeIcon className="h-5 w-5 mr-2 -ml-0.5 opacity-60" />
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={`${url}/data`}
                                activeClassName="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                                className="flex items-center px-3 py-1.5 rounded-md text-base font-medium hover:bg-gray-100 hover:text-gray-800 transition-colors"
                            >
                                <DatabaseIcon className="h-5 w-5 mr-2 -ml-0.5 opacity-60" />
                                Data
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={`${url}/settings`}
                                activeClassName="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                                className="flex items-center px-3 py-1.5 rounded-md text-base font-medium hover:bg-gray-100 hover:text-gray-800 transition-colors"
                            >
                                <CogIcon className="h-5 w-5 mr-2 -ml-0.5 opacity-60" />
                                Settings
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={`${url}/teams`}
                                activeClassName="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                                className="flex items-center px-3 py-1.5 rounded-md text-base font-medium hover:bg-gray-100 hover:text-gray-800 transition-colors"
                            >
                                <UsersIcon className="h-5 w-5 mr-2 -ml-0.5 opacity-60" />
                                Teams
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="col-span-10">
                    <Switch>
                        <Route exact path={path}>
                            <div className="mb-6">
                                <h1 className="text-2xl font-medium text-gray-800">
                                    Customize fantasy hockey draft tool
                                </h1>
                            </div>
                            <ul className="divide-y">
                                <li className="pb-4">
                                    <Link to={`${path}/data`} className={mainLinkStyles}>
                                        Data
                                    </Link>
                                    <p className="mt-0.5 text-base text-gray-500">
                                        Upload custom projections to replace the sample data.
                                    </p>
                                </li>
                                <li className="py-4">
                                    <Link to={`${path}/settings`} className={mainLinkStyles}>
                                        Settings
                                    </Link>
                                    <p className="mt-0.5 text-base text-gray-500">
                                        Adjust roster and scoring settings to match your league.
                                    </p>
                                </li>
                                <li className="py-4">
                                    <Link to={`${path}/teams`} className={mainLinkStyles}>
                                        Teams
                                    </Link>
                                    <p className="mt-0.5 text-base text-gray-500">
                                        Configure the teams taking part in your draft.
                                    </p>
                                </li>
                            </ul>
                        </Route>
                        <Route path={`${path}/settings`}>
                            <Settings />
                        </Route>
                        <Route path={`${path}/teams`}>
                            <Teams />
                        </Route>
                        <Route path={`${path}/data`}>
                            <Data />
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    );
};

export default Customize;
