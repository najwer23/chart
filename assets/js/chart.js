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
        console.log(this.dataSample)
        console.log(this.rangeX)
        var ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.rangeX, //range on axies x, precision must be bigger or same as data
                datasets: [{
                    label: this.title,
                    data: this.dataSample, //sample data value
                    borderWidth: 1,
                    borderColor: "red",
                    backgroundColor: "red"
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

window.onload = () => {
    let mainChart = new CustomChart({
        title: "Wykres testowy",
        axisX: {step: 1, name: "x", precision: 0},
        axisY: {step: 2, name: "y", precision: 0},
        dataSample: [{x: 2, y: 20}, {x: 7, y: 30}, {x: 90, y: 40}]
    })
    mainChart.drawChart()
}

