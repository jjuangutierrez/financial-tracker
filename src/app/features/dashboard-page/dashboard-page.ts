import { Component } from "@angular/core";
import { DashboardSidebar } from '../../shared/dashboard-sidebar/dashboard-sidebar';
import { DashboardTransaction } from "../../shared/dashboard-transaction/dashboard-transaction";

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.html',
    styleUrls: ['./dashboard-page.css'],
    imports: [DashboardSidebar, DashboardTransaction]
})
export class DashboardPage {
}