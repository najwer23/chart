import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

class CustomChart {
    constructor (params) {
        this.dataSample = params.dataSample
        this.title = params.title
        this.rangeX = this.makeAxisRange(params.axisX.step, params.axisX.name, params.axisX.precision)
        this.rangeY = this.makeAxisRange(params.axisY.step, params.axisY.name, params.axisY.precision)
        this.chart = null;
    }

    makeAxisRange(step, axis, precision) {
        let arr = this.dataSample.map(v => v[axis])
        let min = Math.min(...arr); 
        let max = Math.max(...arr);
        let arrRange = [];
        for (let i=min; i<=max; i+=step) arrRange.push(+i.toFixed(precision));
        return arrRange
    }

    drawChart() {
        var ctx = document.getElementById('chart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                labels: this.rangeX, //range on axies x, precision must be bigger or same as data
                datasets: [{
                    label: this.title,
                    data: this.dataSample, //sample data value
                    borderWidth: 1,
                    borderColor: "#2D58FA",
                    backgroundColor: "#2D58FA"
                }]
            },
            options: {
                scales: {
                    y: {
                        suggestedMin: 0, //this.rangeY[0],
                        suggestedMax: Math.max(...this.rangeY)
                    },
                    x: {

                    }
                }   
             }
        });
    }

    deconstructor() {
        this.chart.destroy();
      }
};

class DataCenter {
    constructor (params) {
        this.yFunction = this.getValueByName(params.yFunction);
        this.leftBound = +this.getValueByName(params.leftBound)
        this.rightBound = +this.getValueByName(params.rightBound)
        this.step = +this.getValueByName(params.step)
        this.sampledFunction = []
    }

    generateData() {  
        let minusInfinity = -999999;     
        let plusInfinity = 999999;
        let Y;
        let yFun = this.getyFunction();

        for (let i=this.leftBound; i<=this.rightBound; i+=this.step) {
            Y = eval(yFun.replace(/x/gi, `(${i})`))
            if (Y>minusInfinity && Y<plusInfinity) {
                this.sampledFunction.push(
                    {
                        x: i,
                        y: Y
                    }
                )
            }
        }
    }

    getStep() {
        return this.step
    }

    getyFunction() {
        this.yFunction = this.yFunction.replace(/(-x\**)/gi,"(-1)*x**")
        let t = this.yFunction;
        t = t.replace(/(Math.sin)|(\()|(\))|(x)|Math.cos|[0-9]|[\+\-\*\/\**]/gi,"")
        if(t.length > 0) {
            this.yFunction = "x";
            console.log("Niedozwolona funkcja")
            this.setValueByName('yFunction',this.yFunction)
        }
        return this.yFunction;
    }

    setValueByName(n,v) {
        document.querySelector('input[name='+n+']').value =v
    }

    getSampledFunction() {
        return this.sampledFunction
    }

    getPrecision() {
        let precision = this.step.toString();
        return (this.step % 1 == 0) ? 0 : (precision.length - 2)
    }

    getValueByName(n) {
        return document.querySelector('input[name='+n+']').value
    }

    monteCarlo() {
        let sum = 0, x = 0;
        let lb = this.leftBound;
        let rb = this.rightBound;
        let N = 100000

        for (let i=0; i<N; i++) {
            x = this.generateRandomNumber(lb, rb)
            sum += eval(this.getyFunction().replace(/x/gi, `(${x})`))
        }
       
        document.querySelector("#monteCarlo").innerHTML = (((rb-lb)/N)*sum).toFixed(2)
    }

    generateRandomNumber(min, max) {
       return +(Math.random() * (max - min) + min).toFixed(4);
    };
}

var chartList = [];

function makeChart() {
    let dataCenter = new DataCenter({
        yFunction: "yFunction",
        leftBound: "leftBound",
        rightBound: "rightBound",
        step: "step"
    });
    dataCenter.generateData();
    dataCenter.monteCarlo();

    let mainChart = new CustomChart({
        title: "Wykres y=" + dataCenter.getyFunction(),
        axisX: {step: dataCenter.getStep(), name: "x", precision: dataCenter.getPrecision()},
        axisY: {step: 1, name: "y", precision: 0},
        dataSample: dataCenter.getSampledFunction()
    })
    mainChart.drawChart()  
    chartList.push(mainChart)
}

window.onload = () => {
    makeChart()

    document.querySelector('#chart-controls').addEventListener('change', (e) => {
        chartList.map(v=>v.deconstructor())
        makeChart()
    });
}