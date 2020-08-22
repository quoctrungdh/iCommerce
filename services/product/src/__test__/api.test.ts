import mockingoose from 'mockingoose';
import '../helpers/sinon-mongoose';
import productModel from '../models/product.model';
import supertest from 'supertest';
import main from '../main';

jest.mock('ts-nats', () => ({
  connect: () => ({
    on: jest.fn(),
    publish: jest.fn(),
  }),
  Payload: {
    JSON: 'json',
  },
}));
jest.mock('winston', () => ({
  format: {
    colorize: jest.fn(),
    combine: jest.fn(),
    label: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    errors: jest.fn(),
  },
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    log: jest.fn(),
    on: jest.fn(),
  }),
  transports: {
    Console: jest.fn(),
  },
}));
jest.mock('fluent-logger', () => ({
  support: {
    winstonTransport: () => jest.fn(),
  },
}));

const _data = [
  {
    _id: '507f191e810c19729de860ea',
    name: 'Macbook Pro 2020',
    price: 20000,
    brand: 'Apple',
    color: 'grey',
    createdAt: '2020-08-22T08:47:38.094Z',
    updatedAt: '2020-08-22T08:47:03.693Z',
  },
  {
    _id: '5f40da4cca1e00c3cd23f1a0',
    name: 'ÁO POLO NAM',
    price: 30000,
    brand: 'OOOP',
    color: 'red',
    createdAt: '2020-08-22T08:47:38.094Z',
    updatedAt: '2020-08-22T08:47:03.693Z',
  },
  {
    _id: '5f40da5f1fc695c40887b8c1',
    name: 'Samsung Galaxy New',
    price: 1000000,
    brand: 'Samsung',
    color: 'navy',
    createdAt: '2020-08-22T08:47:38.094Z',
    updatedAt: '2020-08-22T08:47:03.693Z',
  },
];

describe('API test', () => {
  afterAll(() => {
    main.close();
  });

  test('GET /list', async () => {
    mockingoose(productModel).toReturn(_data, 'find');
    productModel.find().then(doc => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_data);
    });
    const response = await supertest(main).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();
  });

  test('GET / empty data', async () => {
    mockingoose(productModel).toReturn([], 'find');
    productModel.find().then(doc => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject([]);
    });
    const response = await supertest(main).get('/');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: [], meta: { page: 0, pageSize: 0 } });
  });

  test('GET /:id', async () => {
    mockingoose(productModel).toReturn(_data[0], 'findOne');
    productModel.findOne().then(doc => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_data[0]);
    });
    const response = await supertest(main).get('/507f191e810c19729de860ea');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(_data[0]);
  });

  test('GET /:id - invalid id', async () => {
    mockingoose(productModel).toReturn(null, 'findOne');
    productModel.findOne().then(doc => {
      expect(JSON.parse(JSON.stringify(doc))).toBeNull();
    });
    const response = await supertest(main).get('/invalid-id-fake');
    expect(response.status).toEqual(404);
  });

  test('POST /', async () => {
    mockingoose(productModel).toReturn(null, 'save');
    productModel.create().then(doc => {
      expect(doc).toBeUndefined();
    });
  });

  test('PUT /:id', async () => {
    const output = {
      _id: '5f40da5f1fc695c40887b8c1',
      name: 'Samsung Galaxy New',
      price: 5000000,
      brand: 'Samsung',
      color: 'navy',
      inventory: 5,
      createdAt: new Date('2020-08-22T08:47:38.094Z'),
      updatedAt: new Date('2020-08-22T08:47:03.693Z'),
    };
    mockingoose(productModel).toReturn(output, 'findOneAndUpdate');
    productModel.findOneAndUpdate(
      { _id: '5f40da5f1fc695c40887b8c1' },
      { price: 5000000 })
    .exec().then(doc => {
      expect(doc).toMatchSnapshot();
    });
  });

  test('DELETE /:id', async () => {
    const output = {
      _id: '5f40da5f1fc695c40887b8c1',
      createdAt: new Date('2020-08-22T09:23:57.318Z'),
      updatedAt: new Date('2020-08-22T09:23:57.318Z'),
    };
    mockingoose(productModel).toReturn(output, 'deleteOne');
    productModel.deleteOne(
      { _id: '5f40da5f1fc695c40887b8c1' },
    ).exec().then(doc => {
      expect(doc).toMatchSnapshot();
    });
  });
});
