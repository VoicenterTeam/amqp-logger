let Logger = require('./Logger');

module.exports = {
  fastify: (config) => {
    let l = Logger(config);
    let instance = {};
    Object.getOwnPropertyNames(config.meth_dict)
      .map((item) => {
        instance[item] = (message) => {
          l.log(config.meth_dict[item], {"Title": item, "Message": message});
        }
      });
    return instance;
  },
  pastash: (config) => {
    let l = Logger(config);
    let instance = {};
    Object.getOwnPropertyNames(config.meth_dict)
      .map((item) => {
        instance[item] = (message) => {
          l.log(config.meth_dict[item], {"Title": item, "Message": message});
        }
      });
    return instance;
  }
};