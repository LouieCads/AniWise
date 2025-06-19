// In-memory database for farm data (replace with real database in production)
let farms = [];

const findFarmById = (id) => {
  return farms.find((farm) => farm.id === id);
};

const findFarmByUserId = (userId) => {
  return farms.find((farm) => farm.userId === userId);
};

const findFarmByLocation = (latitude, longitude) => {
  return farms.find(
    (farm) =>
      farm.coordinates.latitude === latitude &&
      farm.coordinates.longitude === longitude
  );
};

const createFarm = (farmData) => {
  const newFarm = {
    id: farms.length + 1,
    ...farmData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  farms.push(newFarm);
  return newFarm;
};

const updateFarm = (id, updateData) => {
  const farmIndex = farms.findIndex((farm) => farm.id === id);
  if (farmIndex === -1) {
    return null;
  }

  farms[farmIndex] = {
    ...farms[farmIndex],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  return farms[farmIndex];
};

const deleteFarm = (id) => {
  const farmIndex = farms.findIndex((farm) => farm.id === id);
  if (farmIndex === -1) {
    return false;
  }

  farms.splice(farmIndex, 1);
  return true;
};

const getAllFarms = () => {
  return farms;
};

const getFarmCount = () => farms.length;

const getFarmsByUserId = (userId) => {
  return farms.filter((farm) => farm.userId === userId);
};

module.exports = {
  findFarmById,
  findFarmByUserId,
  findFarmByLocation,
  createFarm,
  updateFarm,
  deleteFarm,
  getAllFarms,
  getFarmCount,
  getFarmsByUserId,
};
