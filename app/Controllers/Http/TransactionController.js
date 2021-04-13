'use strict'

const Transaction = use('App/Models/Transaction')
const TransactionMonth = use('App/Models/TransactionMonth')

class TransactionController {

  async getTransactionMonthByFilters({auth, request, response }) {
    const { id } = auth.user;
    const { month, year } = request.all();

    return await TransactionMonth
      .query()
      .where("user_id", id)
      .where("month", month)
      .where("year", year).first();
  }

  async listByFilters({auth, request, response }) {
    const { id } = auth.user;
    const { month, year } = request.all();

    const firstDay = new Date(year, month-1, 1);
    const lastDay = new Date(year, month, 0);

    return await Transaction
      .query()
      .where("user_id", id)
      .where("date", ">=", firstDay)
      .where("date", "<=", lastDay).fetch();
  }

  async store({auth, request, response }) {
    const { id } = auth.user;
    const data = request.only([
      "type",
      "quantity",
      "date",
      "brokerage",
      "iss",
      "tax_bmf",
      "tax_register_bmf",
      "other_expenditure",
      "irrf",
      "adjustment",
      "result"
    ]);

    const transaction = await Transaction.create({...data, user_id: id});
    const month = (new Date(data["date"])).getMonth()+1;
    const year = (new Date(data["date"])).getFullYear()
    let transactionMonth = await TransactionMonth
      .query()
      .where('user_id', id)
      .where('month', month)
      .where('year', year)
      .first();

    if(typeof transactionMonth == "undefined" || transactionMonth === null) {
      const impairedInjury = await TransactionMonth.impairedInjuryByMonth(month-1, year, id, month, year);
      const impairedIrrf = await TransactionMonth.impairedIrrfByMonth(month-1, year, id, month, year);
      const darfLessTen = await TransactionMonth.darfLessTenByMonth(month-1, year, id, month, year);
      const impairedInjuryNextMonth = (impairedInjury + transaction.result) >= 0.0 ? 0.0 : impairedInjury + transaction.result
      const irrfNextMonth = impairedInjuryNextMonth !== 0.0 ? impairedIrrf + transaction.irrf : 0.0;
      const valueDarf = impairedInjuryNextMonth === 0.0 ? ((transaction.result - impairedInjury)*0.2)-(impairedIrrf+transaction.irrf) : 0.0

      await TransactionMonth.create({
        "month": month,
        "year": year,
        "impaired_injury": impairedInjury,
        "result": transaction.result,
        "impaired_injury_next_month": impairedInjuryNextMonth,
        "impaired_irrf": impairedIrrf,
        "irrf": transaction.irrf,
        "irrf_next_month": irrfNextMonth,
        "value_darf": valueDarf,
        "darf_less_ten": darfLessTen,
        "user_id": id
      });
    } else {
      console.log("found transaction month with id: " + transactionMonth.id)
      const transactionMonthDb = await TransactionMonth.findOrFail(transactionMonth.id)

      transactionMonthDb.updateValues(transaction.result, transaction.irrf);
      await transactionMonthDb.save();
    }

    return transaction;
  }
}

module.exports = TransactionController
