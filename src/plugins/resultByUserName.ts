import { NOSQL_DB } from '../databases/mongo-db';
import {
    FastifyInstance,
    FastifyRegisterOptions,
} from 'fastify';
type Simple = {
    image: string | URL,
    name: string,
    username: string
    safe: {
        adult:  string;
        spoof: string;
        medical: string;
        violence: string;
        racy: string;
    }
}

export function buildResultByUseramePlugin(dbNoSql: NOSQL_DB){
      
    return async function resultByUsernamePlugin(server:FastifyInstance, opts:FastifyRegisterOptions<Record<string,unknown>>, next: () => void) {
        server.get('/resultbyusername/:username', async (req, reply) => {

            const username = (req.params as any).username as string;
            const myMongo = await dbNoSql.getCollection().find({userName: username}).toArray();
            const simplified: Simple[] = [];
            myMongo.map( async elem => {
                simplified.push({
                    image: elem.path.substring(10),
                    name: elem.expName,
                    username: elem.userName,
                    safe: elem.safeSearch
                })
            })
            reply
                .status(200)
                .headers({ 'content-type': 'application/json' })
                .send(simplified);
        });
        next();
    };
}