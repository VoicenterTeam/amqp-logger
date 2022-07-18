let Logger = require('./Logger');
let _config = null;

function _mergeDeep(...objects) {
  const isObject = obj => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      }
      else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = _mergeDeep(pVal, oVal);
      }
      else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}

module.exports = {
  fastify: (config = {}) => {
    __config = (!_config) ? config : _mergeDeep(_config, config);
    let l = Logger(_config);
    let instance = {};
    Object.getOwnPropertyNames(__config.meth_dict)
      .map((item) => {
        instance[item] = (message) => {
          l.log(__config.meth_dict[item], {"Title": item, "Message": message});
        }
      });
    return instance;
  },
  pastash: (config = {}) => {
    __config = (!_config) ? config : _mergeDeep(_config, config);
    let l = Logger(_config);
    let instance = {};
    Object.getOwnPropertyNames(__config.meth_dict)
      .map((item) => {
        instance[item] = (message) => {
          let _m = {"Title": item, "LogLevel": item}
          if (typeof message === "object") {
            if (message.hasOwnProperty('Message')) {
              _m = Object.assign(message, _m);
            } else {
              _m.Message = JSON.stringify(message);
            }
          } else {
            _m.Message = message;
          }
          l.log(__config.meth_dict[item], _m);
        }
      });
    return instance;
  }
};