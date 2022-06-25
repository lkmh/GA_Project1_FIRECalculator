import Chart from './chart/chart.js'

function inputValue() {
  const inputArr = [
    "age",
    "take-home-pay",
    "AnnualSpending",
    "RetireSpending",
    "CurrentNetWorth",
    "SWR",
    "Inflation",
    "IncomeGrowthRate",
    "ExpectedReturn",
  ];
  const inputArrLen = inputArr.length;
  const valueArr = [32, 60000, 24000, 36000, 200000, 2, 2, 2, 10];
  for (let i = 0; i < inputArrLen; i++) {
    document.getElementById(inputArr[i]).value = valueArr[i];
  }
}


function addAutoDecimalToInputs() {
  const maximumValue =  Number(20).toString();
  const minimumValue =  Number(0).toString();

  [
    "ExpectedReturn",
    "SWR",
    "Inflation",
    "IncomeGrowthRate"
  ].forEach((id) => {
    new AutoNumeric(`#${id}`, {
      suffixText: "%",
      maximumValue,
      minimumValue,
      decimalPlaces: 1,
    });
  });
}

function addAutoDollarToInputs() {
  const maximumValue =  Number(10_000_000).toString();
  const minimumValue =  Number(0).toString();

  [
    "take-home-pay",
    "AnnualSpending",
    "RetireSpending",
    "CurrentNetWorth"
  ].forEach((id) => {
    new AutoNumeric(`#${id}`, {
      currencySymbol: "$",
      digitGroupSeparator: ",",
      maximumValue,
      minimumValue,
    });
  });
}

function addBootstrapTooltips() {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(dom => {
    new bootstrap.Tooltip(dom);
  })
}

function addInputDomListeners(chart) {
  const inputDoms = document.getElementsByTagName('input')
  for(let i=0,j=inputDoms.length; i<j; i++) {
    inputDoms[i].addEventListener('change', () => {
      chart.update();
      console.log('chart: ', chart);
    })
  }
}

function addEventListeners(chart) {
  document.addEventListener("DOMContentLoaded", (_) => {
    addAutoDollarToInputs();
    addAutoDecimalToInputs();
    addBootstrapTooltips();
    addInputDomListeners(chart);
  });
}

function init() {
  const chart = new Chart();
  addEventListeners(chart);
}

init();
