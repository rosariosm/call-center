export class Call {
  attendedAt: number;
  createdAt: number;
  duration: number;
  waitingTime: number;

  constructor(createdAt: number, duration: number) {
    this.createdAt = createdAt;
    this.duration = duration;
    this.attendedAt = 0;
    this.waitingTime = 0;
  }

  attend(attendedAt: number) {
    this.attendedAt = attendedAt;
    this.waitingTime = attendedAt - this.createdAt;
  }
}
