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
            // why does JS take the number as a string not a number
            inputDict[inputArr[i]] =  parseFloat(document.getElementById(inputArr[i]).value)
            console.log(inputDict)
        }
        
    }
    if (Object.keys(inputDict).length === 9) {
        targetRetireValue = calTarget(inputDict.RetireSpending, inputDict.SWR)
        // console.log("Target",targetRetireValue)
        // console.log(inputDict.age, inputDict.takeHomePay, inputDict.AnnualSpending, inputDict.CurrentNetWorth, inputDict.Inflation, inputDict.ExpectedReturn)
        const chartArr = calSeries(inputDict.age, inputDict.takeHomePay, inputDict.AnnualSpending, inputDict.CurrentNetWorth, inputDict.Inflation, inputDict.ExpectedReturn)
        
        console.log("Retirement Reach in",checkNumYear(targetRetireValue, chartArr[1]))
    }


}


function checkNumYear(target, arr){
    const isLargeNumber = (element) => element > target
    return arr.findIndex(isLargeNumber)
}

function calTarget(RetireSpending, SWR) {
    return RetireSpending/ (SWR/100)
}

function calSeries(age, takeHomePay, AnnualSpending, CurrentNetworth, Inflation, ExpectedReturn) {
    console.log("type",typeof(age))
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

function inputValue(){
    const inputArr = ['age','takeHomePay','AnnualSpending','RetireSpending','CurrentNetWorth','SWR','Inflation','IncomeGrowthRate','ExpectedReturn'] 
    const inputArrLen = inputArr.length 
    const valueArr = [32,60000,24000,10000,200000,2,2,2,10]
    for (let i = 0; i < inputArrLen; i++ ){
        document.getElementById(inputArr[i]).value =  valueArr[i]


    }
    updateInput()
}