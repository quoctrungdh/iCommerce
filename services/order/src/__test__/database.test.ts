import db from '../helpers/db';
import mongoose from 'mongoose';

jest.mock('mongoose');

describe('Database test', () => {
  test('mongoose connected', async () => {
    jest.setTimeout(15000);
    await db();
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });
});
