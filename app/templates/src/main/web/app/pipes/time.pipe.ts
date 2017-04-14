import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'time'})
export class TimePipe implements PipeTransform {

    private oneSecond = 1000;
    private oneMinute = this.oneSecond * 60;
    private oneHour = this.oneMinute * 60;
    private oneDay = this.oneHour * 24;

  transform(value: number): string {

        let seconds = Math.floor((value % this.oneMinute) / this.oneSecond);
        let minutes = Math.floor((value % this.oneHour) / this.oneMinute);
        let hours = Math.floor((value % this.oneDay) / this.oneHour);
        let days = Math.floor(value / this.oneDay);

        let timeString = '';
        if (days !== 0) {
            timeString += (days !== 1) ? (days + ' days ') : (days + ' day ');
        }
        if (hours !== 0) {
            timeString += (hours !== 1) ? (hours + ' hours ') : (hours + ' hour ');
        }
        if (minutes !== 0) {
            timeString += (minutes !== 1) ? (minutes + ' minutes ') : (minutes + ' minute ');
        }
        if (seconds !== 0 || value < 1000) {
            timeString += (seconds !== 1) ? ('and ' + seconds + ' seconds ') : ('and ' + seconds + ' second ');
        }
        return timeString;
  }
}
