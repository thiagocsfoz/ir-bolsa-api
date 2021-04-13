'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionsInsertUserSchema extends Schema {
  up () {
    this.table('transactions', (table) => {
      // alter table
      table.bigInteger("user_id")
    })
  }

  down () {
    this.table('transactions', (table) => {
      // reverse alternations
      table.dropColumn('user_id')
    })
  }
}

module.exports = TransactionsInsertUserSchema
