import Appender from '@wing-logger/appender';
import Logger from '@wing-logger/logger';
import DateUtil, { DateTimeCategory } from '@wing-tool/date-tool';
import UniFileSystem from '@wing-uni/file-system';

const fileAppender = (subject: string, dir?: string) =>
  new Appender((...values: string[]): Promise<boolean> => {
    const date: Date = new Date();
    const content = `[${DateUtil.format(date)}] [${subject}] ${values.join('')}`;
    dir = dir ?? ['logs', DateUtil.format(date, [DateTimeCategory.YYYY, DateTimeCategory.MM, DateTimeCategory.DD], '')].join('/');
    const filePath = [dir, `${subject}.log`].join('/');
    return new Promise(async (resolve) => {
      const { flag } = await UniFileSystem.writeFile(filePath, content);
      resolve(flag);
    });
  });
const consoleAppender = (subject: string) =>
  new Appender((...values: string[]): Promise<boolean> => {
    const date: Date = new Date();
    const content = `[${DateUtil.format(date)}] [${subject}] ${values}`;
    console.log(content);
    return Promise.resolve(true);
  });
export class UniLogger {
  static getLogger(subject: string, dir?: string): Logger {
    const logger = new Logger(subject);
    logger.addAppenders([consoleAppender(subject), fileAppender(subject, dir)]);
    return logger;
  }
}
export default UniLogger;
