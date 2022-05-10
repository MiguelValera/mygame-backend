import { buildMongoDatabase } from '../src/databases/mongo-db';
import { buildConfig } from '../src/config';
import { Collection } from 'mongodb';

describe('MongoDB should', () => {
    const config = buildConfig();
    const mongoDb = buildMongoDatabase(config.mongo);
    let collection: Collection;
    beforeEach(async () => {
        await mongoDb.init();
        collection = mongoDb.getDatabase().collection('test');
    });

    afterEach(async () => {
        await collection.drop();
        await mongoDb.close();
    });

    it('find documents', async () => {
        await collection.insertMany([
            { name: 'Juanjo', age: 42, city: 'Murcia', color: 'blue' },
            {
                name: 'Antonio',
                age: 14,
                city: 'Alicante',
                color: 'green'
            },
            {
                name: 'Laura',
                age: 38,
                city: 'Murcia',
                color: 'yellow'
            },
            {
                name: 'Pablo',
                age: 34,
                city: 'Murcia',
                color: 'pink'
            }
        ]);

        const document = await collection.find({ city: 'Murcia' }).toArray();
        expect(document.length).toEqual(3);

        const document2 = await collection.find({ city: 'Alicante' }).toArray();
        expect(document2.length).toEqual(1);

        const document3 = await collection
            .find({ age: { $gte: 18 } })
            .toArray();
        expect(document3.length).toEqual(3);

        const document4 = await collection
            .find({ color: { $in: ['blue', 'pink'] } })
            .toArray();
        expect(document4.length).toEqual(2);
    });

    it('insert one document and retrieve by id', async () => {
        const result = await collection.insertOne({
            message: 'Hello',
            from: 'Juanjo'
        });

        expect(result.acknowledged).toEqual(true);
        expect(result.insertedId).toEqual(expect.anything());

        const document = await collection.findOne({ _id: result.insertedId });
        expect(document).toEqual({
            _id: expect.anything(),
            from: 'Juanjo',
            message: 'Hello'
        });
    });

    it('insert a few documents and count its', async () => {
        const items = Array.from({ length: 20 }, (_, index) => ({
            item: `Item ${index}`
        }));
        await collection.insertMany(items);

        const document = await collection.countDocuments();
        expect(document).toEqual(20);
    });

    it('update one document', async () => {
        await collection.insertOne({ name: 'Juanjo', age: 18 });
        const documentBefore = await collection.findOne({ name: 'Juanjo' });
        expect(documentBefore!.age).toEqual(18);

        await collection.updateOne({ name: 'Juanjo' }, { $set: { age: 42 } });

        const document = await collection.findOne({ name: 'Juanjo' });
        expect(document!.age).toEqual(42);
    });

    it('update one document', async () => {
        await collection.insertOne({ name: 'Juanjo', age: 18 });
        const documentBefore = await collection.findOne({ name: 'Juanjo' });
        expect(documentBefore!.age).toEqual(18);

        await collection.updateOne({ name: 'Juanjo' }, { $inc: { age: 2 } });

        const document = await collection.findOne({ name: 'Juanjo' });
        expect(document!.age).toEqual(20);
    });

    it('update a few documents', async () => {
        await collection.insertMany([
            { name: 'Juanjo', age: 18 },
            { name: 'Juanjo', age: 20 },
            { name: 'Juanjo', age: 22 }
        ]);

        await collection.updateMany({ name: 'Juanjo' }, { $inc: { age: 2 } });

        const document = await collection.find({ name: 'Juanjo' }).toArray();
        expect(document[0].age).toEqual(20);
        expect(document[1].age).toEqual(22);
        expect(document[2].age).toEqual(24);
    });

    it('delete a few documents', async () => {
        await collection.insertMany([
            { name: 'Juanjo', age: 18 },
            { name: 'Juanjo', age: 20 },
            { name: 'Juanjo', age: 22 },
            { name: 'Pepe', age: 22 }
        ]);

        await collection.deleteMany({ age: 22 });

        const document = await collection.find({ name: 'Juanjo' }).toArray();
        expect(document[0].age).toEqual(18);
        expect(document[1].age).toEqual(20);
        expect(document.length).toEqual(2);
    });

    it('delete one document by id', async () => {
        const result = await collection.insertOne({
            message: 'Hello',
            from: 'Juanjo'
        });

        await collection.deleteOne({ _id: result.insertedId });

        expect(await collection.countDocuments()).toBe(0);
    });
});
