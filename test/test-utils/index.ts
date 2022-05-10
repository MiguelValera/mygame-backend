import { buildLogger } from '../../src/logger';

export function buildLoggerMock() {
    return buildLogger({ enabled: false, level: 'info' });
}
