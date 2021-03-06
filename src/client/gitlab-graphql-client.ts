import fetch from 'node-fetch';
import { waitUntil, BotLogger } from '../basic/utils';

export interface ClientOption {
  host: string;
  token: string;
  logger?: BotLogger;
  maxConcurrentReqNumber?: number;
  maxRetryTimes?: number;
}

export class GitlabGraphqlClient {
  private host: string;
  private token: string;
  private logger: BotLogger = console;
  private maxConcurrentReqNumber: number = 10;
  private concurrentReqNumber: number;
  private maxRetryTimes = 10;
  private filterStatusCode: number[] = [400, 401, 403, 404, 443];

  constructor(options: ClientOption) {
    this.host = options.host;
    this.token = options.token;
    this.concurrentReqNumber = 0;
    if (options.logger) {
      this.logger = options.logger;
    }
    if (options.maxConcurrentReqNumber) {
      this.maxConcurrentReqNumber = options.maxConcurrentReqNumber;
    }
    if (options.maxRetryTimes) {
      this.maxRetryTimes = options.maxRetryTimes;
    }
  }

  public async query<T>(_query: string, _param: T): Promise<string> {
    await waitUntil(() => {
      if (this.concurrentReqNumber >= this.maxConcurrentReqNumber) {
        return false;
      } else {
        this.concurrentReqNumber += 1;
        return true;
      }
    });
    return this.internalQuery(_query, _param, 0);
  }

  private async internalQuery<T>(
    _query: string,
    _param: T,
    retryTimes: number,
  ): Promise<string> {
    try {
      this.logger.info('send request: ', _query);
      const response = await fetch(`${this.host}/api/graphql`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: _query,
          variables: _param,
        }),
      });
      if (response.ok) {
        this.concurrentReqNumber -= 1;
        return response.text();
      }
      if (
        !this.filterStatusCode.includes(response.status) &&
        retryTimes < this.maxRetryTimes
      ) {
        return this.internalQuery(_query, _param, retryTimes + 1);
      }
    } catch (e) {
      this.logger.error(e.message);
      this.logger.info('retryTimes =', retryTimes);
      if (e.message.includes('ETIMEDOUT') || e.message.includes('ECONNRESET')) {
        if (retryTimes < this.maxRetryTimes) {
          return this.internalQuery(_query, _param, retryTimes + 1);
        } else {
          this.concurrentReqNumber -= 1;
          return '{}';
        }
      }
    }
    this.concurrentReqNumber -= 1;
    return '{}';
  }
}
