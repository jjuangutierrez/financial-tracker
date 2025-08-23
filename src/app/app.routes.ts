import { Routes } from '@angular/router';
import { HomePage } from './features/home-page/home-page';
import { DashboardPage } from './features/dashboard-page/dashboard-page';
import { Layout } from './core/layout/layout';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '',
                component: HomePage
            },
            {
                path: 'dashboard',
                component: DashboardPage
            }
        ]
    }
];
