
const ten = prompt('Nhập tên');
const chat = document.querySelector('#boxchat');
const chatmess = document.querySelector('#chatmess');
chat.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatmess.value;
    socket.emit('chat', {
        ten, message, room
    });
    chatmess.value = '';
})
const messages = document.querySelector('#messages');
const dsphongs = document.querySelector('#dsphong');

function phongday() { room = ''; };


socket.on('phongday', a => {
    if (a) phongday();
})


socket.on('user-chat', (message) => {
    const chatItem = document.createElement('li');
    chatItem.textContent = message.ten + ' : ' + message.message;
    messages.appendChild(chatItem);
})

socket.on('dsp', dsphong => {
    var i;
    dsphongs.innerHTML ='';
    for (i = 0; i < dsphong.length; i++) {
        const chatItem = document.createElement('li');
        chatItem.textContent = dsphong[i].roomname + ' : ' + dsphong[i].soluong + '/2';
        dsphongs.appendChild(chatItem);
    }
}

)

const room2 = document.querySelector('#phong');
const rooms = document.querySelector('#roommes');
room2.addEventListener('submit', (e) => {
    e.preventDefault();
    const tenphong = rooms.value;
    room = tenphong;
    socket.emit('thamgiaphong', tenphong, ten, message => {
        const chatItem = document.createElement('li');
        chatItem.textContent = message.message;
        messages.appendChild(chatItem);
    });
    console.log(room);
    rooms.value = '';

    document.getElementById('roomform').style.display = 'none';
    document.getElementById('outroom').style.display = 'flex';
})
var tenphong = room;
document.getElementById('outroom').addEventListener('click', (e) => {
    var tenphong = room;
    socket.emit('outphong', tenphong, ten, message => {
        const chatItem = document.createElement('li');
        chatItem.textContent = message.message;
        messages.appendChild(chatItem);
    });
    room = '';
    document.getElementById('roomform').style.display = 'flex';
    document.getElementById('outroom').style.display = 'none';
})

socket.on('matketnoi', a => {
    if (a) {
        const chatItem = document.createElement('li');
        chatItem.textContent = 'Người chơi còn lại đã mất kết nối';
        messages.appendChild(chatItem);
    }
})

