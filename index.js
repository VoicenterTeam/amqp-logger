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
          let _m = {"Title": item, "LogLevel": config.meth_dict[item]}
          if (typeof message === "object" && message.hasOwnProperty('Message')) {
            _m = Object.assign(message, _m);
          } else {
            _m.Message = message;
          }
          l.log(config.meth_dict[item], _m);
        }
      });
    return instance;
  }
};