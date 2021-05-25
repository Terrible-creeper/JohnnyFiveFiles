var express = require('express'); //宣告express套件
var app = express();
app.use(express.static('/home/pi/JohnnyFiveFile/www')); //將靜態檔案放入express內

var io = require('socket.io') (app.listen(3000), { //宣告socket.io套件且監聽連結埠3000
  pingInterval: 100,
  pingTimeout: 500
  //客戶端必須於 pingInterval 毫秒內傳送一次Ping封包，
  //若 pingTimeout 毫秒內未收到Pong封包，將會視為斷線
});

var {Board, Motor} = require("johnny-five"); //宣告控制Arduino的套件 "JohnnyFive"
var board = new Board({port:"/dev/ttyUSB0",repl: false}); //連接至序列埠"/dev/ttyUSB0"，且關閉REPL模式
//關閉REPL模式可使，Linux內的Systemctl正常開啟此程式

var SerialPort = require("serialport"); //宣告與感光模組連接的套件 "SerialPort"
var Readline = require('@serialport/parser-readline'); 
var parser = new Readline()
var port = new SerialPort('/dev/ttyACM0', {baudRate: 115200}); //連線至序列埠"/dev/ttyACM0"

port.on("open", (err) => {
  console.log('serial port open'); //如果正常開啟 將會顯示"SerialPort已開啟"
  if(err){
      console.log("no serial device found") //如果錯誤 將會顯示"找不到裝置"
  }
});

port.pipe(parser) //解譯從感光模組傳送過來的 Base64 資料
parser.on('data', line =>{
    io.emit('image', { image: true, buffer:line }); //將 Base64 資料丟至客戶端
});

board.on("ready", function() {
    this.pinMode(25,1) //將25Pin腳位設為OUTPUT
    this.digitalWrite(25,1) //25Pin腳位輸出訊號1
    this.pinMode(24,1)
    this.digitalWrite(24,1)
    this.pinMode(26,1)
    this.digitalWrite(26,1) 
    this.pinMode(27,1) 
    this.digitalWrite(27,1) 

    const motorRF = new Motor({pins: { dir: 2, pwm: 3 }, invertPWM: true})
    const motorRB = new Motor({pins: { dir: 4, pwm: 5 }, invertPWM: true})
    const motorLF = new Motor({pins: { dir: 7, pwm: 6 }, invertPWM: true})
    const motorLB = new Motor({pins: { dir: 9, pwm: 8 }, invertPWM: true})

    io.on('connection', function(socket) { //伺服端讀取客戶端的"connection"訊息
      socket.emit('Connected', { //送出"Connected"訊息
        msg: 'Connection Ready！', //"Commected"訊息中包含"msg"資料
      });

	  socket.on('disconnect', (reason) => { //當伺服端與客戶端斷線，顯示斷線原因並停止車子
	    console.log(reason);
		    motorRF.stop(); //停止馬達
        motorRB.stop();
        motorLF.stop();
        motorLB.stop();
	  });
	  
      socket.on('ButtonEvent', function(data) { //伺服端讀取客戶端的"ButtonEvent"訊息
        console.log('ButtonSwitch: ' + data.number);
        switch(data.number) {
          case 0: //停止
            motorRF.stop()
            motorRB.stop()
            motorLF.stop()
            motorLB.stop()
            break;
          case 1://左前
            motorRF.forward(100)
            motorRB.forward(100)
            motorLF.forward(75)
            motorLB.forward(75)
            break;
          case 2://前
            motorRF.forward(100)
            motorRB.forward(100)
            motorLF.forward(100)
            motorLB.forward(100)
            break;
          case 3://右前
            motorRF.forward(75)
            motorRB.forward(75)
            motorLF.forward(100)
            motorLB.forward(100)
            break;
          case 4://左
            motorRF.forward(100)
            motorRB.forward(100)
            motorLF.forward(50)
            motorLB.forward(50)
            break;
          case 5://右
            motorRF.forward(50)
            motorRB.forward(50)
            motorLF.forward(100)
            motorLB.forward(100)
            break;
          case 6://右後
            motorRF.rev(75)
            motorRB.rev(75)
            motorLF.rev(100)
            motorLB.rev(100)
            break;
          case 7://後
            motorRF.rev(100)
            motorRB.rev(100)
            motorLF.rev(100)
            motorLB.rev(100)
            break;
          case 8://左後
            motorRF.rev(100)
            motorRB.rev(100)
            motorLF.rev(75)
            motorLB.rev(75)
            break;                                                    
        }
      });
    });
});