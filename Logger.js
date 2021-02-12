let _logger = false;

const logger = require('log4node');

class Logger {
  channel = false;
  retry = 0;
  pattern = {};

  constructor(config) {
    config.log_amqp = Object.assign({
      "proto": "amqp",
      "host": "localhost",
      "port": "5672",
      "vhost": "",
      "user": "",
      "password": "",
      "exchange": "Logger",
      "exchangeType": 'fanout',
      "options": { type: "RecordUploader" },
      "retry": 0,
      "timeout": 0,
      "debug": true,
    }, config.log_amqp);

    this.lvl = config.log_lvl ? config.log_lvl : 5;
    this.retry = (!isNaN(parseInt(config.log_amqp.retry))) ? parseInt(config.log_amqp.retry) : 0;
    this.timeout = (!isNaN(parseInt(config.log_amqp.timeout))) ? parseInt(config.log_amqp.timeout) : 0;
    this.messageTimeout = (!isNaN(parseInt(config.log_amqp.messageTimeout))) ? parseInt(config.log_amqp.messageTimeout) : 0;
    this.exchange = config.log_amqp.exchange;
    this.exchangeType = config.log_amqp.exchangeType;
    this.pattern = (config.hasOwnProperty('pattern') && typeof config.pattern === 'object') ? config.pattern : {};
    this.options = config.log_amqp.options;
    this.topic = '';
    this.debug = config.log_amqp.debug;

    let creds = "";

    creds += (config.log_amqp.hasOwnProperty('user') && config.log_amqp.user !== "") ? config.log_amqp.user : "";
    creds += (config.log_amqp.hasOwnProperty('password') && config.log_amqp.password !== "") ? `:${config.log_amqp.password}` : "";
    creds += (creds !== "") ? "@" : "";

    let url = `${config.log_amqp.proto}://${creds}${config.log_amqp.host}:${config.log_amqp.port}${config.log_amqp.vhost}`;

    this.doConnect(url, this.exchange, this.exchangeType);

    return this;
  }

  doConnect(url, exchange, exchangeType) {
    logger.info(`amqplogger connecting...`);

    return require('amqplib').connect(url)
      .then((conn) => {
        return conn.createChannel();
      })
      .then((ch) => {
        return ch.assertExchange(exchange, exchangeType)
          .then(() => {
            this.channel = ch;

            logger.info(`amqplogger connected.`);

            return true;
          });
      })
      .catch((e) => {
        this.handleError(e);

        if (this.retry !== 0) {
          this.retry--;

          setTimeout(() => {
            logger.info("reconnect Logger");

            this.doConnect(url, exchange);
          }, this.timeout);
        } else {
          logger.error("Logger can't connect. Giving Up!")
        }
      })
  }

  log(lvl, message) {
    let date = new Date().toISOString();

    if (this.channel && lvl <= this.lvl && typeof message === 'object') {
      message = JSON.stringify(Object.assign(this.pattern, { DateTime: date }, message));

      if (this.debug) logger.info(`Sending log message to ${this.exchange}: ${JSON.stringify(message)}`);

      this.channel.publish(this.exchange, this.topic || '', Buffer.from(message), this.options);
    }
  }

  handleError(error) {
    this.channel = false;

    logger.error(error);
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
