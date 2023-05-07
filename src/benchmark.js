import { heuristic } from "./heuristic/kmeans.js";
import { standard } from "./naive/kmeans.js";
import { mse } from "./mse.js";
import executeKmeansMethod, { plotClusterResults } from "./helpers.js";

const valuesOfKToTestFor = Array.from({ length: 9 }, (_, index) => index + 2);

const benchmarkKmeansExecution = (method, k) => {
  const label = `${method.name} with k = ${k}`;
  console.log("Starting test: ", label);

  const initialTime = performance.now();

  const clusters = executeKmeansMethod(method, k);
  const error = mse(clusters.clusters);
  const executionTime = performance.now() - initialTime;

  return {
    method: method.name,
    numberOfClusters: k,
    iterations: clusters.iterations,
    clusters: clusters.clusters,
    error,
    executionTime,
  };
};

const executions = [standard, heuristic].map((method) =>
  valuesOfKToTestFor.map((k) => {
    const results = Array.from({ length: 100 }).map((_) =>
      benchmarkKmeansExecution(method, k)
    );
    const aggregate = results.reduce((acc, result) => ({
      ...acc,
      iterations: acc.iterations + result.iterations,
      executionTime: acc.executionTime + result.executionTime,
      error: acc.error + result.error,
    }));

    return {
      ...aggregate,
      iterations: aggregate.iterations / results.length,
      executionTime: aggregate.executionTime / results.length,
      error: aggregate.error / results.length,
    };
  })
);

const comparisons = executions[0].map((standardExecution, index) => {
  const heuristicExecution = executions[1][index];

  return {
    numberOfClusters: standardExecution.numberOfClusters,
    iterationsBefore: standardExecution.iterations,
    iterationsAfter: heuristicExecution.iterations,
    errorBefore: standardExecution.error,
    errorAfter: heuristicExecution.error,
    "errorDifference (%)":
      (heuristicExecution.error / standardExecution.error) * 100 - 100,
    "timeBefore (ms)": standardExecution.executionTime,
    "timeAfter (ms)": heuristicExecution.executionTime,
    "executionTimeDifference (%)":
      (heuristicExecution.executionTime / standardExecution.executionTime) *
        100 -
      100,
  };
});

console.table(comparisons);

executions.flatMap(exec => exec).map(run => plotClusterResults(`${run.method} | K = ${run.numberOfClusters}`, run.clusters));
