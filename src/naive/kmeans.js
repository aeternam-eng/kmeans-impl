// https://www.geeksforgeeks.org/k-means-clustering-introduction/

const calculateEuclideanDistance = (first, second) => {
  const subtractedCoordinates = first.map((x, index) => x - second[index]);
  return Math.hypot(...subtractedCoordinates);
};

const getRandomInt = (max) => Math.floor(Math.random() * max);

export const standard = (cities, k = 1) => {
  const clusters = Array.from({ length: k }).reduce(
    (resultingClusters, _, index) => {
      const filteredCities = cities.filter(
        (city) =>
          !resultingClusters.some((c) => calculateEuclideanDistance(c.center, city.location) === 0)
      );

      return [
        ...resultingClusters,
        {
          id: index,
          center:
            filteredCities[getRandomInt(filteredCities.length - 1)].location,
        },
      ];
    },
    []
  );

  const citiesPerCluster = clusters.reduce(
    (dict, currentCluster) => ({
      ...dict,
      [currentCluster.id]: [],
    }),
    {}
  );

  const assignItemsToCluster = () => {
    cities.forEach((city) => {
      const closestClusterId = clusters.reduce(
        (previousClosestCluster, currentCluster) => {
          const currentClosestDistance = calculateEuclideanDistance(
            city.location,
            previousClosestCluster.center
          );
          const currentDistance = calculateEuclideanDistance(
            city.location,
            currentCluster.center
          );

          return currentDistance < currentClosestDistance
            ? currentCluster
            : previousClosestCluster;
        },
        clusters[0]
      ).id;

      citiesPerCluster[closestClusterId].push(city);
    });
  };

  const calculateClusterMeanCenter = () => {
    const areClustersDone = clusters.map((cluster) => {
      const clusterCities = citiesPerCluster[cluster.id];
      const cityCoordinates = clusterCities.map((cc) => cc.location);

      const coordinateAggregate = cityCoordinates
        .slice(1)
        .reduce(
          (currentAggregate, coordinates) =>
            coordinates.map((c, index) => c + currentAggregate[index]),
          cityCoordinates[0]
        );

      const meanPoint = coordinateAggregate.map((ca) =>
        Math.floor(ca / clusterCities.length)
      );

      const isClusterMeanEqualToMean = cluster.center.reduce(
        (current, coordinate, index) =>
          current && Math.round(coordinate) === Math.round(meanPoint[index]),
        true
      );

      if (!isClusterMeanEqualToMean) {
        citiesPerCluster[cluster.id] = [];
        cluster.center = meanPoint;
      }

      return isClusterMeanEqualToMean;
    });

    return areClustersDone.every((b) => b);
  };

  let iterationsToConverge = 0;

  while (true) {
    iterationsToConverge++;
    assignItemsToCluster();
    if (calculateClusterMeanCenter()) break;
  }

  return {
    iterations: iterationsToConverge,
    clusters: clusters.map((c) => ({
      id: c.id,
      center: c.center,
      cities: citiesPerCluster[c.id],
    })),
  };
};
