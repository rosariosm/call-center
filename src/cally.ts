import { Agent } from "./Agent";
import { Call } from "./Call";
import { getRandomNumberBetween, getAverage } from "./utils";

type ScenarioRangeCondition = {
  start: number; // Minute of day that the condition applies
  end: number; // Minute of day where the condition stops applying
  callsPerMinute: number;
};

export type Scenario = ScenarioRangeCondition[];

abstract class DayByMinuteSimulation {
  currentMinuteOfDay: number;
  time: number;

  constructor(
    // Current minute of the current day
    currentMinuteOfDay: number = 0
  ) {
    this.currentMinuteOfDay = currentMinuteOfDay;
    this.time = 60 * 24; // minutes in a day
  }

  // Runs every minute, should have simulation logic
  abstract tick(): void;

  // Returns important conclusions of the simulation
  abstract getSimulationResult(): any;

  // Simulates a day and runs tick function every minute
  simulateDay(): void {
    for (let minute = 0; minute < this.time; minute++) {
      // console.log(`--- Start Minute ${minute} ---`);
      this.currentMinuteOfDay = minute;
      this.tick();
      // console.log(`--- End Minute ${minute} ---`);
    }
  }
}

// Implement CallCenterSimulation
class CallCenterSimulation extends DayByMinuteSimulation {
  scenario: Scenario;
  waitingAgents: Agent[];
  runningAgents: Agent[];
  incomingCalls: Call[];
  attendedCalls: Call[];

  constructor(blackFridayScenario: Scenario, agents: Agent[]) {
    super();
    this.scenario = blackFridayScenario;
    this.waitingAgents = agents;
    this.runningAgents = [];
    this.incomingCalls = [];
    this.attendedCalls = [];
  }

  findMoment = () => {
    return this.scenario.find(
      (timeFrame) =>
        timeFrame.start <= this.currentMinuteOfDay &&
        timeFrame.end >= this.currentMinuteOfDay
    );
  };

  createCall(): Call {
    const duration: number = getRandomNumberBetween(1, 5);
    const createdAt: number = this.currentMinuteOfDay;
    const call = new Call(createdAt, duration);
    return call;
  }

  hangUpCall = (agent: Agent): void => {
    this.runningAgents = this.runningAgents.filter(
      (agentToRemove) => agentToRemove !== agent
    );

    this.waitingAgents.push(agent);
    if (this.currentMinuteOfDay < this.time) {
      this.manageCall();
    }
  };

  queueIncomingCalls = (totalCalls: number) => {
    [...Array(totalCalls)].forEach(() => {
      const call = this.createCall();
      this.incomingCalls.push(call);
    });
  };

  areWaitingAgents = (): boolean => this.waitingAgents.length > 0;
  areIncomingCalls = (): boolean => this.incomingCalls.length > 0;
  dayHasFinished = (): boolean => this.currentMinuteOfDay > this.time;

  canManageCall = (): boolean =>
    !this.dayHasFinished() &&
    this.areWaitingAgents() &&
    this.areIncomingCalls();

  manageCall = (): void => {
    if (this.canManageCall()) {
      const agent: Agent | undefined = this.waitingAgents.shift();
      const call: Call | undefined = this.incomingCalls.shift();

      if (call && agent) {
        this.runningAgents.push(agent);
        this.attendedCalls.push(call);
        agent.attendCall(call, this);
      }
    }
  };

  tick(): void {
    const { callsPerMinute } = this.findMoment();

    this.queueIncomingCalls(callsPerMinute);

    [...Array(callsPerMinute)].forEach(() => this.manageCall());
  }

  remainingCalls = () => {
    return this.incomingCalls.length;
  };

  finishedCallsByAgent = () => {
    const result: number[] = [];

    this.waitingAgents.forEach((agent) => result.push(agent.calls.length));
    this.runningAgents.forEach((agent) => result.push(agent.calls.length));

    return result;
  };

  finishedCalls = () => {
    return this.finishedCallsByAgent().reduce(
      (total: number, callByAgent: number) => {
        return (total += callByAgent);
      },
      0
    );
  };

  averageWaitingTime = () => {
    // This does not include not attended calls

    const waitingTimes: number[] = [];

    for (let index = 0; index < this.attendedCalls.length; index++) {
      const attendedCall = this.attendedCalls[index];
      waitingTimes.push(attendedCall.waitingTime);
    }

    return getAverage(waitingTimes);
  };

  getSimulationResult() {
    console.log("Remaining calls:", this.remainingCalls());
    console.log("Finished calls by agent", this.finishedCallsByAgent());
    console.log("Finished calls", this.finishedCalls());
    console.log("Average waiting time", this.averageWaitingTime());
  }
}

export default CallCenterSimulation;
