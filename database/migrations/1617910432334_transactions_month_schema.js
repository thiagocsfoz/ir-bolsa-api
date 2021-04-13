'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionsMonthSchema extends Schema {
  up () {
    this.create('transactions_months', (table) => {
      table.increments()
      table.integer('month')
      table.integer('year')
      table.float('impaired_injury')
      table.float('result')
      table.float('impaired_injury_next_month')
      table.float('impaired_irrf')
      table.float('irrf')
      table.float('irrf_next_month')
      table.float('value_darf')
      table.float('darf_less_ten')
      table.timestamps()
    })
  }

  down () {
    this.drop('transactions_months')
  }
}

module.exports = TransactionsMonthSchema
