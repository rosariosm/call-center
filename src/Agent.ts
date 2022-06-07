import { Call } from "./Call";
import CallCenterSimulation from "./cally";

export class Agent {
  calls: Call[];

  constructor() {
    this.calls = [];
  }

  hangUpCall(simulation: CallCenterSimulation) {
    simulation.hangUpCall(this);
  }

  startCall(call: Call, simulation: CallCenterSimulation): void {
    setTimeout(() => {
      this.hangUpCall(simulation);
    }, call.duration);
  }

  attendCall(call: Call, simulation: CallCenterSimulation) {
    call.attend(simulation.currentMinuteOfDay);
    this.calls.push(call);
    this.startCall(call, simulation);
  }
}
