var config = {
  // параметры подключения к БД
  db: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '123321',
      database: 'asteriskcdrdb',
      charset: 'utf8'
    },
    pool: {
      min: 1,
      max: 1
    }
  },

  // параметры хранения сессий
  sessionKey: '123hjhfds7&&&kjfh&&&788',
  sessionDatabase: '/tmp/webcdr_sessions.db',

  // часовой пояс дат в базе данных (cdr и другие таблицы)
  tz: '+0400'
};

module.exports = config;
