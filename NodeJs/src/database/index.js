import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://apinode:FAiAsafHHacbYBso@dbapinode-shard-00-00-jdw1t.mongodb.net:27017,dbapinode-shard-00-01-jdw1t.mongodb.net:27017,dbapinode-shard-00-02-jdw1t.mongodb.net:27017/apinode?ssl=true&replicaSet=DBApiNode-shard-0&authSource=admin&retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
