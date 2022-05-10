const { Model } = require('objection');
const Role = require('./role');

class User extends Model {
  static get tableName() {
    return 'users';
  }

}

module.exports = User;