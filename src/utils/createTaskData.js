const Task = require('../models/Task');

const testData = {
  title: 'Roof repair',
  status: 'OPEN',
  budget: '120',
  postedBy: "5f742e1c1092f55f18a7ac00",
  location: 'Kurunjang VIC 3337, Australia',
  dueDate: "Wed Sep 30 2020 21:34:17 GMT+1000 (Australian Eastern Standard Time)",
  description: `-remove existing bamboo fence - supply and install new fence (open for ideas)
            - install synthetic turf
            - landscaping design and install
            - remove and upgrade existing waterfall feature into the pool`,
};

function createDataArray(size, data=testData) {
  const dataArray = [];
  for (let i = 0; i < size; i += 1) {
    const newData = { ...data };
    dataArray.push(newData);
  }
  return dataArray;
}

module.exports = async function createTaskData(size) {
  const dataArray = createDataArray(size);

  await dataArray.map(async (data) => {
    const task = new Task({ ...data });
    await task.save();
  });
}