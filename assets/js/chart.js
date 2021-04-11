import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

class CustomChart {
    constructor (params) {
        this.dataSample = params.dataSample
        this.title = params.title
        this.rangeX = this.makeAxisRange(params.axisX.step, params.axisX.name, params.axisX.precision)
        this.rangeY = this.makeAxisRange(params.axisY.step, params.axisY.name, params.axisY.precision)
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
        new Chart(ctx, {
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
};

class DataCenter {
    constructor (params) {
        this.yFunction = params.yFunction;
        this.leftBound = params.leftBound
        this.rightBound = params.rightBound
        this.step = params.step
        this.sampledFunction = []

    }

    generateData() {  
        let minusInfinity = -999999;     
        let plusInfinity = 999999;
        let Y;

        for (let i=this.leftBound; i<=this.rightBound; i+=this.step) {
            Y = eval(this.yFunction.replace(/x/gi, `(${i})`))
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

    getSampledFunction() {
        return this.sampledFunction
    }

    getPrecision() {
        let precision = this.step.toString();
        return (this.step % 1 == 0) ? 0 : (precision.length - 2)
    }
}

window.onload = () => {
    let yFunction = "x**3";
    let leftBound = -1;
    let rightBound = 1;
    let step = 0.01



    let dataCenter = new DataCenter({
        yFunction: yFunction,
        leftBound: leftBound,
        rightBound: rightBound,
        step: step
    });

    dataCenter.generateData();
    let sampledFunction = dataCenter.getSampledFunction();
    let precision = dataCenter.getPrecision()

    let mainChart = new CustomChart({
        title: "Wykres y=" + yFunction,
        axisX: {step: step, name: "x", precision: precision},
        axisY: {step: 1, name: "y", precision: 0},
        dataSample: sampledFunction
    })
    mainChart.drawChart()
}

