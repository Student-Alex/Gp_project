

// Create the avg stress level chart
axios.get('https://wegel.student.utwente.nl/alex/api/stress/').then(
  response => {
    let stresslevels = response.data;
    let labels = [];
    let data = [];
    let redenen = [];

    // sorting received stresslevels by id (asc)
    stresslevels.sort((a, b) => {
      console.log(`ID a: ${a.id}, b: ${b.id}, ${a.id > b.id}`);
      return a.id > b.id ? 1 : -1;
    });

    for (const stresslevel of stresslevels) {
      labels.push(stresslevel.tijd);
      data.push(stresslevel.stresslevel);
    }

    const config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Avg. Stress level',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }

    new Chart(document.getElementById('chart1'), config);

    let i = 0;
    var stresssum = 0;
    for (let i = 0, len = stresslevels.length; i < len; i++) {
      stresssum += stresslevels[i].stresslevel;
    }
    stressavg = stresssum / stresslevels.length;
    console.log(stressavg)

    document.getElementById('chart1Average').textContent = stressavg.toFixed(1);
  }
)

  const currentTimeMillis = new Date().getTime();
  const endOfToday = moment(new Date()).endOf('day').valueOf();
  // console.log(endOfToday.valueOf());
  const millisInDay = 86400000;
  const body = {
    aggregateBy: [
      {
        dataSourceId: "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes"
      },
    ],
    bucketByTime: {
      durationMillis: millisInDay
    },
    startTimeMillis: endOfToday - (millisInDay * 5) + 1,
    endTimeMillis: endOfToday
  };

  const token = 'ya29.a0AbVbY6O2J1DvfXjS6B656bHFgQ26MuMyuX8X10r6aCXLXmKYdsPlCJAssaIPLCGx1DA2a2hN9mji9u-xzuoUqwRRPBO93TzGoCJniiVyx2r3PwL7gDsAbLMYUYwEsWkl4ytNv1CAaY4a7pqUcxUAyJBjmSfxhRoaCgYKAVASARASFQFWKvPlVzvKYpsdTFgSm7O5k50fgw0166';
  const request = new Request("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", { method: "POST", body: JSON.stringify(body), headers: { "Authorization": 'Bearer ' + token } });

  // fetch(request)
  //   .then(json => json.json())
  //   .then(content => {
  //     console.log(content);
  //     handleMovementRequest(content);
  //   });

  drawActiveMinutesChart(["27/06", "28/06", "29/06"], [187, 112, 55]);


    // index of the acrive minutes in the dataset per day
  const activeMinutesIndex = 0;
  const sleepTimeIndex = 1;
  const stepCountIndex = 2;

  function handleMovementRequest(content) {
    let labels = [];
    let activeMinutesData = [];
    let sleepTimeData = [];
    let stepCountData = [];

    if (!content.hasOwnProperty ("bucket")){
      console.log("error")
      return;
    }
    // looping through all received days and retrieving the labels/data
    content.bucket.forEach(day => {
      // extracting the date and add that to the labels (Jun 14th) (see https://momentjs.com/docs/#/displaying/format/ for formatting options)
      labels.push(moment(parseInt(day.startTimeMillis)).format('DD/MM'));

      activeMinutesData.push(day.dataset[activeMinutesIndex]?.point[0]?.value[0].intVal ?? 0);
      sleepTimeData.push(day.dataset[sleepTimeIndex]?.point[0]?.value[0].intVal ?? 0);
      stepCountData.push(day.dataset[stepCountIndex]?.point[0]?.value[0].intVal ?? 0);
    });

    console.log('Retrieved active minutes data: ', activeMinutesData);
    console.log('Retrieved sleepTime data: ', sleepTimeData);
    console.log('Retrieved stepcount data: ', stepCountData);0

   drawActiveMinutesChart(labels, activeMinutesData);
  }

  function drawActiveMinutesChart(labels, data) {
    const config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Active minutes',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }

    new Chart(document.getElementById('chart2'), config);
  }




