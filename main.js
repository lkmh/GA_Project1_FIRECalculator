//function updateInput(){
//    const idName = event.target.id
 //   const age = document.getElementById(idName).value;
 //   console.log()
//}

function updateInput(){
    const inputArr = ['age','takeHomePay','AnnualSpending','RetireSpending','CurrentNetWorth','SWR','Inflation','IncomeGrowthRate','ExpectedReturn'] 
    const inputArrLen = inputArr.length 
    const inputDict = {}
    for (let i = 0; i < inputArrLen; i++ ){
        if (document.getElementById(inputArr[i]).value) {
            inputDict[inputArr[i]] =  document.getElementById(inputArr[i]).value
            console.log(inputDict)
        }
        
    }
    if (Object.keys(inputDict).length === 9) {
        targetRetireValue = calTarget(inputDict.RetireSpending, inputDict.SWR)
        console.log("Target",targetRetireValue)
        const chartArr = calSeries(inputDict.age, inputDict.takeHomePay, inputDict.AnnualSpending, inputDict.CurrentNetworth, inputDict.Inflation, inputDict.IncomeGrowthRate, inputDict.ExpectedReturn)
        document.getElementById("timeseries").innerText = chartArr[1];
    }


}

function calTarget(RetireSpending, SWR) {
    return RetireSpending/ (SWR/100)
}

function calSeries(age, takeHomePay, AnnualSpending, CurrentNetworth, Inflation, IncomeGrowthRate, ExpectedReturn) {
    const netWorthSeries = [CurrentNetworth]
    const ageSeries = [age]

    //  hardcoded retirement age as 92 // 
    const netReturn =  ExpectedReturn-Inflation
    const netSavings = takeHomePay - AnnualSpending
    while (age < 92) {
        newNetWorth = 0 
        newNetWorth = CurrentNetworth * (1+(netReturn/100)) + (netSavings)
        netWorthSeries.push(Math.round(newNetWorth))
        CurrentNetworth = newNetWorth
        age += 1
        ageSeries.push(age)
    }
    return [ageSeries, netWorthSeries]
}

console.log(2)
console.log(calSeries(32,60000,24000,100000,2,1,10))