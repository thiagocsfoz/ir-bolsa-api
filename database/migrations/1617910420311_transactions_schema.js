'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionsSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments()
      table.string('type')
      table.integer('quantity')
      table.timestamp('date')
      table.float('brokerage')
      table.float('iss')
      table.float('tax_bmf')
      table.float('tax_register_bmf')
      table.float('other_expenditure')
      table.float('irrf')
      table.float('adjustment')
      table.float('result')
      table.timestamps()
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionsSchema
