var ButtonSwitch = 0;
var socket = io();

$('#Up-Left').on('click',function() {
	ButtonSwitch = 1;
	send();
});
$('#Up').on('click',function() {
	ButtonSwitch = 2;
	send();
});
$('#Up-Right').on('click',function() {
	ButtonSwitch = 3;
	send();
});
$('#Left').on('click',function() {
	ButtonSwitch = 4;
	send();
});
$('#Stop').on('click',function() {
	ButtonSwitch = 0;
	send();
});
$('#Right').on('click',function() {
	ButtonSwitch = 5;
	send();
});
$('#Down-Right').on('click',function() {
	ButtonSwitch = 6;
	send();
});
$('#Down').on('click',function() {
	ButtonSwitch = 7;
	send();
});
$('#Down-Left').on('click',function() {
	ButtonSwitch = 8;
	send();
});

socket.on('Connected', function(data) {
	console.log(data.msg);
});

socket.on("disconnect", () => {
    console.log('Disconnected')
    ButtonSwitch = 0;
    send();
});

function send() {
	socket.emit('ButtonEvent', {
		number: ButtonSwitch,
	});
}

var ctx = document.getElementById('img').getContext('2d');
socket.on("image", function(info) {
	if (info.image) {
		var img = new Image();
		img.onload = function () {
			ctx.drawImage(img, 0, 0);
		};
		img.src = 'data:image/jpg;base64,' + info.buffer;   
    }
});

window.addEventListener('keydown', function(e){
    if (e.key==='ArrowUp')
		ButtonSwitch = 2;
	else if (e.key === 'ArrowDown')
		ButtonSwitch = 7;
	else if (e.key === 'ArrowLeft') 
		ButtonSwitch = 4;
	else if (e.key === 'ArrowRight')
		ButtonSwitch = 5;
	send()
	console.log(ButtonSwitch)
});
window.addEventListener('keyup', function(e){
	ButtonSwitch = 0;
	console.log(ButtonSwitch)
})
