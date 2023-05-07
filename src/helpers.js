import fs from "fs";
import argv from 'process';
import { plot } from "nodeplotlib";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { mse } from "./mse.js";

export const plotClusterResults = (label, clusters) => {
  const plotData = clusters.flatMap((cluster) => [
    {
      x: cluster.cities.map((c) => c.location[0] / 10000),
      y: cluster.cities.map((c) => c.location[1] / 10000),
      type: "scatter",
      mode: "markers",
      name: `Cluster ${cluster.id} cities`,
      marker: {
        opacity: 0.4,
      },
    },
    {
      x: [cluster.center[0] / 10000],
      y: [cluster.center[1] / 10000],
      text: ["Centroid"],
      type: "scatter",
      mode: "markers",
      marker: {
        size: 20,
        symbol: "diamond",
        line: {
          width: 2,
        },
      },
      name: `Cluster ${cluster.id} centroid`,
    },
  ]);

  const data = plotData;
  const layout = {
    title: label,
    height: 350,
    width: 500,
  };
  const config = { responsive: true };

  plot(data, layout, config);
};

export const executeInCli = (method) => {
  const kArg = parseInt(argv[2]);
  const k = Number.isInteger(kArg) ? kArg : 2;

  const results = executeKmeansMethod(method, k);
  const error = mse(results.clusters);

  console.log('Error value after execution: ', error);
  console.log('Iterations to converge', results.iterations)
  plotClusterResults(`${method.name} | K = ${k}`, results.clusters);
};

const executeKmeansMethod = (method, numberOfClusters) => {
  const datasetPath = resolve(
    fileURLToPath(import.meta.url),
    "../municipiosmg.json"
  );
  const municipiosmg = JSON.parse(fs.readFileSync(datasetPath).toString());

  const cities = municipiosmg.map((m) => ({
    name: m.nome,
    location: [Math.floor(m.longitude * 10000), Math.floor(m.latitude * 10000)],
  }));

  return method(cities, numberOfClusters);
};

export default executeKmeansMethod;
