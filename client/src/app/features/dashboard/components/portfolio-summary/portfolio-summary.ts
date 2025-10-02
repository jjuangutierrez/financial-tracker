import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { TransactionsService } from '../../../../core/services/transactions.service';
import { PortfolioSelectionService } from '../../../../core/services/portfolio-selection.service';
import { Subject, takeUntil } from 'rxjs';
import { EChartsOption } from 'echarts';
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';

@Component({
  selector: 'app-portfolio-summary',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  providers: [
    provideEchartsCore({ echarts })
  ],
  templateUrl: './portfolio-summary.html',
  styleUrl: './portfolio-summary.css'
})
export class PortfolioSummary implements OnInit, OnDestroy {
  private transactionsService = inject(TransactionsService);
  private portfolioSelectionService = inject(PortfolioSelectionService);
  private destroy$ = new Subject<void>();
  balanceChartOptions: EChartsOption = {};

  chartOptions: EChartsOption = {};
  totalIncome = 0;
  totalExpense = 0;
  incomeCount = 0;
  expenseCount = 0;

  ngOnInit(): void {
  // Listen transactions
  this.transactionsService.transactions$
    .pipe(takeUntil(this.destroy$))
    .subscribe(transactions => {
      this.calculateTotals(transactions);
      this.updateChart();
      this.updateBalanceChart(transactions);
    });

  // Listen portfolio selected
  this.portfolioSelectionService.selectedPortfolio$
    .pipe(takeUntil(this.destroy$))
    .subscribe(portfolio => {
      if (!portfolio) {
        this.resetChart();
      }
    });
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateTotals(transactions: any[]): void {
    this.totalIncome = 0;
    this.totalExpense = 0;
    this.incomeCount = 0;
    this.expenseCount = 0;

    transactions.forEach(tx => {
      if (tx.type === 'income') {
        this.totalIncome += tx.amount;
        this.incomeCount++;
      } else if (tx.type === 'expense') {
        this.totalExpense += tx.amount;
        this.expenseCount++;
      }
    });
  }

  private updateChart(): void {
    const total = this.totalIncome + this.totalExpense;
    
    if (total === 0) {
      this.resetChart();
      return;
    }

    this.chartOptions = {
      title: {
        text: 'Income vs Expenses',
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const type = params.name;
          const amount = params.value;
          const percentage = params.percent;
          const count = type === 'Income' ? this.incomeCount : this.expenseCount;
          
          return `
            <strong>${type}</strong><br/>
            Amount: $${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br/>
            Percentage: ${percentage}%<br/>
            Transactions: ${count}
          `;
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        data: ['Income', 'Expenses']
      },
      series: [
        {
          name: 'Financial Overview',
          type: 'pie',
          radius: ['40%', '70%'], // Donut chart
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%',
            fontSize: 14
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: [
            {
              value: this.totalIncome,
              name: 'Income',
              itemStyle: {
                color: '#52c41a'
              }
            },
            {
              value: this.totalExpense,
              name: 'Expenses',
              itemStyle: {
                color: '#ff4d4f'
              }
            }
          ]
        }
      ]
    };
  }

private updateBalanceChart(transactions: any[]): void {
  //order by date
  const sorted = [...transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let balance = 0;
  const balanceData = sorted.map(tx => {
    balance += tx.type === 'income' ? tx.amount : -tx.amount;
    return {
      date: tx.date,
      balance: balance,
      transaction: tx.title
    };
  });
  
  this.balanceChartOptions = {
    title: {
      text: 'Cumulative Balance',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = balanceData[params[0].dataIndex];
        return `
          Date: ${data.date}<br/>
          Transaction: ${data.transaction}<br/>
          Balance: $${data.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: balanceData.map(d => d.date),
      axisLabel: {
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}'
      }
    },
    series: [
      {
        type: 'line',
        data: balanceData.map(d => d.balance),
        smooth: true,
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
            ]
          }
        },
        markLine: {
          silent: true,
          lineStyle: { color: '#999', type: 'dashed' },
          data: [{ yAxis: 0 }],
          label: { formatter: 'Break-even' }
        }
      }
    ]
  };
}

  private resetChart(): void {
    this.totalIncome = 0;
    this.totalExpense = 0;
    this.incomeCount = 0;
    this.expenseCount = 0;
    
    this.chartOptions = {
      title: {
        text: 'No data available',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#999',
          fontSize: 16
        }
      }
    };
  }
}
