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
    }, call.duration * 100); // Here I'm simulating minutes. If were real minutes, this would take forever
  }

  attendCall(call: Call, simulation: CallCenterSimulation) {
    call.attend(simulation.currentMinuteOfDay);
    this.calls.push(call);
    this.startCall(call, simulation);
  }
}
