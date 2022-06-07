import CallCenterSimulation, { Scenario } from "./cally";
import { Agent } from "./Agent";

const blackFridayScenario: Scenario = [
  { start: 0, end: 480, callsPerMinute: 5 },
  { start: 481, end: 720, callsPerMinute: 10 },
  { start: 721, end: 900, callsPerMinute: 8 },
  { start: 901, end: 1320, callsPerMinute: 12 },
  { start: 1321, end: 1439, callsPerMinute: 5 },
];

const agents = [...Array(10)].map((e) => new Agent());

const simulation = new CallCenterSimulation(blackFridayScenario, agents); // pass scenario and agents amount
simulation.simulateDay();

// Added this delay to let the simulation attend various calls
setTimeout(() => {
  simulation.getSimulationResult();
}, 5000);
