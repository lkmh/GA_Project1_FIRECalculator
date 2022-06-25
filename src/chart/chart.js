export default class Chart {
  constructor() {
    //
  }

  update() {
    const validInputs = this.#getValidInputs();
    console.log('haha')

    if(!validInputs) {
      return;
    }

    return;
    const chartStatus = Chart.getChart("myChart"); // <canvas> id
    if (!!chartStatus) {
      chartStatus.destroy();
    }

    const targetRetireValue = this.#getTargetRetireAmount(
      validInputs.RetireSpending,
      validInputs.SWR
    );
    // console.log("Target",targetRetireValue)
    // console.log(inputDict.age, inputDict.takeHomePay, inputDict.AnnualSpending, inputDict.CurrentNetWorth, inputDict.Inflation, inputDict.ExpectedReturn)
    inputDict["retirementTarget"] = targetRetireValue;

    const chartArr = calSeries(
      inputDict.age,
      inputDict.takeHomePay,
      inputDict.AnnualSpending,
      inputDict.CurrentNetWorth,
      inputDict.Inflation,
      inputDict.ExpectedReturn
    );
    const yearToFI = checkNumYear(targetRetireValue, chartArr[1]);
    const yearToPlot = inputDict.age + yearToFI + 20; // 20 as buffer
    chartArr[0] = chartArr[0].slice(0, yearToPlot);
    chartArr[1] = chartArr[1].slice(0, yearToPlot);
    createChart(chartArr, targetRetireValue, yearToPlot);

    const string = `You can reach Financial Independence in ${yearToFI} years with $${targetRetireValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} in Networth`;
    document.getElementById("first").innerHTML = string;
    inputDict["retirementObjective"] = string;
    console.log(inputDict);
    document.getElementById("emailData").style.display = "block";
  }

  #getValidInputs() {
    const inputs = {
      "age": -1,
      "take-home-pay": -1,
      "AnnualSpending": -1,
      "RetireSpending": -1,
      "CurrentNetWorth": -1,
      "SWR": -1,
      "Inflation": -1,
      "IncomeGrowthRate": -1,
      "ExpectedReturn": -1
    }

    for (const id in inputs) {
      const val = document.getElementById(id)?.value;

      if (!val) {
        return;
      }

      inputs[id] = parseFloat(val) || AutoNumeric.getNumber(`#${id}`);
    }

    return inputs
  }

  #getTargetRetireAmount(retireSpending, safeWithdrawalRate) {
    return Math.round(retireSpending / (safeWithdrawalRate / 100));
  }
}
