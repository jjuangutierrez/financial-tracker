import { Component } from "@angular/core";
import { DashboardSidebar } from '../../shared/dashboard-sidebar/dashboard-sidebar';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.html',
    styleUrls: ['./dashboard-page.css'],
    imports: [DashboardSidebar]
})
export class DashboardPage {
}