import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IssueRecord } from './IssueRecord';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent  {

  title = 'Issue Viewer';
  public issueRecords: any[] = [];
  filteredIssueRecords: IssueRecord[] = [];
  filterByNum : Number;
  _listFilter = '';

  @ViewChild('fileImportInput',{static: true}) fileImportInput: any;



  fileChangeListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files || $event.target;

    if (this.isValidFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;

        let csvRecordsArray = (<string>csvData).replace(/\"/g, '').split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.issueRecords = this.getRecordDetails(csvRecordsArray, headersRow.length);

        this.filteredIssueRecords = this.issueRecords;
      };

      reader.onerror = function () {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  isValidFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(issueRecordArray: any) {
    let headers = (<string>issueRecordArray[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }


  getRecordDetails(issueRecordsArray: any, headerLength: any) {
    let dataArr = [];

    for (let i = 1; i < issueRecordsArray.length; i++) {
      let data = (<any>issueRecordsArray[i]).split(',');

            if (data.length == headerLength) {

        let issueRecord: IssueRecord = new IssueRecord();

        issueRecord.firstName = data[0].trim();
        issueRecord.surname = data[1].trim();

        issueRecord.issueCount = data[2];
        issueRecord.dateOfBirth = new Date (data[3]);


        dataArr.push(issueRecord);
      }
    }
    return dataArr;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.issueRecords = [];
  }



  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredIssueRecords = this.listFilter ? this.performFilter(this.listFilter) : this.issueRecords;
  }
  performFilter(filterBy: string): IssueRecord[] {

    this.filterByNum= +filterBy;
    return this.issueRecords.filter((issue: IssueRecord) =>


     issue.issueCount >= this.filterByNum);
  }


}

