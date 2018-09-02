import { Component } from '@angular/core';
import { GithubService } from './services/github.service';
import { AgGridNg2 } from 'ag-grid-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  agGrid: AgGridNg2;
  // gridColumnApi;
  rowData: any[];

  columnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      suppressMenu: true,
      suppressFilter: true
    },
    {
      headerName: 'Full Name',
      field: 'full_name',
      suppressMenu: true,
      suppressFilter: true
    },
    {
      headerName: 'Language',
      field: 'language',
      suppressMenu: true,
      suppressFilter: true
    }
  ];

  pagination = {
    currentPage: 1,
    lastRow: null,
    pageSize: 10
  };

  gridOptions = {
    cacheBlockSize: 10,
    columnDefs: this.columnDefs,
    enableServerSideSorting: true,
    enableServerSideFilter: true,
    infiniteInitialRowCount: 1,
    enableColResize: true,
    onPaginationChanged: this.onPaginationChanged,
    pagination: true,
    paginationPageSize: this.pagination.pageSize,
    rowModelType: 'infinite'
  };

  constructor(private service: GithubService) { }

  onGridReady(params) {
    console.log(`onGridReady fired..${params.api}`);
    this.agGrid.api = params.api;

    const dataSource = this.getDataSource();
    this.agGrid.api.setDatasource(dataSource);

  }

  onPaginationChanged() {

    console.log('onPaginationChanged fired..');

    if (this.agGrid) {
      console.log(`his.agGrid.api.paginationGetCurrentPage() = ${this.agGrid.api.paginationGetCurrentPage()}`);
      this.pagination.currentPage = this.agGrid.api.paginationGetCurrentPage() + 1;
      console.log(`this.pagination.currentPage = ${this.pagination.currentPage}`);
    }
    console.log(`this.agGrid=${this.agGrid}`);
  }

  getDataSource() {
    return {
      rowCount: this.pagination.lastRow,
      getRows: (params) => {
        this.service.getGitHubUsers(this.pagination.currentPage, this.pagination.pageSize)
          .subscribe(users => {
            const usersLength = users.length;
            if (usersLength === 0 || usersLength < this.pagination.pageSize) {
              this.pagination.lastRow = (this.pagination.currentPage - 1) * this.pagination.pageSize + usersLength;
            }
            params.successCallback(users, this.pagination.lastRow);
          });
      }
    };
  }
}
