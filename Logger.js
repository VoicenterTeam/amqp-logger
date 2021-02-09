let _logger = false;

class Logger {
  channel = false;
  retry = 0;
  pattern = {};
  constructor (config) {
    config.log_amqp = Object.assign({
      "proto": "amqp",
      "host": "localhost",
      "port": "5672",
      "vhost": "",
      "user": "",
      "password": "",
      "exchange": "Logger",
      "retry": 0,
      "timeout": 0,
    }, config.log_amqp);

    this.lvl = config.log_lvl;
    this.retry = (!isNaN(parseInt(config.log_amqp.retry))) ? parseInt(config.log_amqp.retry) : 0;
    this.timeout = (!isNaN(parseInt(config.log_amqp.timeout))) ? parseInt(config.log_amqp.timeout) : 0;
    this.exchange = config.log_amqp.exchange;
    this.pattern = (config.hasOwnProperty('pattern') && typeof config.pattern === 'object') ? config.pattern : {};

    let creds = "";
    creds +=  (config.log_amqp.hasOwnProperty('user') && config.log_amqp.user !== "") ? config.log_amqp.user : "";
    creds += (config.log_amqp.hasOwnProperty('password') && config.log_amqp.password !== "") ? `:${config.log_amqp.password}` : "";
    creds += (creds !== "") ? "@" : "";

    let url = `${config.log_amqp.proto}://${creds}` +
      `${config.log_amqp.host}:${config.log_amqp.port}${config.log_amqp.vhost}`;
    this.doConnect(url, config.log_amqp.exchange);
    return this;
  }

  doConnect(url, exchange) {
    return require('amqplib').connect(url)
      .then((conn) => {
        return conn.createChannel();
      })
      .then((ch) => {
        return ch.assertExchange(exchange, 'fanout')
          .then((whatever) => {
            this.channel = ch;
            return true;
          });
      })
      .catch((e) => {
        this.handleError(e);
        if (this.retry !== 0) {
          this.retry--;
          setTimeout(() => {
            console.log("reconnect Logger");
            this.doConnect(url, exchange);
          }, this.timeout);
        } else {
          console.log("Logger can't connect. Giving Up!")
        }
      })
  }

  log (lvl, message) {
    if (this.channel && lvl <= this.lvl && typeof message === 'object') {
      this.channel.publish(this.exchange, '', Buffer.from(JSON.stringify(Object.assign(this.pattern, message))));
    }
  }

  handleError (e) {
    this.channel = false;
    console.log(e);
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