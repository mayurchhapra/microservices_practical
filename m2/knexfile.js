// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host : process.env.HOST || 'dev-postgres',
      user : process.env.USER || 'postgres',
      password : process.env.PASSWORD ||'toortoor',
      database : process.env.DATABASE || 'postgres',
      charset: 'utf8'
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    }
  }

};
