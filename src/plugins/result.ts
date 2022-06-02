import { NOSQL_DB } from '../databases/mongo-db';
import {
    FastifyInstance,
    FastifyRegisterOptions,
} from 'fastify';

export function buildresultPlugin(dbNoSql: NOSQL_DB) {

    return async function resultPlugin(server: FastifyInstance, opts: FastifyRegisterOptions<Record<string, unknown>>, next: () => void) {
        server.get('/results', async (req, reply) => {
            const myMongo = await dbNoSql.getCollection().find({}, { projection: { _id: 0 } }).toArray();
            reply
                .status(200)
                .headers({ 'content-type': 'application/json' })
                .send(myMongo);
        });
        next();
    };
}