import area from "@turf/area";


export function calculateArea(input){
  let totalArea = 0;
  if(input.length>0){
    totalArea= input.reduce((a,b)=>{return a+area(b)},0)/1000000
  }
  return totalArea;
}

export function aggregate(input,area) {
    const hexNumber = input.length===0? 1: input.length;
    let aggregatedResult = input.reduce((a,b)=>{return {
        hab1:a.hab1>=b.hab1?a.hab1:b.hab1,
        hab2:a.hab2+b.hab2,
        hab3:a.hab3>=b.hab3?a.hab3:b.hab3,
        hab4:a.hab4+b.hab4,
        wq1: a.wq1+b.wq1,
        wq2: a.wq2+b.wq2,
        wq3: a.wq3+b.wq3,
        lcmr1:a.lcmr1>=b.lcmr1?a.lcmr1:b.lcmr1,
        lcmr2:a.lcmr2+b.lcmr2,
        lcmr3:a.lcmr3>=b.lcmr3?a.lcmr3:b.lcmr3,
        lcmr4:a.lcmr4>=b.lcmr4?b.lcmr4:a.lcmr4,
        cl1: a.cl1>=b.cl1?a.cl1:b.cl1,
        cl2: a.cl2+b.cl2,
        cl3: a.cl3>=b.cl3?a.cl3:b.cl3,
        cl4: a.cl4>=b.cl4?a.cl4:b.cl4,
        eco1: a.eco1+b.eco1,
        eco2: a.eco2>=b.eco2?a.eco2:b.eco2,
        eco3:a.eco3>=b.eco3?a.eco3:b.eco3,
        eco4:a.eco4>=b.eco4?a.eco4:b.eco4,
    }},{hab1:0,hab2:0,hab3:0,hab4:0,wq1:0,wq2:0,wq3:0,lcmr1:0,lcmr2:0,lcmr3:0,lcmr4:1,cl1:0,cl2:0,cl3:0,cl4:0,cl5:0,eco1:0,eco2:0,eco3:0,eco4:0})
    aggregatedResult.hab3=1-aggregatedResult.hab3;
    aggregatedResult.hab0=area;
    aggregatedResult.wq1= aggregatedResult.wq1/hexNumber;
    aggregatedResult.eco1= aggregatedResult.eco1/hexNumber;
    aggregatedResult.hab2= aggregatedResult.hab2/hexNumber;
    aggregatedResult.hab4= aggregatedResult.hab4/hexNumber;
    aggregatedResult.wq3= aggregatedResult.wq3/hexNumber;
   return aggregatedResult;
}

export function getStatus(input){
  let scaledResult = {
    hab0: Math.round((input.hab0*247.105)*100)/100 + " acres",
    hab1: input.hab1===1? "Yes" : "No",
    hab2: Math.round((input.hab2*10000))/100 + "%",
    hab3: input.hab3>0.67? "Low" : input.hab3>0.33 ? "Medium": input.hab3>0 ? "High" : "No Threat",
    hab4: Math.round((input.hab4*10000))/100 + "%",
    wq1: Math.round((input.wq1*10000))/100 + "%",
    wq2: Math.round((input.wq2*100))/100 + "km",
    wq3: Math.round((input.wq3*10000))/100 + "%",
    lcmr1: input.lcmr1 > 6 ? "High": input.lcmr1 > 3 ? "Medium" : input.lcmr1 > 0 ? "Low" : "NA",
    lcmr2: Math.round((input.lcmr2*10000))/100 + "%",
    lcmr3: input.lcmr3,
    lcmr4: input.lcmr4 > 0.66 ? "High": input.lcmr4 > 0.33 ? "Medium" : input.lcmr4 > 0 ? "Low" : "No Light Pollution",
    cl1: input.cl1,
    cl2: Math.round((input.cl2*10000))/100 + "%",
    cl3: input.cl3 >= 1 ? "High": input.cl3 >= 0.75 ? "Medium-High" : input.cl3 >= 0.5 ? "Medium" : input.cl3 >= 0.25 ? "Medium-Low" : input.cl3 > 0 ? "Low" : "No Threat",
    cl4: input.cl4 >= 1 ? "High": input.cl4 >= 0.75 ? "Medium-High" : input.cl4 >= 0.5 ? "Medium" : input.cl4 >= 0.25 ? "Medium-Low" : input.cl4 > 0 ? "Low" : "Insufficient data",
    eco1: Math.round((input.eco1*10000))/100 + "%",
    eco2: input.eco2 > 3 ? "High": input.eco2 > 2 ? "Medium-High" : input.eco2 > 1 ? "Medium" : input.eco2 > 0 ? "Low" : "Insufficient data",
    eco3: input.eco3 > 3 ? "High": input.eco3 > 2 ? "Medium-High" : input.eco3 > 1 ? "Medium" : input.eco3 > 0 ? "Low" : "Insufficient data",
    eco4: input.eco4
  }
  return scaledResult;
}

