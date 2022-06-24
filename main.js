//function updateInput(){
//    const idName = event.target.id
 //   const age = document.getElementById(idName).value;
 //   console.log()
//}

// how to loop across a few inputs
const inputArrDollar = ['takeHomePay','AnnualSpending','RetireSpending','CurrentNetWorth'] 
const inputArrDollarLen = inputArrDollar.length 
for (let i = 0; i < inputArrDollarLen; i++ ){
    const idTag = '#' + inputArrDollar[i]
    console.log(idTag)
    document.addEventListener("DOMContentLoaded", function(event) { 
        let autoNumericInstance = new AutoNumeric(idTag, {
        currencySymbol : '$',
        digitGroupSeparator : ',',
        maximumValue: "10000000",
        minimumValue: "0"
    });
    })
}

const inputArrPerc = ['ExpectedReturn','SWR','Inflation','IncomeGrowthRate'] 
const inputArrPercLen = inputArrPerc.length 
for (let i = 0; i < inputArrPercLen; i++ ){
    const idTag = '#' + inputArrPerc[i]
    console.log(idTag)
    document.addEventListener("DOMContentLoaded", function(event) { 
        let autoNumericInstance = new AutoNumeric(idTag, {
        suffixText: "%",
        maximumValue: "20",
        minimumValue: "0",
        decimalPlaces: 1,
    });
    })
}



function updateInput(){
    const inputArr = ['age','takeHomePay','AnnualSpending','RetireSpending','CurrentNetWorth','SWR','Inflation','IncomeGrowthRate','ExpectedReturn'] 
    const inputArrLen = inputArr.length 
    const inputDict = {}
    for (let i = 0; i < inputArrLen; i++ ){
        if (document.getElementById(inputArr[i]).value) {
            // why does JS take the number as a string not a number
            const idTag = '#' + inputArr[i]
            inputDict[inputArr[i]] =  parseFloat(document.getElementById(inputArr[i]).value) || AutoNumeric.getNumber(idTag);
            console.log(inputDict)
        }
        
    }
    if (Object.keys(inputDict).length === 9) {
        let chartStatus = Chart.getChart("myChart"); // <canvas> id
        if (chartStatus != undefined) {
        chartStatus.destroy();
        }
        const targetRetireValue = calTarget(inputDict.RetireSpending, inputDict.SWR)
        // console.log("Target",targetRetireValue)
        // console.log(inputDict.age, inputDict.takeHomePay, inputDict.AnnualSpending, inputDict.CurrentNetWorth, inputDict.Inflation, inputDict.ExpectedReturn)
        const chartArr = calSeries(inputDict.age, inputDict.takeHomePay, inputDict.AnnualSpending, inputDict.CurrentNetWorth, inputDict.Inflation, inputDict.ExpectedReturn)
        const yearToFI = checkNumYear(targetRetireValue, chartArr[1])
        const yearToPlot = inputDict.age + yearToFI + 20 // 20 as buffer
        chartArr[0] = chartArr[0].slice(0,yearToPlot) 
        chartArr[1] = chartArr[1].slice(0,yearToPlot) 
        createChart(chartArr, targetRetireValue,yearToPlot)
        
        const string = `You can reach Financial Independence in ${yearToFI} years with $${targetRetireValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} in Networth`
        document.getElementById("first").innerHTML = string
    }
}


function createChart(data, target){
    const ctx = document.getElementById('myChart')
    const footer = (tooltipItems) => {
        let sum = 0;
        sum = tooltipItems[0].parsed.y - tooltipItems[1].parsed.y
        
        return 'Gap: $' + sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };
    const myChart = new Chart(ctx, {
        type: 'line',
        data:{
        labels: data[0],
        datasets: [
        {
                label: 'NetWorth',
                data: data[1],
                borderColor: "#3e95cd",
                fill: false
                
                
            },
        {
                label: 'Fire Target',
                data: Array(data[1].length).fill(target),
                borderColor: "#8e5ea2",
                fill: false
            }
        ]
    },
    options: {
        interaction:{
            intersect: false,
            mode: 'index',
        },
        title: {
            display: true,
            text: 'Fire Goals'
        }, 
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Age'
                },
                ticks: {
                    maxTicksLimit: 15
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Networth'
                },
                ticks: {
                    maxTicksLimit: 10
                }
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
              }
            }
          }//WORK on tooltips - show both networth and detla on the same tip
    }
    }
    )
}

function checkNumYear(target, arr){
    
    const isLargeNumber = (element) => element > target
    console.log(target)
    console.log(arr[arr.findIndex(isLargeNumber)])
    return arr.findIndex(isLargeNumber)
}

function calTarget(RetireSpending, SWR) {
    return Math.round(RetireSpending/ (SWR/100))
}

function calSeries(age, takeHomePay, AnnualSpending, CurrentNetworth, Inflation, ExpectedReturn) {
    console.log("type",typeof(age))
    const netWorthSeries = [CurrentNetworth]
    const ageSeries = [age]

    //  hardcoded retirement age as 92 // 
    const netReturn =  ExpectedReturn-Inflation
    const netSavings = takeHomePay - AnnualSpending
    while (age < 70) {
        newNetWorth = 0 
        newNetWorth = CurrentNetworth * (1+(netReturn/100)) + (netSavings)
        netWorthSeries.push(Math.round(newNetWorth))
        CurrentNetworth = newNetWorth
        age += 1
        ageSeries.push(age)
        
    }
    return [ageSeries, netWorthSeries]
}

function inputValue(){
    const inputArr = ['age','takeHomePay','AnnualSpending','RetireSpending','CurrentNetWorth','SWR','Inflation','IncomeGrowthRate','ExpectedReturn'] 
    const inputArrLen = inputArr.length 
    const valueArr = [32,60000,24000,36000,200000,2,2,2,10]
    for (let i = 0; i < inputArrLen; i++ ){
        document.getElementById(inputArr[i]).value =  valueArr[i]


    }
    updateInput()
}

const alphavantageKey = ['NA77STNM2IHMFJSF']


const generateQueryUrl = queryTerm => {
    return `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${queryTerm}&apikey=NA77STNM2IHMFJSF`
}
const fetchData = async(ticker,numYear) => {
    try {
        const response = await fetch(generateQueryUrl(ticker))
        const data = await response.json()
        // console.log(data)
        renderStock(data,numYear)
    } catch (err) {
        console.log('err: ', err)
    }
}

const renderStock = (data,numYear) => {
    const listOfDate = Object.keys(data['Monthly Adjusted Time Series'])
    const firstDate = listOfDate[1]
    const lastDate = listOfDate[1+numYear*12] 
    const finalIndex = data['Monthly Adjusted Time Series'][firstDate]['5. adjusted close']
    const initialIndex =  data['Monthly Adjusted Time Series'][lastDate]['5. adjusted close']
    console.log(((finalIndex/initialIndex)**(1/numYear)-1)*100)
}

fetchData('voo',5)

