let _logger = false;

class Logger {

  constructor(config) {
    this.lvl = config.log_lvl;
    this.self_lvl = config.self_log_lvl;
    this.pattern = config.pattern;
    this.channel = new (require('@voicenter-team/failover-amqp-pool'))(config.log_amqp);
    this.channel.start();
  }

  log(lvl, message) {
    let date = new Date().toISOString();
    if (lvl <= this.self_lvl && typeof message === 'object') {
      let _message = JSON.stringify(Object.assign({}, this.pattern, { DateTime: date }, message));
      console.log(_message);
    }
    if (this.channel && lvl <= this.lvl && typeof message === 'object') {
      let _message = JSON.stringify(Object.assign({}, this.pattern, { DateTime: date }, message));
      this.channel.publish(_message);
    }
  }
}

module.exports = function (config) {
  if (_logger instanceof Logger) {
    return _logger;
  }
  if (config) {
    _logger = new Logger(config);
    return _logger;
  }
  throw new Error("No logger configuration provided");
};