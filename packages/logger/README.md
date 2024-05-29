# @wing-uni/logger

```ts
import UniLogger from '@wing-uni/logger';

const logger = UniLogger.getLogger('USER_MODULE');

setTimeout(() => {
  logger.log('setTimeout');
}, 200);

for (let i = 0; i < 10; i++) {
  logger.log(`For-Loop ${i}`);
}

logger.log('For-Loop End');
```
