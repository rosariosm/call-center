import { Agent } from "./Agent";
import { Call } from "./Call";
import { getRandomNumberBetween } from "./utils";

type ScenarioRangeCondition = {
  start: number; // Minute of day that the condition applies
  end: number; // Minute of day where the condition stops applying
  callsPerMinute: number;
};

export type Scenario = ScenarioRangeCondition[];

abstract class DayByMinuteSimulation {
  currentMinuteOfDay: number;

  constructor(
    // Current minute of the current day
    currentMinuteOfDay: number = 0
  ) {
    this.currentMinuteOfDay = currentMinuteOfDay;
  }

  // Runs every minute, should have simulation logic
  abstract tick(): void;

  // Returns important conclusions of the simulation
  abstract getSimulationResult(): any;

  // Simulates a day and runs tick function every minute
  simulateDay(): void {
    const time = 60 * 24; // minutes in a day
    for (let minute = 0; minute < time; minute++) {
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

  constructor(blackFridayScenario: Scenario, agents: Agent[]) {
    super();
    this.scenario = blackFridayScenario;
    this.incomingCalls = [];
    this.waitingAgents = agents;
    this.runningAgents = [];
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
  };

  queueIncomingCalls = (totalCalls: number) =>
    new Array(totalCalls).forEach(() => {
      const call = this.createCall();
      this.incomingCalls.push(call);
    });

  areWaitingAgents = (): boolean => this.waitingAgents.length > 0;
  areIncomingCalls = (): boolean => this.incomingCalls.length > 0;

  manageCall = (): void => {
    if (this.areWaitingAgents() && this.areIncomingCalls()) {
      const agent: Agent | undefined = this.waitingAgents.shift();
      const call: Call | undefined = this.incomingCalls.shift();

      // I am checking this earlier but linter doesn't like it

      if (call && agent) {
        this.runningAgents.push(agent);
        agent.attendCall(call, this);
      }
    }
  };

  tick(): void {
    const { callsPerMinute } = this.findMoment();

    this.queueIncomingCalls(callsPerMinute);
    new Array(callsPerMinute).forEach(() => this.manageCall());
  }

  remainingCalls = () => {
    return this.incomingCalls.length;
  };

  finishedCallsByAgent = () => {
    const result = [];

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
    //const result = [];
//
    //this.waitingAgents.forEach((agent) => result.push(agent.calls.length));
    //this.runningAgents.forEach((agent) => result.push(agent.calls.length));
  }

  getSimulationResult() {
    const remainingCalls = this.remainingCalls(); // Remaining calls at the end of the day
    //const finishedCallsByAgent = this.finishedCallsByAgent(); // Finished calls grouped by Agent
    //const finishedCalls = this.finishedCalls(); //Finished calls
    //const averageWaitingTime = this.averageWaitingTime(); //  Avarage call waiting time
    throw new Error("Implement method");
  }
}

export default CallCenterSimulation;
