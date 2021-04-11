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
                        suggestedMin: this.rangeY[0],
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

        for (let i=this.leftBound; i<=this.rightBound; i+=this.step) {
            Y = eval(this.getyFunction().replace(/x/gi, `(${i})`))
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
        if (this.yFunction.match(/[a-wA-Wy-zY-Z]/gi) != null) {
            this.yFunction = "x"
        }
        return this.yFunction;
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