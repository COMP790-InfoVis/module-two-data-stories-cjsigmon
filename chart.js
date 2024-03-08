function buildPolarChart(data) {
    const ctx = document.getElementById('polarChart');

    console.log(data)

    let findTotal = data.find((obs) => {
        return obs.occupation === "Total";
    });
    console.log(findTotal)

    delete findTotal.occupation
    delete findTotal.code
    delete findTotal.total;

    const labels = Object.keys(findTotal);
    const dataVector = Object.values(findTotal);

    const injuryTypeData = {
        labels: labels,
        datasets: [{
          label: 'Count of injury cause',
          data: dataVector,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)',
            'rgb(160, 230, 180)',
          ]
        }]
    };
    
    const config = {
        type: 'polarArea',
        data: injuryTypeData,
    };
    
    new Chart(ctx, config);
}

