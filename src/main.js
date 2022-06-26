// const inputArrDollar = [
//   "take-home-pay",
//   "annual-spending",
//   "retire-spending",
//   "current-networth"
// ];
// const inputArrDollarLen = inputArrDollar.length;
// for (let i = 0; i < inputArrDollarLen; i++) {
//   const idTag = "#" + inputArrDollar[i];
//   console.log(idTag);
//   document.addEventListener("DOMContentLoaded", function (event) {
//     let autoNumericInstance = new AutoNumeric(idTag, {
//       currencySymbol: "$",
//       digitGroupSeparator: ",",
//       maximumValue: "10000000",
//       minimumValue: "0",
//     });
//   });
// }

// const inputArrPerc = ["expected-return", "SWR", "inflation", "income-growth-rate"];
// const inputArrPercLen = inputArrPerc.length;
// for (let i = 0; i < inputArrPercLen; i++) {
//   const idTag = "#" + inputArrPerc[i];
//   console.log(idTag);
//   document.addEventListener("DOMContentLoaded", function (event) {
//     let autoNumericInstance = new AutoNumeric(idTag, {
//       suffixText: "%",
//       maximumValue: "20",
//       minimumValue: "0",
//       decimalPlaces: 1
//     });
//   });
// }

// let tooltipTriggerList = [].slice.call(
//   document.querySelectorAll('[data-bs-toggle="tooltip"]')
// );
// let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//   return new bootstrap.Tooltip(tooltipTriggerEl);
// });

function updateInput() {
  const inputArr = [
    "age",
    "take-home-pay",
    "annual-spending",
    "retire-spending",
    "current-networth",
    "SWR",
    "inflation",
    // "income-growth-rate",
    "expected-return"
  ];
  const inputArrLen = inputArr.length;
  const inputDict = {};
  for (let i = 0; i < inputArrLen; i++) {
    if (document.getElementById(inputArr[i]).value) {
      // why does JS take the number as a string not a number
      const idTag = "#" + inputArr[i];
      inputDict[inputArr[i]] =
        parseFloat(document.getElementById(inputArr[i]).value) ||
        AutoNumeric.getNumber(idTag);
      console.log(inputDict);
    }
  }
  if (Object.keys(inputDict).length === 8) {
    let chartStatus = Chart.getChart("myChart"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
    const targetRetireValue = calTarget(
      inputDict['retire-spending'],
      inputDict.SWR
    );
    // console.log("Target",targetRetireValue)
    // console.log(inputDict.age, inputDict.takeHomePay, inputDict.AnnualSpending, inputDict.CurrentNetWorth, inputDict.Inflation, inputDict.ExpectedReturn)
    inputDict["retirementTarget"] = targetRetireValue;

    const chartArr = calSeries(
      inputDict.age,
      inputDict['take-home-pay'],
      inputDict['annual-spending'],
      inputDict['current-networth'],
      inputDict['inflation'],
      inputDict['expected-return']
    );
    const yearToFI = checkNumYear(targetRetireValue, chartArr[1]);
    const yearToPlot = inputDict.age + yearToFI + 20; // 20 as buffer
    chartArr[0] = chartArr[0].slice(0, yearToPlot);
    chartArr[1] = chartArr[1].slice(0, yearToPlot);
    createChart(chartArr, targetRetireValue, yearToPlot);

    const string = `You will reach Financial Independence in ${yearToFI} years with $${targetRetireValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} in Networth`;
    document.getElementById("first").innerHTML = string;
    inputDict["retirementObjective"] = string;
    console.log(inputDict);
    document.getElementById("emailData").style.display = "block";
  }
}

function createChart(data, target) {
  document.getElementById("myChart").style.display = "block"
  const ctx = document.getElementById("myChart");
  const footer = (tooltipItems) => {
    let sum = 0;
    sum = tooltipItems[0].parsed.y - tooltipItems[1].parsed.y;

    return "Gap: $" + sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data[0],
      datasets: [
        {
          label: "NetWorth",
          data: data[1],
          borderColor: "#3e95cd",
          fill: false,
        },
        {
          label: "Fire Target",
          data: Array(data[1].length).fill(target),
          borderColor: "#8e5ea2",
          fill: false,
        },
      ],
    },
    options: {
      interaction: {
        intersect: false,
        mode: "index",
      },
      title: {
        display: true,
        text: "Fire Goals",
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Age",
          },
          ticks: {
            maxTicksLimit: 15,
          },
        },
        y: {
          title: {
            display: true,
            text: "Networth",
          },
          ticks: {
            maxTicksLimit: 10,
          },
        },
        // xAxis: {
        //     ticks: {
        //         maxTicksLimit: 20
        //     }
        // }
      },
      plugins: {
        tooltip: {
          callbacks: {
            footer: footer,
          },
        },
      }, //WORK on tooltips - show both networth and detla on the same tip
    },
  });
}

function checkNumYear(target, arr) {
  const isLargeNumber = (element) => element > target;
  console.log(target);
  console.log(arr[arr.findIndex(isLargeNumber)]);
  return arr.findIndex(isLargeNumber);
}

function calTarget(RetireSpending, SWR) {
  return Math.round(RetireSpending / (SWR / 100));
}

function calSeries(
  age,
  takeHomePay,
  annualSpending,
  currentNetworth,
  inflation,
  expectedReturn
) {
  console.log("type", typeof age);
  const networthSeries = [currentNetworth];
  const ageSeries = [age];

  //  hardcoded retirement age as 92 //
  const netReturn = expectedReturn - inflation;
  const netSavings = takeHomePay - annualSpending;
  while (age < 70) {
    newNetWorth = 0;
    newNetWorth = currentNetworth * (1 + netReturn / 100) + netSavings;
    networthSeries.push(Math.round(newNetWorth));
    currentNetworth = newNetWorth;
    age += 1;
    ageSeries.push(age);
  }
  return [ageSeries, networthSeries];
}

