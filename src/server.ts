import fastify, {
    FastifyInstance,
} from 'fastify';
import type { Logger } from 'pino';
import { NOSQL_DB } from './databases/mongo-db';
import fastifyCors from 'fastify-cors';
import fastifyhelmet from 'fastify-helmet';
import { buildUploadPlugin } from './plugins/upload-time';

export type TestBody = {
    myImage: string;
};

export type ServerDeps = {
    logger: Logger;
    dbNoSql: NOSQL_DB;
};

export function buildServer({ logger, dbNoSql }: ServerDeps): FastifyInstance {
    
    const server = fastify({ logger });

    server.register(fastifyhelmet, {
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false
    });
   
    server.register(fastifyCors, {
        origin: '*',
        methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
        preflight: true,
        allowedHeaders: ['Content-Type', 'Accept', 'Description', 'Authorization']
    });

//<----------------Our plugins---------------------->
    server.register(buildUploadPlugin(dbNoSql));
//<----------------Our plugins---------------------->

    return server;
}



