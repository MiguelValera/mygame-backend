import { NOSQL_DB } from '../databases/mongo-db';
import {
    FastifyInstance,
    FastifyRegisterOptions,
    FastifyReply,
    FastifyRequest,
} from 'fastify';



export function buildUploadPlugin(dbNoSql: NOSQL_DB){

    return async function uploadPlugin(server:FastifyInstance, opts:FastifyRegisterOptions<Record<string,unknown>>, next: () => void) {
     server.route({
            method: 'POST',
            url: '/upload',
            handler: async function (request: FastifyRequest, reply: FastifyReply) {
               let json;
               const username=request.headers.username;
               const time = request.headers.time;
               const level = request.headers.level;
               
               if(username && time && level){
               json = {username: username, levels:[{level:level, time:time}]}
               }
                    reply.header('Access-Control-Allow-Origin', '*');
                    reply
                        .code(201)
                        .headers({ 'content-type': 'application/json' })
                        .send(json);
                
            }
        });
      next();
    };
}
