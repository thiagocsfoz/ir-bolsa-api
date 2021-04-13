'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TransactionMonth extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }

  updateValues(result, irrf) {
    this.result = this.result + result;
    this.irrf = this.irrf + irrf;

    this.impaired_injury_next_month = (this.impaired_injury + this.result) >= 0.0 ? 0.0 : this.impaired_injury + this.result
    this.irrf_next_month = this.impaired_injury_next_month !== 0.0 ? this.impaired_irrf + this.irrf : 0.0;
    this.value_darf = this.impaired_injury_next_month === 0.0 ? ((this.result - this.impaired_injury)*0.2)-(this.impaired_irrf+this.irrf) : 0.0
  }

  static async impairedInjuryByMonth(month, year, userId, currentMonth, currentYear) {
    const transactionMonths = await this.getLastMonth(month, year, userId, currentMonth, currentYear)

    return transactionMonths != null ? transactionMonths.impaired_injury_next_month : 0.0;
  }

  static async impairedIrrfByMonth(month, year, userId, currentMonth, currentYear) {
    const transactionMonths = await this.getLastMonth(month, year, userId, currentMonth, currentYear)

    return transactionMonths != null ? transactionMonths.irrf_next_month : 0.0;
  }

  static async darfLessTenByMonth(month, year, userId, currentMonth, currentYear) {
    const transactionMonths = await this.getLastMonth(month, year, userId, currentMonth, currentYear)

    return transactionMonths != null && transactionMonths.value_darf < 10.00 ? transactionMonths.value_darf : 0.0;
  }

  static async getLastMonth(month, year, userId, currentMonth, currentYear) {
    console.log("getLastMonth: "+ month + " " + year + " " + userId)

    const totalRows = await this
      .query()
      .where("user_id", userId)
      .where("month", "<", currentMonth )
      .where("year", "<=", currentYear)
      .count();

    if(totalRows[0].count === '0') {
      console.log("user without transaction month")
      return null;
    }

    const transactionMonth = await this
      .query()
      .where('user_id', userId)
      .where('month', month)
      .where('year', year)
      .first();

    if(typeof transactionMonth == "undefined" || transactionMonth === null) {
      if(month === 1) {
        month = 12;
        year--;
      } else {
        month--;
      }

      await this.getLastMonth(month, year, userId);
    } else {
      return transactionMonth;
    }
  }
}

module.exports = TransactionMonth
