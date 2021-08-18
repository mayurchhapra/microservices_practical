// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host : process.env.HOST || '127.0.0.1',
      user : process.env.USER || 'postgres',
      password : process.env.PASSWORD ||'toortoor',
      database : process.env.DATABASE || 'postgres',
      charset: 'utf8'
    }
  }

};
