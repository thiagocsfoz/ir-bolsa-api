'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionMonthsSchema extends Schema {
  up () {
    this.rename('transactions_months', 'transaction_months')
  }

  down () {
    this.table('transaction_months', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TransactionMonthsSchema
