import { Component } from '@angular/core';
import { DashboardSidebar } from '../../shared/dashboard-sidebar/dashboard-sidebar';
import { DashboardTransaction } from '../../shared/dashboard-transaction/dashboard-transaction';
import { DashboardSummary } from '../../shared/dashboard-summary/dashboard.summary';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.css'],
  imports: [DashboardSidebar, DashboardTransaction, DashboardSummary],
})
export class DashboardPage {}
