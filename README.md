# amqp-logger

Logger which should not kill process on channel fail

```js
let logConfig = {
  "log_amqp": {
    "proto": "amqp",
    "host": "127.0.0.1",
    "port": "5672",
    "vhost": "/",
    "user": "log_test",
    "password": "log_test",
    "exchange": "logger",
    "retry": "10",
    "timeout": "1000",
    "exchangeType": "",
    "key": "?"
  },
  "pattern": {
    "DateTime": "",
    "Title": "",
    "Message": "",
    "LoggerSpecificData": "localhost",
    "LogSpecificData": "ThisLogType"
  },
  "log_lvl": 3
};

let logger = require('@voicenter-team/amqp-logger')(logConfig);

setInterval(() => {
  console.log('log')
  logger.log(1, {Title: "Test", Message: "This is a test message"});
}, 3000);
```
