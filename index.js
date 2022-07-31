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
    _config = (!_config) ? config : _mergeDeep(_config, config);
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
  pastash: (config = {}) => {
    _config = (!_config) ? config : _mergeDeep(_config, config);
    let l = Logger(_config);
    let instance = {};
    Object.getOwnPropertyNames(_config.meth_dict)
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
          l.log(_config.meth_dict[item], _m);
        }
      });
    return instance;
  },
  winstonTransport: () => {
    const Transport = require('winston-transport');
    class AmqpPoolTransport extends Transport {
      constructor(opts) {
        super(opts.winstonConfig);
        console.log(opts)
        _config = (!_config) ? opts.amqp : _mergeDeep(_config, opts.amqp);
        this.l = Logger(_config);
      }
      log(info, callback) {
        // do whatever you want with log data
        this.l.log(info.level, info.message);
        callback();
      }
    }

    return AmqpPoolTransport;
  }
};