//board
//mengatur panjang dan lebar pada board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
//mengatur dino dalam board
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//cactus
let cactusArray = []; //karena menggunakan lebih dari 1 cactus

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//membuat physics atau membuat ruang pada cactus yang akan muncul
let velocityX = -8; // membuat cactus bergerak ke kiri atau sesua inputan angka
let velocityY = 0; //membuat cactus agar tidak jumping
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //untuk digunakan menggambar pada board

    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); // 1000 milidetik = 1 detik, jadi setiap detik memanggil place Cactus function untuk membuat cactus
    document.addEventListener("keydown", moveDino); //setiap menekan key akan memanggil function moveDino dan juga membuat dino melompat sesuai key yang sudah di setting
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height); //membuat jarak pada cactus dan memnghapus cactus yang tidak di perlukan

    //dino //untuk meng update animasi pada gambar
    velocityY += gravity; //berfungsi pada program movedino
    dino.y = Math.min(dino.y + velocityY, dinoY); //menerapkan gravitasi pada dinosaurus saat ini, pastikan tidak melebihi tanah
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus //membuat pengulangan untuk memunculkan cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX; //membuat animasi bergerak seperti yang ada di inputan velocity
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) { //untuk pengulangan kita memerlukan detect collision untuk dino dan cactus
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20); //menaruh score pada board
}

function moveDino(e) { //function untuk animasi dino
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) { // membuat dino melompat dengan mengubah dinoY
        //lompatan supaya harus menyentuh bawah
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}

function placeCactus() { //membuat function untuk menaruh cactus
    if (gameOver) { 
        return;
    }

    //program untuk place cactus
    let cactus = {
        img : null, //null karena belum memnetukan akan menggunakan img cactus yang mana
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); // mat random meemberikan nomor dari 0 - 0.99999...

    if (placeCactusChance > .90) { // 10% untuk memunculkan cactus 3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { // 30% untuk memunculkan cactus 2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { // 70% untuk memunculkan cactus 1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }
    //membuat limit cactus pada array karena jika cactus terus bergerak ke kiri maka kita memiliki banyak cactus dan bisa menambah memori
    if (cactusArray.length > 5) {
        cactusArray.shift(); //menghapus elemen pertama dari array sehingga array tidak terus bertambah
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //pojok kiri atas a tidak sampai ke pojok kanan atas b
           a.x + a.width > b.x &&   //pojok kanan bawah a tidak sampai ke pojok kiri atas b
           a.y < b.y + b.height &&  //pojok kiri atas a tidak sampai ke pojok kiri bawah b
           a.y + a.height > b.y;    //pojok kiri bawah a melewati pojok kiri atas b
}