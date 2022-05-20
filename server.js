const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


var dsphong = [];

function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].roomname === obj.roomname) {
      return true;
    }
  }

  return false;
}


function getObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].roomname === obj.roomname) {
      return i;
    }
  }
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});


io.on('connection', socket => {
  io.emit('dsp', dsphong)


  console.log('a user connected ' + socket.id);
  io.to(socket.id).emit('user-chat', ({ ten: 'Hệ thống', message: 'Hãy tham gia phòng' }))

  socket.on('toado', data => {
    socket.to(data.room).emit('danhco', data.toado);
  });


  socket.on('chat', data => {
    io.to(data.room).emit('user-chat', data);
  });

  socket.on('thamgiaphong', (tenphong, ten2, cb) => {
    const obj1 = { roomname: tenphong, soluong: 1 }
    if (containsObject(obj1, dsphong) && dsphong[getObject(obj1, dsphong)].soluong == 2) {

      cb({ ten: `${ten2}`, message: `Phòng đã đầy` })
      io.to(socket.id).emit('phongday', true);
      io.emit('dsp', dsphong)
    } else
      if (containsObject(obj1, dsphong) && dsphong[getObject(obj1, dsphong)].soluong == 1) {

        socket.join(tenphong);
        cb({ ten: `${ten2}`, message: `Đã vào phòng ${tenphong}, trận đấu bắt đầu, bạn đi sau` })
        socket.broadcast.to(tenphong).emit('user-chat', { ten: 'Hệ thống', message: `${ten2} vừa vào phòng, trận đấu bắt đầu, bạn đi trước` });
        dsphong[getObject(obj1, dsphong)].soluong = 2;
        socket.to(tenphong).emit('batdau', true);
        io.emit('dsp', dsphong)
      } else
        if (containsObject(obj1, dsphong) == false) {

          socket.join(tenphong);
          cb({ ten: `${ten2}`, message: `Đã vào phòng ${tenphong}` })
          socket.broadcast.to(tenphong).emit('user-chat', { ten: 'Hệ thống', message: `${ten2} vừa vào phòng` });
          dsphong.push(obj1);
          io.emit('dsp', dsphong)
        }

  });

  socket.on('outphong', (tenphong, ten2, cb) => {
    const obj3 = {roomname: tenphong, soluong: 1 }
    if (containsObject(obj3, dsphong) && dsphong[getObject(obj3, dsphong)].soluong == 2) {
      socket.leave(tenphong);
      cb({ ten: `${ten2}`, message: `Đã thoát phòng ${tenphong}` })
      io.in(tenphong).emit('user-chat', { ten: 'Hệ thống', message: `${ten2} vừa thoát phòng` });
      dsphong[getObject(obj3, dsphong)].soluong = 1
      io.emit('dsp', dsphong)
      
    } else

      if (containsObject(obj3, dsphong) && dsphong[getObject(obj3, dsphong)].soluong == 1) {
        socket.leave(tenphong);
        cb({ ten: `${ten2}`, message: `Đã thoát phòng ${tenphong}` })
        io.in(tenphong).emit('user-chat', { ten: 'Hệ thống', message: `${ten2} vừa thoát phòng` });
        dsphong.splice(dsphong[getObject(obj3, dsphong)], 1)
        io.emit('dsp', dsphong)
      }
      socket.to(tenphong).emit('matketnoi', true);
  });

  socket.on("disconnecting", (reason) => {

    for (const room of socket.rooms) {
      if (room !== socket.id) {
        const obj3 = {roomname: room, soluong: 1 }
    if (containsObject(obj3, dsphong) && dsphong[getObject(obj3, dsphong)].soluong == 2) {
      socket.leave(room);
      dsphong[getObject(obj3, dsphong)].soluong = 1
      io.emit('dsp', dsphong)
    } else

      if (containsObject(obj3, dsphong) && dsphong[getObject(obj3, dsphong)].soluong == 1) {
        socket.leave(room);
        dsphong.splice(dsphong[getObject(obj3, dsphong)], 1)
        io.emit('dsp', dsphong)
      }
        socket.to(room).emit('matketnoi', true);
      }
    }
    io.emit('dsp', dsphong)
  });
});





