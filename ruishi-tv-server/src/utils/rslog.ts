import { getLogger } from 'log4js';

const rslog = getLogger();
rslog.level = 'all';

// var alogger = log4js.getLogger('category-a')
// alogger.info('hello')
// logger.trace('this is trace')
// logger.debug('this is debug')
// logger.info('this is info')
// logger.warn('this is warn')
// logger.error('this is error')
// logger.fatal('this is fatal')
// logger.mark('this is mark')

export { rslog };
