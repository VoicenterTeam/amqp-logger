let Logger = require('./Logger');
let _config = null;
module.exports = {
  fastify: (config) => {
    if (!_config) {
      _config = config;
    }
    let l = Logger(_config);
    let instance = {};
    Object.getOwnPropertyNames(_config.meth_dict)
      .map((item) => {
        instance[item] = (message) => {
          l.log(_config.meth_dict[item], {"Title": item, "Message": message});
        }
      });
    return instance;
  },
  pastash: (config) => {
    if (!_config) {
      _config = config;
    }
    let l = Logger(_config);
    let instance = {};
    Object.getOwnPropertyNames(_config.meth_dict)
      .map((item) => {
        instance[item] = (message) => {
          let _m = {"Title": item, "LogLevel": _config.meth_dict[item]}
          if (typeof message === "object") {
            if (message.hasOwnProperty('Message')) {
              _m = Object.assign(message, _m);
            } else {
              _m.Message = JSON.stringify(message);
            }
          } else {
            _m.Message = message;
          }
          l.log(_config.meth_dict[item], _m);
        }
      });
    return instance;
  }
};