$( document ).ready(() => {
  let doorCar = -1;
  let selectedDoor = -1;
  let telledDoor = -1;
  let isShow = [false,false,false];
  
  // DOM Element
  const doorpic = [ $('#idoor1'), $('#idoor2'), $('#idoor3') ] ;
  const wcount = $('#wcount');
  const lcount = $('#lcount');
  const tcount = $('#tcount');
  const percentw = $('#percentw');
  const status = $('#status');
  const simulateAtt = $('#simulateAtt');
  const gameNum = $('#gameNum');
  const simulateGroup = $('#simulateAtt > .input-group');
  
  // Statistic
  let totalGame = 0;
  let winGame = 0;
  let detailedTotal = [[0,0],[0,0],[0,0]];
  let detailedWin = [[0,0],[0,0],[0,0]];
  
  $('#ssc').hide();
  $('#door').hide();
  
  var ctx = $('#wgraph');
  var wchart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Door1", "Door2", "Door3"],
      datasets: [{
        label: 'Stay',
        data: [0, 0, 0],
        backgroundColor: '#AC3B61',
        borderColor: '#AC3B61',
        borderWidth: 1
      }, {
        label: 'Switch',
        data: [0, 0, 0],
        backgroundColor: '#123C69',
        borderColor: '#123C69',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true,
            max: 100
          }
        }]
      },
      title: {
        text: '% of Win',
        display: true,
        fontSize: 23,
        fontFamily: "'Play', 'sans-serif'"
      }
    }
  });
  
  function renderStatistic(){
    //update main statistic
    wcount.text(winGame);
    lcount.text(totalGame-winGame);
    tcount.text(totalGame);
    if(totalGame){
      percentw.text((winGame/totalGame*100).toFixed(2));
    }else{
      percentw.text(0);
    }
    
    //update chart data
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 2; j++){
        if(detailedTotal[i][j]){
          wchart.data.datasets[j].data[i] = detailedWin[i][j]/detailedTotal[i][j]*100;
        }else{
          wchart.data.datasets[j].data[i] = 0;
        }
      }
    }
    wchart.update();
  }
  
  renderStatistic();
  
  function renderDoor(){
    for(let i = 0; i < 3; i++){
      if(isShow[i]){
        if(doorCar-1==i){
          doorpic[i].attr('src','racing.png');
        }else{
          doorpic[i].attr('src','goat.png');
        }
      }else{
        doorpic[i].attr('src','door.png');
      }
      
      if(selectedDoor-1==i){
        doorpic[i].addClass('dselected');
      }else{
        doorpic[i].removeClass('dselected');
      }
    }
  }
  
  function printStatus(str){
    status.text(str);
  }

  function toggleDoor(callback){
    $('#door > .btn').prop('disabled', (i, v) => ( !v ));
    $('#door').fadeToggle(300,"swing",callback);
  }
  
  function toggleSW(callback){
    $('#ssc > .btn').prop('disabled', (i, v) => ( !v ));
    $('#ssc').fadeToggle(300,"swing",callback);
  }
  
  function toggleControl(callback){
    $('#control > .btn').prop('disabled', (i, v) => ( !v ));
    $('#control').fadeToggle(300,"swing",callback);
  }
  
  function newGame(display = true){
    isShow[0] = false;
    isShow[1] = false;
    isShow[2] = false;
    selectedDoor = -1;
    doorCar = Math.floor(Math.random()*3)+1;
    if(display){
      simulateAtt.collapse('hide');
      renderDoor(); 
      printStatus('Select your door...');
      simulateGroup.removeClass('num-invalid');
    }
  }
  
  function resetStatistic(){
    totalGame = 0;
    winGame = 0;
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 2; j++){
        detailedTotal[i][j] = 0;
        detailedWin[i][j] = 0;
      }
    }
    renderStatistic();
    printStatus('Welcome to the monty hall game!');
  }
  
  function simulate(times){
    newGame();
    for(let i = 0; i < times; i++){
      newGame(false);
      play(Math.floor(Math.random()*3)+1,false);
      play2(Math.floor(Math.random()*2),false);
    }
    renderStatistic();
    printStatus('Welcome to the monty hall game!');
  }
  
  function play(usrc, display = true){
    selectedDoor = usrc;
    do{
      telledDoor = Math.floor(Math.random()*3)+1;
    }while(telledDoor==usrc||telledDoor==doorCar);
    isShow[telledDoor-1] = true;
    
    if(display){
      printStatus('Door ' + telledDoor + ' has a goat.');
      renderDoor();
      toggleDoor(toggleSW);
    }
  }
  
  function play2(usrc, display = true){ 
    let oldSelected = selectedDoor;
    if(usrc==1){
      for(var i = 1; i <= 3; i++){
        if(i!=selectedDoor&&i!=telledDoor){
          selectedDoor = i;
          break;
        }
      }
    }
    if(selectedDoor==doorCar){
      if(display){
        printStatus('Congratulation, you win!');
      }
      detailedWin[selectedDoor-1][usrc]++;
      winGame++;
    }else{
      if(display){
        printStatus('Sorry, you get a goat...');
      }
    }
    detailedTotal[selectedDoor-1][usrc]++;
    totalGame++;
    
    for(var i = 0; i < 3; i++){
      isShow[i] = true;
    }
    
    if(display){
      toggleSW(toggleControl);
      renderStatistic();
      renderDoor();
    }
  }

  $('#door1').click(() => {
    play(1);
  });

  $('#door2').click(() => {
    play(2);
  });

  $('#door3').click(() =>{
    play(3);
  });
  
  $('#stay').click(() =>{
    play2(0);
  });
  
  $('#swap').click(() =>{
    play2(1);
  });
  
  $('#new').click( ()=>{
    newGame();
    toggleControl(toggleDoor);
  });
  
  $('#reset').click( () =>{
    resetStatistic();
  });
  
  $('#simulate').click(() => {
    let times = parseInt(gameNum.val());
    if(times>0){
      gameNum.val('');
      simulate(times);
    }else{
      simulateGroup.addClass('num-invalid');
    }
  });
});