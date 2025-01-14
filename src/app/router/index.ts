import React from "react";
import { routeConstants } from "../../utils/constants/routeConstants";
import AllUsersPage from "../../pages/AllUsersPage/AllUsersPage";
import SavedUsersPage from "../../pages/SavedUsersPage/SavedUsersPage";

export interface IRoute {
    path: string;
    component: React.ComponentType;
    exact?: boolean;
}

export const publicRoutes: IRoute[] = [
    {path: routeConstants.ALL_USERS, exact: true, component: AllUsersPage},
    {path: routeConstants.SAVED_USERS, exact: true, component: SavedUsersPage},
    // {path: routeConstants.SAVED_USERS, exact: true, component: RegisterPage},
]