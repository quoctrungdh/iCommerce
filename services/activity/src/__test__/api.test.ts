import mockingoose from 'mockingoose';
import '../helpers/sinon-mongoose';
import ActivityModel from '../models/activity.model';
import supertest from 'supertest';
import main from '../main';

jest.mock('ts-nats', () => ({
  connect: () => ({
    on: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn(),
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
    type: 'SEARCH',
    data: '{"limit":"10","page":"0","brand":"OOOP","color":"red"}',
    host: 'api.i-commerce.example',
    userAgent: 'PostmanRuntime/7.26.3',
    ip: '10.42.0.69',
    port: '1234',
    prefix: '/oka',
    protocol: 'http',
    createdAt: '2020-08-22T09:23:57.318Z',
  },
  {
    _id: '5f40f1a39be715243a0217b9',
    type: 'VIEW',
    data: '{"limit":"10","page":"0","brand":"OOOP","color":"red"}',
    host: 'api.i-commerce.example',
    userAgent: 'PostmanRuntime/7.26.3',
    ip: '10.42.0.69',
    port: '1234',
    prefix: '/search',
    protocol: 'http',
    createdAt: '2020-08-22T09:23:57.318Z',
  },
  {
    _id: '5f40f1b0f940e4246e0cd0d0',
    type: 'FILTER',
    data: '{"limit":"10","page":"0","brand":"OOOP","color":"red"}',
    host: 'api.i-commerce.example',
    userAgent: 'PostmanRuntime/7.26.3',
    ip: '10.42.0.69',
    port: '1234',
    prefix: '/filter',
    protocol: 'http',
    createdAt: '2020-08-22T09:23:57.318Z',
  },
];

describe('API test', () => {
  afterAll(() => {
    main.close();
  });

  test('GET /', async () => {
    mockingoose(ActivityModel).toReturn(_data, 'find');
    ActivityModel.find().then((doc) => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_data);
    });
    const response = await supertest(main).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();
  });

  test('GET / empty data', async () => {
    mockingoose(ActivityModel).toReturn([], 'find');
    ActivityModel.find().then((doc) => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject([]);
    });
    const response = await supertest(main).get('/');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: [], meta: { page: 0, pageSize: 0 } });
  });

  test('GET /:id', async () => {
    mockingoose(ActivityModel).toReturn(_data[0], 'findOne');
    ActivityModel.findOne({ _id: '5f40f1a39be715243a0217b9' }).then((doc) => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_data[0]);
    });
    const response = await supertest(main).get('/507f191e810c19729de860ea');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(_data[0]);
  });

  test('GET /:id - invalid id', async () => {
    mockingoose(ActivityModel).toReturn(null, 'findOne');
    ActivityModel.findOne().then((doc) => {
      expect(JSON.parse(JSON.stringify(doc))).toBeNull();
    });
    const response = await supertest(main).get('/invalid-id-fake');
    expect(response.status).toEqual(404);
  });

  test('POST /', async () => {
    mockingoose(ActivityModel).toReturn(null, 'save');
    ActivityModel.create().then((doc) => {
      expect(doc).toBeUndefined();
    });
  });

  test('PUT /:id', async () => {
    const output = {
      _id: '5f40f42cf4450c2d61d4aa18',
      type: 'VIEW',
      data: '{"limit":"10","page":"0","brand":"OOOP","color":"red"}',
      host: 'api.i-commerce.example',
      userAgent: 'PostmanRuntime/7.26.3',
      ip: '10.42.0.69',
      port: '1234',
      prefix: '/search',
      protocol: 'http',
      createdAt: new Date('2020-08-22T09:23:57.318Z'),
    };
    mockingoose(ActivityModel).toReturn(output, 'findOneAndUpdate');
    ActivityModel
      .findOneAndUpdate({ _id: '5f40f42cf4450c2d61d4aa18' }, { port: '2345' })
      .exec()
      .then((doc) => {
        expect(doc).toMatchSnapshot();
      });
  });

  test('DELETE /:id', async () => {
    const output = {
      _id: '5f40da5f1fc695c40887b8c1',
      createdAt: new Date('2020-08-22T09:23:57.318Z'),
    };
    mockingoose(ActivityModel).toReturn(output, 'deleteOne');
    ActivityModel
      .deleteOne({ _id: '5f40da5f1fc695c40887b8c1' })
      .exec()
      .then((doc) => {
        expect(doc).toMatchSnapshot();
      });
  });
});
