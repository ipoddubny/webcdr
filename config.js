var config = {
  db: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '123321',
      database: 'asteriskcdrdb',
      charset: 'utf8'
    }
  },
  sessionKey: '123hjhfds7&&&kjfh&&&788',
  sessionDatabase: '/tmp/webcdr_sessions.db'
};

module.exports = config;
