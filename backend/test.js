const sampleData = {
    hab:{
        selected: [
            {value: "hab2", label: "something", utility: "1", weight: "low"},
            {value: "hab3", label: "something", utility: "1", weight: "medium"}
        ],
        weight:20
    },
    wq:{
        selected: [
            {value: "wq2", label: "National Heritage Area", utility: "1", weight: "medium"}
        ],
        weight:20
    },
    lcmr:{
        selected: [
            {value: "lcmr2", label: "National Heritage Area", utility: "1", weight: "medium"}
        ],
        weight:20
    },
    cl:{
        selected: [
            {value: "cl2", label: "National Heritage Area", utility: "-1", weight: "high"}
        ],
        weight:20
    },
    eco:{
        selected: [],
        weight:0
    }
}

const weight = {
    'high': 1,
    'medium':0.67,
    'low':0
}

let array = Object.entries(sampleData);
let goalWeights= array.map(goal=>goal[1].weight);
let measures = array.map(goal=>goal[1].selected.map(item=>{
    return item.utility > 0 ? `${item.value}*${weight[item.weight]}` : `(1-(${item.value}*${weight[item.weight]}))`}).join('+'));
let final = goalWeights.map((val,idx)=>{
    return val===0 ? "0": `${val}*(${measures[idx]})`
}).join('+');