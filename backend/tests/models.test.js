const mongoose = require('mongoose');
const Channel = require('../models/Channel');
const User = require('../models/Users');
require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Channel Model Test', () => {
  it('should create a Channel', async () => {
    const channel = new Channel({ name: 'General' });
    const savedChannel = await channel.save();
    expect(savedChannel._id).toBeDefined();
    expect(savedChannel.name).toBe('General');
  });
});

describe('User Model Test', () => {
  it('should create a User', async () => {
    const user = new User({ nickname: 'testuser' });
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.nickname).toBe('testuser');
  });

});