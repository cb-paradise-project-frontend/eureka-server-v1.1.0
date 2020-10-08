const Task = require('../models/Task');
const User = require('../models/User');
const toObjectId = require('./toObjectId');

const testData = {
  title: 'Roof repair',
  status: 'OPEN',
  budget: '120',
  postedBy: "5f7e816e2ae95e573c9d0814",
  location: 'Kurunjang VIC 3337, Australia',
  dueDate: "Wed Sep 30 2020 21:34:17 GMT+1000 (Australian Eastern Standard Time)",
  description: `-remove existing bamboo fence - supply and install new fence (open for ideas)
  - install synthetic turf
  - landscaping design and install
  - remove and upgrade existing waterfall feature into the pool`,
};

function createDataArray(size, data=testData) {
  const dataArraySize = Math.max(size, 4);

  const dataArray = [];

  for (let i = 0; i < dataArraySize; i += 1) {
    const newData = { ...data };
    dataArray.push(newData);
  }

  dataArray[1].title = 'Wall repair';
  dataArray[1].status = 'ASSIGNED';
  dataArray[2].status = 'COMPLETED';
  dataArray[3].status = 'EXPIRED';

  return dataArray;
}

module.exports = async function createTaskData(size) {
  const dataArray = createDataArray(size);

  await dataArray.map(async (data) => {
    const task = new Task({ ...data });
    await task.save();

    const user = await User.findByIdAndUpdate(
      toObjectId(task.postedBy),
      {
        $push: {
          postedTasks: task._id
        }
      }
      ).exec();
  });
}