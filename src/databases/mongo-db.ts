import { MongoClient, Db } from 'mongodb';
import { google } from '@google-cloud/vision/build/protos/protos';

export type MongoConfig = {
    host: string;
    port: number;
    database: string;
};
export function buildMongoDatabase({ host, port, database }: MongoConfig) {
    let client: MongoClient;
    let db: Db;
    async function init() {
        const url = `mongodb://mongo:${port}`;
        client = new MongoClient(url);
        await client.connect();
        db = client.db(database);
    }
    

    function getCollection() {
        return db.collection('mygame');
    }

    function getDatabase() {
        return db;
    }

    async function close() {
        await client.close();
    }
    async function AddMongoDb(
        resp: google.cloud.vision.v1.IEntityAnnotation[],
        mongo: NOSQL_DB
    ) {
        await mongo.getCollection().insertOne({ resp });
    }

    return {
        init,
        getDatabase,
        getCollection,
        close, 
        AddMongoDb
    };
}

export type NOSQL_DB = ReturnType<typeof buildMongoDatabase>;
