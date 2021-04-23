# amqp-logger

Logger which should not kill process on channel fail

```js
let logConfig = {
    "log_amqp": [
      {
        "connection": {
          "host": "127.0.0.1",
          "port": 5672,
          "ssl": false,
          "username": "user",
          "password": "password",
          "vhost": "/",
          "heartbeat": 5
        },
        "channel": {
          "directives": "ae",
          "exchange_name": "TestE",
          "exchange_type": "fanout",
          "exchange_durable": true,
          "topic": "",
          "options": {}
        }
      },
      {
        "connection": {
          "host": "127.0.0.1",
          "port": 5672,
          "ssl": false,
          "username": "test",
          "password": "password",
          "vhost": "/",
          "heartbeat": 5
        },
        "channel": {
          "directives": "ae",
          "exchange_name": "TestExchange",
          "exchange_type": "fanout",
          "exchange_durable": true,
          "topic": "",
          "options": {}
        }
      },
      {
        "connection": {
          "host": "127.0.0.1",
          "port": 5672,
          "ssl": false,
          "username": "test",
          "password": "password",
          "vhost": "/",
          "heartbeat": 5
        },
        "channel": {
          "directives": "ae",
          "exchange_name": "TestExchange1",
          "exchange_type": "fanout",
          "exchange_durable": true,
          "topic": "",
          "options": {}
        }
      },
      {
        "connection": {
          "host": "127.0.0.1",
          "port": 5672,
          "ssl": false,
          "username": "test",
          "password": "password",
          "vhost": "/",
          "heartbeat": 5
        },
        "channel": {
          "directives": "ae",
          "exchange_name": "TestExchange2",
          "exchange_type": "fanout",
          "exchange_durable": true,
          "topic": "",
          "options": {}
        }
      }
    ],
    "pattern": {
        "DateTime": "",
        "Title": "",
        "Message": "",
        "LoggerSpecificData": "localhost",
        "LogSpecificData": "ThisLogType"
    },
    "meth_dict": {
        "fatal": 0,
        "error": 1,
        "warn": 2,
        "info": 3,
        "debug": 4,
        "trace": 5
    },
    "log_lvl": 3,
    "self_log_lvl": 3
};

let logger = require('./index').pastash(logConfig);

setInterval(() => {
    logger.fatal("Hello!!!");
    logger.fatal({Data: "test"});
    logger.fatal({Message: "Hello!!!", Data: "test"});
}, 3000);
```
