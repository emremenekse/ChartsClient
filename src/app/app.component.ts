import { Component } from '@angular/core';
import * as Highcharts from "highcharts";
import * as signalR from "@microsoft/signalr"
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /**
   *
   */
  connection : signalR.HubConnection;
  constructor() {
    this.connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44393/satishub").build();
    this.connection.start();
    
    this.connection.on("receiveMessage", message => {
      this.chart.showLoading();
      console.log(message);

      while (this.chart.series.length) {
        this.chart.series[0].remove(); // `false` animasyon olmadan kaldırmak için
      }
      
      message.forEach((i:any) => {
      this.chart.addSeries({
        name: i.personelAdi.trim(),
        type: 'line',
        data: i.satislar
      });
      });

      this.updateFromInput =true;
      this.chart.hideLoading();
    });
    

    const self = this;
    this.chartCallback = (chart: Highcharts.Chart) => {
      self.chart = chart;
    }
  }
  chart!: Highcharts.Chart;
  updateFromInput: any;
  chartCallback;
  Highcharts : typeof Highcharts = Highcharts;
  chartOptions : Highcharts.Options = {
    //Grafik Title
    title: {
      text: "Person-Point"
    },
    subtitle: {
      text: "Point Chart"
    },
    yAxis: {
      title: {
        text:"Point"
      }
    },
    xAxis: {
      accessibility: {
        rangeDescription:"2019 - 2020"
      }
    },
    legend: {
      layout: "vertical",
      align:"right",
      verticalAlign: "middle"
    },
    plotOptions: {
      series:{
        label:{
          connectorAllowed: true
        },
        pointStart: 0
      }
    }
  }
}
