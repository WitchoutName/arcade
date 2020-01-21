const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 1000;
canvas.style = 'border: 1px solid black';
document.getElementById('game').append(canvas);

    let Grid = {
        paint: function() {
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            for(let i = 0; i <= 50; i++){
                ctx.moveTo(50 * i, 0);
                ctx.lineTo(50 * i, 1000);
            }
            for(let i = 0; i <= 50; i++){
                ctx.moveTo(0, 50 * i);
                ctx.lineTo(1000, 50 * i);
            }
            ctx.stroke();
        }
    }


    class BodyPiece {
        constructor(x, y){
            this.x = x;
            this.y = y;
            this.image = new Image();
            this.cornerPosition = [
                [this.x-25,this.y-25],
                [this.x+25,this.y-25],
                [this.x-25,this.y+25],
                [this.x+25,this.y+25], 
            ];
            }
        paint(){
            ctx.drawImage(this.image, this.x - 25 + 0.25, this.y - 25 + 0.25, 50, 50);
        }

    }

    let head = {
        x: 350 - 25,
        y: 350 - 25,
        direction: 3,
        speed: 16,
        time: 0,
        image: new Image(50, 50),
        isDead: false,
        paint: function(){
            ctx.drawImage(this.image, this.x - 25 + 0.25, this.y - 25 + 0.25, 50, 50);
        },
        input: function(){
            document.addEventListener("keydown", checkKeyPress, false);
            function checkKeyPress(key) {
                if (key.keyCode == "65" && head.direction != 3) {
                    head.direction = 1;
                    head.image.src = "thomas/thomas3.png";
                    if(body[1] != null)
                        body[1].image.src = "wagon/wagon1.png"
                }
                else if (key.keyCode == "87" && head.direction != 4) {
                    head.direction = 2;
                    head.image.src = "thomas/thomas4.png";
                    if(body[1] != null)
                        body[1].image.src = "wagon/wagon2.png"
                }
                else if (key.keyCode == "68" && head.direction != 1) {
                    head.direction = 3;
                    head.image.src = "thomas/thomas1.png";
                    if(body[1] != null)
                        body[1].image.src = "wagon/wagon3.png"
                }
                else if (key.keyCode == "83" && head.direction != 2) {
                    head.direction = 4;
                    head.image.src = "thomas/thomas2.png";
                    if(body[1] != null)
                        body[1].image.src = "wagon/wagon4.png"
                }
                }   
             },   
        move: function(){
                switch(head.direction){
                case 1: head.x -= 50;
                break;
                case 2: head.y -= 50;
                break;
                case 3: head.x += 50;
                break;
                case 4: head.y += 50;
                break;
                }            
            }
        } 

    let food = {
            x: 0,
            y: 0,
            image: new Image(),
            paint: function(){
                this.image.src = "thomas/food.png"
                ctx.drawImage(this.image, this.x - 25 + 0.25, this.y - 25 + 0.25, 50, 50);
            },
            relocate: function(){
                let isOkLocation = false;
                while(isOkLocation == false){
                    this.x = ((Math.floor(Math.random() * 20) + 1) * 50) - 25;
                    this.y = ((Math.floor(Math.random() * 20) + 1) * 50) - 25;
    
                    for(let i = 0; i < body.length; i++){
                        if(this.x != body[i].x && this.y != body[i].y)
                            isOkLocation = true;
                    }
                }
    
    
            },
            isEaten: function(){
                if(this.x === head.x && this.y === head.y){
                    game.score += 100;
                    body.push(new BodyPiece(-25, -25))
                    lastBody.push(new BodyPiece(-25, -25))
                    if(body.length == 2){
                        switch(head.direction){
                            case 1:  body[1].image.src = "wagon/wagon1.png";
                            break;
                            case 2:  body[1].image.src = "wagon/wagon2.png";
                            break;
                            case 3:  body[1].image.src = "wagon/wagon3.png";
                            break;
                            case 4:  body[1].image.src = "wagon/wagon4.png";
                            break;
                        }
                    }
                    this.relocate();
                }
                this.paint();
            },
        },

    lastBody = []
    body = []
    let i = 0;

    function copyBody(){
        for(let i = 1; i < lastBody.length; i++){
            lastBody[i].x = body[i].x;
            lastBody[i].y = body[i].y;
            lastBody[i].image.src = body[i].image.src;
        } 
    }

    function refreshBody(){
        for(let i = 1; i < body.length; i++){
            body[i].x = lastBody[i-1].x;
            body[i].y = lastBody[i-1].y;
            if(i>1)
                body[i].image.src = lastBody[i-1].image.src;
        }    
    }
    function paintbody(){
        for(let i = 1; i <= body.length-1; i++){
            body[i].paint()
        } 
    }
    function isDead(){
        let die = false
        for(let i = 2; i < body.length - 1; i++){
            //console.log((head.x + 25) / 50+" "+(head.y + 25) / 50+" == "+(body[i].x + 25) / 50+" "+(body[i].y + 25) / 50)
            if((head.x == body[i].x) && (head.y == body[i].y)){
                game.dieImage.src = "thomas/die.jpg"
                die = true
            }
        }
        if(head.x < 0 || head.x > 1000 || head.y < 0 || head.y > 1000){
            game.dieImage.src = "thomas/leave.jpg"
            die = true;
        }
        return die;
    }

let game = {
    score: 0,
    bg: new Image(),
    dieImage: new Image(),
    start: function(){
        this.bg.src = "thomas/bg.png"
        head.image.src = "thomas/thomas1.png";
        // paints head
        head.paint();
        // set up head input, head image rotation is based on direction
        head.input();
        ctx.drawImage(this.bg, 0,0,1000,1000);
        body.push(head);
        lastBody.push(head);
        // relocate food, until its location doesnt differs from snakes body
        food.relocate();
        // paints food
        food.paint();
        setInterval(() => {this.repeat()}, 100)


    },
    repeat: function(){
        let die = false;
        // checks, if is snake dead by checking head location compared to the body and canvas
        if(!isDead() && !head.isDead)
            die = true;
        head.time += 0.02
        // if its time to move the body, logic is processed
        if(head.time >= 1 / head.speed){
            // if snake isnt dead, logic is pocessed. Otherwise game over is shown
            ctx.drawImage(this.bg, 0,0,1000,1000);
            if(die){
                // if heads location is the same as the foods one, bodyPiece is added to the body, score is inceresed, and food is relocated
                food.isEaten();
                // moves the head based on snakes direction
                head.move();
                // saves the bodies position
                copyBody();
                head.paint();
                paintbody();
                // each body piece location is set by last saved posotions
                refreshBody();
                this.paintScore();
            }
            else{
                head.isDead = true;
                // shows the right picture and game over screen
                this.die();
            }

            head.time = 0;
            head.speed += 0.05;
        }
        
    },
    die: function(){
        ctx.drawImage(this.dieImage, 0,0,1000,1000);
        ctx.font = '120px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText("Game over", 190, 150)
        ctx.font = '80px Arial';
        ctx.fillText("Your score is "+this.score+"!", 220, 230)
        ctx.font = '80px Arial';
        ctx.fillText("Press \"F5\"", 320, 300)
    },
    paintScore: function(){
        ctx.font = '40px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("Score: "+this.score, 30, 50);
    }
}

game.start()
