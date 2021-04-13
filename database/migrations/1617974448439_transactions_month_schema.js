'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionsMonthSchema extends Schema {
  up () {
    this.table('transactions_months', (table) => {
      // alter table
      // alter table
      table.bigInteger("user_id")
    })
  }

  down () {
    this.table('transactions_months', (table) => {
      // reverse alternations
      table.dropColumn('user_id')
    })
  }
}

module.exports = TransactionsMonthSchema
