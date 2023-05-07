// https://www.geeksforgeeks.org/k-means-clustering-introduction/

Array.prototype.maxBy = function (propertySelector) {
  return this.reduce(
    (maximum, currentValue) =>
      propertySelector(currentValue) > propertySelector(maximum)
        ? currentValue
        : maximum,
    this[0]
  );
};

Array.prototype.minBy = function (propertySelector) {
  return this.reduce(
    (minimum, currentValue) =>
      propertySelector(currentValue) < propertySelector(minimum)
        ? currentValue
        : minimum,
    this[0]
  );
};

const calculateEuclideanDistance = (first, second) => {
  const subtractedCoordinates = first.map((x, index) => x - second[index]);
  return Math.hypot(...subtractedCoordinates);
};

const getRandomInt = (max) => Math.floor(Math.random() * max);

const remapRange = (value, inputMin, inputMax, outputMin, outputMax) => {
  return (
    ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) +
    outputMin
  );
};

export const heuristic = (cities, k = 1) => {
  const assignInitialClusters = () =>
    Array.from({ length: k })
      .reduce((resultingClusters, _, index) => {
        const referenceCity =
          index === 0
            ? cities[getRandomInt(cities.length - 1)]
            : resultingClusters[index - 1].center;

        const citiesWithoutReference = cities.filter(
          (city) =>
            !resultingClusters.some((c) => 
              calculateEuclideanDistance(city.location, c.center.location) === 0) 
            && calculateEuclideanDistance(city.location, referenceCity.location) !== 0);

        const citiesWithDistances = citiesWithoutReference.map((city) => ({
          ...city,
          distance: calculateEuclideanDistance(
            city.location,
            referenceCity.location
          ),
        }));

        const minDistance = citiesWithDistances.minBy(
          (city) => city.distance
        ).distance;
        const maxDistance = citiesWithDistances.maxBy(
          (city) => city.distance
        ).distance;

        const weightDistributedCities = citiesWithDistances.reduce(
          (resultingCities, currentCityWithDistance) => {
            const numberOfInstances = remapRange(
              Math.ceil(currentCityWithDistance.distance),
              minDistance,
              maxDistance,
              1,
              40
            );

            const instances = Array.from(
              { length: numberOfInstances },
              () => currentCityWithDistance
            );

            return [...resultingCities, ...instances];
          },
          []
        );

        const selectedCityFromCentroid =
          weightDistributedCities[
            getRandomInt(weightDistributedCities.length - 1)
          ];

        return [
          ...resultingClusters,
          {
            id: index,
            center: selectedCityFromCentroid,
          },
        ];
      }, [])
      .map((cluster) => ({ ...cluster, center: cluster.center.location }));

  const clusters = assignInitialClusters();
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
