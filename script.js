"use strict";

let engine;
let ctx;

// 画像配列
let images = [];

function rand(v) {
    return Math.floor(Math.random() * v);
}

// 初期化関数
function init() {

    // 画像読み込み
    images[0] = new Image();
    images[0].src = "azuki.png";

    images[1] = new Image();
    images[1].src = "ichigo.png";

    images[2] = new Image();
    images[2].src = "kinako.png";

    images[3] = new Image();
    images[3].src = "kokutou.png";

    images[4] = new Image();
    images[4].src = "mitarashi.png";

    let r;

    engine = new Engine(0, 0, 600, 800, 0, 9.8);

    // 右の壁
    r = new RectangleEntity(500, 50, 50, 400);
    r.color = "green";
    engine.entities.push(r);

    // 左の壁
    r = new RectangleEntity(0, 50, 50, 400);
    r.color = "yellow";
    engine.entities.push(r);

    // 斜面1
    r = new LineEntity(50, 300, 400, 350);
    r.color = "orange";
    engine.entities.push(r);

    // 斜面2
    r = new LineEntity(500, 400, 100, 450);
    r.color = "orange";
    engine.entities.push(r);

    // 固定円
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 3; j++) {

            r = new CircleEntity(
            rand(400) + 50,
            rand(200),
            15,
             BodyDynamic
        );
            r.img = images[j % 5];

            engine.entities.push(r);
        }
    }

    // 動く円
    for (let i = 0; i < 20; i++) {

        r = new CircleEntity(
            rand(400) + 50,
            rand(200),
            25,
            BodyDynamic
        );

        // ランダム画像
        r.img = images[rand(5)];

        r.velocity.x = rand(10) - 5;
        r.velocity.y = rand(10) - 5;

        engine.entities.push(r);
    }

    ctx = document.getElementById("canvas").getContext("2d");

    setInterval(tick, 50);
}

// メインループ
function tick() {
    engine.step(0.01);
    repaint();
}

// 描画
function repaint() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 600, 600);

    engine.entities.forEach((e) => {

        ctx.fillStyle = e.color;
        ctx.strokeStyle = e.color;

        switch (e.shape) {

            case ShapeRectangle:

                ctx.fillRect(
                    e.x,
                    e.y,
                    e.w,
                    e.h
                );

                break;

            case ShapeCircle:

                if (e.img) {

                    // 円形に切り抜いて表示
                    ctx.save();

                    ctx.beginPath();
                    ctx.arc(
                        e.x,
                        e.y,
                        e.radius,
                        0,
                        Math.PI * 2
                    );
                    ctx.clip();

                    ctx.drawImage(
                        e.img,
                        e.x - e.radius,
                        e.y - e.radius,
                        e.radius * 2,
                        e.radius * 2
                    );

                    ctx.restore();
                }

                break;

            case ShapeLine:

                ctx.beginPath();
                ctx.moveTo(e.x0, e.y0);
                ctx.lineTo(e.x1, e.y1);
                ctx.stroke();

                break;
        }
    });
}