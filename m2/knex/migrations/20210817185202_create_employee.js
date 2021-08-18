
exports.up = function(knex) {
  return knex.schema.createTable('employee', (t) => {
    t.tinyint('id').unsigned().primary();
    t.text('name').notNull();
    t.text('contact').notNull();
    t.text('email').notNull().index().unique();
    t.text('company').notNull().index();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('employee');
};
