

var banco = document.getElementById('banco');
var kichthuoc = 20;
var toado = [0, 0];
var turn = true;
var lock = true;

function batdau(){lock=false;};


function khoitao() {

    for (var i = 1; i <= kichthuoc; i++) {
        var cot = document.createElement('tr');
        banco.appendChild(cot);
        for (var j = 1; j <= kichthuoc; j++) {
            var oco = document.createElement('td');
            cot.appendChild(oco);
            oco.addEventListener('click', function () {
                toado = [Number(this.getAttribute('x')), Number(this.getAttribute('y'))];

                if (this.innerHTML == '') {
                    if (turn && !lock) {
                        this.innerHTML = '<b style="color:red">X';
                        turn = false;
                        lock = true;
                        banco.className = 'player2'
                        socket.emit('toado', {toado,room});
                    } else if (!turn && !lock) {
                        this.innerHTML = '<b style="color:green">O'
                        turn = true;
                        lock = true;
                        banco.className = 'player1'
                        socket.emit('toado', {toado,room});
                    }
                }
            })
        }

    }
}
khoitao();

function reset() {
    for (var i = 0; i < td.length; i++) {
        td[i].innerHTML = '';
    }
}


socket.on('matketnoi', a => {
    if (a) {
    reset();}
})
// var btnReset = document.getElementById('btn-reset');
// btnReset.addEventListener('click', function () {
//     reset();
// });


function click() {
    var check = false;
    for (var x = 0; x < kichthuoc; x++) {
        for (var y = 0; y < kichthuoc; y++) {
            var temp = td[x * kichthuoc + y].innerHTML;
            if (temp == '<b style="color:red">X</b>' || temp == '<b style="color:green">O</b>') {
                if (Ngang(x, y) == 1 || Doc(x, y) == 1 || cheoLen(x, y) == 1 || cheoXuong(x, y) == 1) {
                    if (temp == '<b style="color:red">X</b>') {
                        alert("X WIN");
                        check = true;
                        reset();
                    } else {
                        alert("O WIN!");
                        check = true;
                        reset();
                    }
                }
            } else {
                continue;
            }
            if (check)
                break;
        }
        if (check)
            break;
    }

}

var td = document.getElementsByTagName('td');


function setvalue() {
    var i = 0,
        j = 0;
    for (var d = 0; d < kichthuoc * kichthuoc; d++) {
        td[d].setAttribute("x", i);
        td[d].setAttribute("y", j);
        td[d].addEventListener("click", click);
        j++;
        if ((d + 1) % kichthuoc == 0) {
            i++;
            j = 0;
        }
    }
}
setvalue();

// Check Ngang 
function Ngang(x, y) {
    var dem = 1;
    for (var t = 1; t < 5; t++) { // Check bên trái
        if ((y - t) >= 0) { // Giới hạn
            if (td[x * kichthuoc + (y - t)].innerHTML == td[x * kichthuoc + y].innerHTML) {
                dem++;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    for (var t = 1; t < 5; t++) { // Check bên phải
        if (y + t < kichthuoc) { // Giới hạn
            if (td[x * kichthuoc + (y + t)].innerHTML == td[x * kichthuoc + y].innerHTML) {
                dem++;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    if (dem >= 5) {
        return 1;
    } else {
        return 0;
    }
}

// Check Doc
function Doc(x, y) {
    var dem = 1;
    for (var t = 1; t < 5; t++) { // Check phía trên
        if ((x - t) >= 0) { // Giới hạn
            if (td[(x - t) * kichthuoc + y].innerHTML == td[x * kichthuoc + y].innerHTML) {
                dem++;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    for (var t = 1; t < 5; t++) { // Check phía dưới
        if (x + t < kichthuoc) { // Giới hạn
            if (td[(x + t) * kichthuoc + y].innerHTML == td[x * kichthuoc + y].innerHTML) {
                dem++;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    if (dem >= 5) {
        return 1;
    } else {
        return 0;
    }
}

// Check cheo
function cheoLen(x, y) {
    var dem = 1;
    for (var t = 1; t < 5; t++) { // Check phía trên
        if ((x - t) >= 0 && (y + t) < kichthuoc) { // Giới hạn
            if (td[(x - t) * kichthuoc + (y + t)].innerHTML == td[x * kichthuoc + y].innerHTML) {
                dem++;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    for (var t = 1; t < 5; t++) { // Check phía dưới
        if (x + t < kichthuoc && (y - t) >= 0) { // Giới hạn
            if (td[(x + t) * kichthuoc + (y - t)].innerHTML == td[x * kichthuoc + y].innerHTML) {
                dem++;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    if (dem >= 5) {
        return 1;
    } else {
        return 0;
    }
}

function cheoXuong(x, y) {
    var dem = 1;
    for (var t = 1; t < 5; t++) { // Check phía trên
        if ((x + t) < kichthuoc && (y + t) < kichthuoc) { // Giới hạn
            if (td[(x + t) * kichthuoc + (y + t)].innerHTML == td[x * kichthuoc + y].innerHTML) {
                dem++;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    for (var t = 1; t < 5; t++) { // Check phía dưới
        if (x - t >= 0 && (y - t) >= 0) { // Giới hạn
            if (td[(x - t) * kichthuoc + (y - t)].innerHTML == td[x * kichthuoc + y].innerHTML) {
                dem++;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    if (dem >= 5) {
        return 1;
    } else {
        return 0;
    }
}




socket.on('danhco',danh => {
    if (turn) {
        td[danh[0] * kichthuoc + danh[1]].innerHTML = '<b style="color:red">X';
        turn = false;
        lock = false;
        banco.className = 'player2'
        click();
    } else {
        td[danh[0] * kichthuoc + danh[1]].innerHTML = '<b style="color:green">O';
        turn = true;
        lock = false;
        banco.className = 'player1'
        click();
    }

})
socket.on('batdau', a => {
    if (a) batdau();
    console.log(a)
})
