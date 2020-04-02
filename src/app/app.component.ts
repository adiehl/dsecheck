import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dsecheck';
  gdprcontent = '';
  checks = [
  ];
  constructor(private http: HttpClient) { }
  contentChanged(event) {
    this.gdprcontent = event.target.value;
    console.log(this.gdprcontent);
  }

  async ngOnInit() {
    await this.loadChecks();
  }

  async resetChecks() {
    for (const currentCheck of this.checks) {
      currentCheck.contents = [];
      currentCheck.success = null;
    }
  }

  async doChecks() {
    this.resetChecks();
    for (const currentCheck of this.checks) {
      for (const row of this.gdprcontent.split('\n')) {
        console.log('Checking row: ' + row);
        for (const check of currentCheck.checks) {
          console.log('Check: ' + check);
          const regex = new RegExp(`${check}`, 'i');
          if (row.match(regex)) {
            currentCheck.success = true;
            currentCheck.contents.push(row);
            continue;
          }
        }
      }
    }
  }
  async loadChecks() {
    this.checks = [];
    let counter = 1;
    let worked = true;
    while (worked) {
      try {
        const content: string = await this.http.get(`assets/${counter}.txt`,
          {
            responseType: 'text',
            headers: {'Cache-Control': 'no-cache'}
          },
          ).toPromise();
        const checks = content.split('\n');
        console.log(checks);
        const checkName = checks.shift();
        while (checks[checks.length - 1] === '') {
          checks.pop();
        }
        const checkObj = {
          name: checkName,
          contents: [],
          success: null,
          checks: checks
        };
        this.checks.push(checkObj);
        console.log(checkObj);
        counter++;
      } catch (e) {
        worked = false;
      }
    }
  }
}