export function getScaledForAssessment(input,id,name){
  let scaledResult = {
    id,
    name,
    hab0: input.hab0===0? 0: input.hab0<=0.4? 0.3: input.hab0<=0.8? 0.75: input.hab0<=2? 0.9 : 1,
    hab1: input.hab1,
    hab2: Math.round((input.hab2*100))/100,
    hab3: input.hab3,
    hab4: Math.round((input.hab4*100))/100,
    wq1: Math.round((input.wq1*100))/100,
    wq2: input.wq2>=15? 1: input.wq2>=10 ? 0.75 : input.wq2>=5? 0.5 : input.wq2>0 ? 0.25 : 0,
    wq3: input.wq3,
    lcmr1: input.lcmr1/10,
    lcmr2: input.lcmr2<=0.01? 0 : input.lcmr2<=.2 ? 0.75 : input.lcmr2<=.6 ? 0.9 : 1,
    lcmr3: input.lcmr3===0? 0 : input.lcmr3<=1 ? 0.9 : input.lcmr3<=2 ? 0.95 : 1,
    lcmr4: input.lcmr4,
    cl1: input.cl1 ===0 ? 0: input.cl1 <= 1? 0.75 : input.cl1<= 2 ? 0.9 : 1,
    cl2: Math.round((input.cl2*100))/100,
    cl3: input.cl3,
    cl4: input.cl4,
    eco1: Math.round((input.eco1*100))/100,
    eco2: input.eco2/4,
    eco3: input.eco3/4,
    eco4: input.eco4===0 ? 0: input.eco4<=5? 0.25 : input.eco4<=10 ? 0.75 : input.eco4<=15 ? 0.9 : 1
  }
  return scaledResult;
}

export function mergeIntoArray(input){
  let result = {
    id:[],
    name:[],
    hab0: [],
    hab1: [],
    hab2: [],
    hab3:[],
    hab4: [],
    wq1: [],
    wq2: [],
    wq3: [],
    lcmr1: [],
    lcmr2: [],
    lcmr3: [],
    lcmr4: [],
    cl1: [],
    cl2: [],
    cl3: [],
    cl4: [],
    eco1: [],
    eco2: [],
    eco3: [],
    eco4: []
  }
  input.forEach(aoi=>{
    Object.entries(aoi).forEach(measure=>{result[measure[0]].push(measure[1])})
  })
  return result;
}

export function calculateMeasures(input,weights){
  const weightsList = {
    "low":0.34,
    "medium":0.67,
    "high":1
  }
  return input.map(aoi=>{
    let result = [];
    if(!weights.hab.selected || weights.hab.selected.length===0){
      result.push(0);
    }else{
      let goalScore = 0;
      weights.hab.selected.forEach(item=>
        { 
          goalScore += item.utility > 0 ? aoi[item.value]*weightsList[item.weight] : 1 - aoi[item.value]*weightsList[item.weight];
        }
      )
      goalScore = goalScore/weights.hab.selected.length
      result.push(goalScore);
    }
    if(!weights.wq.selected || weights.wq.selected.length===0){
      result.push(0);
    }else{
      let goalScore = 0;
      weights.wq.selected.forEach(item=>
        {
          goalScore += item.utility > 0 ? aoi[item.value]*weightsList[item.weight] : 1 - aoi[item.value]*weightsList[item.weight];
        }
      )
      goalScore = goalScore/weights.wq.selected.length
      result.push(goalScore);
    }
    if(!weights.lcmr.selected ||weights.lcmr.selected.length===0){
      result.push(0);
    }else{
      let goalScore = 0;
      weights.lcmr.selected.forEach(item=>
        {
          goalScore += item.utility > 0 ? aoi[item.value]*weightsList[item.weight] : 1 - aoi[item.value]*weightsList[item.weight];
        }
      )
      goalScore = goalScore/weights.lcmr.selected.length
      result.push(goalScore);
    }
    if(!weights.cl.selected ||weights.cl.selected.length===0){
      result.push(0);
    }else{
      let goalScore = 0;
      weights.cl.selected.forEach(item=>
        {
          goalScore += item.utility > 0 ? aoi[item.value]*weightsList[item.weight] : 1 - aoi[item.value]*weightsList[item.weight];
        }
      )
      goalScore = goalScore/weights.cl.selected.length
      result.push(goalScore);
    }
    if(!weights.eco.selected || weights.eco.selected.length===0){
      result.push(0);
    }else{
      let goalScore = 0;
      weights.eco.selected.forEach(item=>
        {
          goalScore += item.utility > 0 ? aoi[item.value]*weightsList[item.weight] : 1 - aoi[item.value]*weightsList[item.weight];
        }
      )
      goalScore = goalScore/weights.eco.selected.length
      result.push(goalScore);
    }
    return result;
  })
}
      