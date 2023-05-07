// Cluster:
// {
//     id: number;
//     center: Coordinate;
//     cities: City[];
// }

const calculateEuclideanDistance = (first, second) => {
  const subtractedCoordinates = first.map((x, index) => x - second[index]);
  return Math.hypot(...subtractedCoordinates);
};

export const mse = (clusterOutput) => {
  return clusterOutput.reduce(
    (error, cluster) =>
      error + cluster.cities.reduce((acc, city) => acc + Math.pow(calculateEuclideanDistance(city.location, cluster.center), 2), 0),
    0
  );
};
