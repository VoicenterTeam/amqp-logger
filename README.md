# amqp-logger

Logger which should not kill process on channel fail

```js
let logConfig = {
    "log_amqp": [{
        "connection": {
            "host": "192.168.140.111",
            "port": 5672,
            "ssl": false,
            "username": "user",
            "password": "password",
            "vhost": "/",
            "heartbeat": 5
        },
        "channel": {
            "exchange_name": "TestExchange",
            "queue_name": "TestQueue",
            "prefetch": 5,
            "exchange_type": "fanout",
            "topic": "",
            "options": {}
        }
    },   {
        "connection": {
            "host": "192.168.140.112",
            "port": 5672,
            "ssl": false,
            "username": "user",
            "password": "password",
            "vhost": "/",
            "heartbeat": 5
        },
        "channel": {
            "exchange_name": "TestExchange",
            "prefetch": 5,
            "exchange_type": "fanout",
            "topic": "",
            "options": {}
        }
    }],
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

let logger = require('./index').fastify(logConfig);

setInterval(() => {
  console.log('log')
    logger.fatal("Hello!!!");
}, 3000);
```