function inputValue() {
  const inputArr = [
    "age",
    "take-home-pay",
    "annual-spending",
    "retire-spending",
    "current-networth",
    "SWR",
    "inflation",
    // "income-growth-rate",
    "expected-return"
  ];
  const inputArrLen = inputArr.length;
  const valueArr = [32, 60000, 24000, 36000, 200000, 2, 2, 10]; //remove 2
  for (let i = 0; i < inputArrLen; i++) {
    document.getElementById(inputArr[i]).value = valueArr[i];
  }
  updateInput();
}

// //const alphavantageKey = ['NA77STNM2IHMFJSF']
// const generateQueryUrl = (queryTerm) => {
//   return `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${queryTerm}&apikey=NA77STNM2IHMFJSF`;
// };

// const fetchData = async (ticker, numYear) => {
//   try {
//     const response = await fetch(generateQueryUrl(ticker));
//     const data = await response.json();
//     // console.log(data)
//     renderStock(data, numYear);
//   } catch (err) {
//     console.log("err: ", err);
//   }
// };

function dropDownChange() {
  const selectValue = document.getElementById("investment-select");
  if (selectValue.value != "Based 10-yr historical returns on") {
    console.log(requestData(selectValue.value, 10));
  }
}

function getURL(queryTerm) {
  return `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${queryTerm}&apikey=NA77STNM2IHMFJSF`;
}
async function requestData(ticker, numYear) {
  try {
    const response = await fetch(getURL(ticker));
    const data = await response.json();
    console.log(data);
    renderStock(data, numYear);
  } catch (err) {
    console.log("err: ", err);
  }
}

function renderStock(data, numYear) {
  const listOfDate = Object.keys(data["Monthly Adjusted Time Series"]);
  const firstDate = listOfDate[1];
  const lastDate = listOfDate[1 + numYear * 12];
  const finalIndex =
    data["Monthly Adjusted Time Series"][firstDate]["5. adjusted close"];
  const initialIndex =
    data["Monthly Adjusted Time Series"][lastDate]["5. adjusted close"];
  const outputReturn = ((finalIndex / initialIndex) ** (1 / numYear) - 1) * 100;
  document.getElementById("expected-return").value = outputReturn.toFixed(1);
}



function addAutoDecimalToInputs() {
  const maximumValue =  Number(20).toString();
  const minimumValue =  Number(0).toString();

  [
    // "expected-return",
     "SWR", 
     "inflation", 
    //  "income-growth-rate"
  ].forEach((id) => {
    new AutoNumeric(`#${id}`, {
      suffixText: "%",
      maximumValue,
      minimumValue,
      decimalPlaces: 1,
    });
  });
}

function sendEmail() {
  const emailAddress = document.getElementById("userEmail").value
  const output = emailOutput()
  console.log(output[0], output[1])
    Email.send({
      Host : "smtp.elasticemail.com",
      Username : "gatestemail123@gmail.com",
      Password : "6E02DBBC25F405DC86ECD2F6DCE3FCCD73B7",
      To : emailAddress,
      From : "gatestemail123@gmail.com",
      Subject : output[1],
      Body : output[0]
      }).then(
        message => alert(message)
      );
  document.getElementById("emailData").style.display = "none";
}

function addAutoDollarToInputs() {
  const maximumValue =  Number(10_000_000).toString();
  const minimumValue =  Number(0).toString();

  [
    "take-home-pay",
    "annual-spending",
    "retire-spending",
    "current-networth"
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


function addEventListeners() {
  document.addEventListener("DOMContentLoaded", (_) => {
    addAutoDollarToInputs();
    addAutoDecimalToInputs();
    addBootstrapTooltips();
    console.log("haaska")
  });
}

function init() {
  addEventListeners();
}

init();



function emailOutput() {
  const inputArr = [
    "age",
    "take-home-pay",
    "annual-spending",
    "retire-spending",
    "current-networth",
    "SWR",
    "inflation",
    // "income-growth-rate",
    "expected-return"
  ];
  const inputArrLen = inputArr.length;
  const inputDict = {};
  for (let i = 0; i < inputArrLen; i++) {
    if (document.getElementById(inputArr[i]).value) {
      const idTag = "#" + inputArr[i];
      inputDict[inputArr[i]] =
        parseFloat(document.getElementById(inputArr[i]).value) ||
        AutoNumeric.getNumber(idTag);
    }
  }
    const targetRetireValue = calTarget(
      inputDict['retire-spending'],
      inputDict.SWR
    );
    inputDict["retirementTarget"] = targetRetireValue;
    const chartArr = calSeries(
      inputDict.age,
      inputDict['take-home-pay'],
      inputDict['annual-spending'],
      inputDict['current-networth'],
      inputDict['inflation'],
      inputDict['expected-return']
    );
    const yearToFI = checkNumYear(targetRetireValue, chartArr[1]);
    const string = `You can reach Financial Independence in ${yearToFI} years with $${targetRetireValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} in Networth`;
    const message = `Assumptions: 
                    Current Age: $${inputDict.age},
                    Current Take Home Pay: $${inputDict['take-home-pay']},
                    Current Annual Expenditure: $${inputDict['annual-spending']},
                    Inflation: ${inputDict['inflation']}%,
                    Safe Withdrawal Rate: ${inputDict.SWR}%,
                    Retirement Expenditure: $${inputDict['retire-spending']}
                    Expected Return: ${inputDict['expected-return']}%,
                    Current Networth: $${inputDict['current-networth']},
                    `
    console.log(message)
    const output = [message,string]
    return output
}
