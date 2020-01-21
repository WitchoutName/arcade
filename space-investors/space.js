const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");


function clear(color='white'){
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

class Investor {
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
        this.reward = 0;
        this.position = [x, y];
        this.size = 50;
        this.active = true;
        this.image = new Image();
        if(type == 1){
            this.image.src = "investors/monopoly-guy.png";
            this.reward = 100;
        }
        else if(type == 2){
            this.image.src = "investors/investor.png";
            this.reward = 200;       
        }
        else if(type == 3){
            this.image.src = "investors/lvl100boss.png";
            this.reward = 500;       
        }
        this.corners = [ 
            [this.x - this.size / 2, this.y - this.size / 2],
            [this.x + this.size / 2, this.y - this.size / 2],
            [this.x - this.size / 2, this.y + this.size / 2],
            [this.x + this.size / 2, this.y + this.size / 2]
        ];
    }
    logic(){
        this.corners = [ 
            [this.x - this.size / 2, this.y - this.size / 2],
            [this.x + this.size / 2, this.y - this.size / 2],
            [this.x - this.size / 2, this.y + this.size / 2],
            [this.x + this.size / 2, this.y + this.size / 2]
        ];
    }
    paint(){    
        ctx.drawImage(this.image, this.corners[0][0], this.corners[0][1], this.size , this.size);
    }
    onHit(){
        this.image.src = null;
        this.active = false;
    }
}

class Column{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.position = [x, y];
        this.active = true;
        this.distance = 60;
        this.size = 50;
        this.investorCount = 5;
        this.investors = [];
        this.shot = null;
        for(let i = 0; i < this.investorCount; i++){
            switch(i){
                case 0: this.investors.push(new Investor(this.x, this.y, 3));
                break;
                case 1: this.investors.push(new Investor(this.x, this.y + this.distance, 2));
                break;
                case 2: this.investors.push(new Investor(this.x, this.y + this.distance * 2, 2));
                break;
                case 3: this.investors.push(new Investor(this.x, this.y + this.distance * 3, 1));
                break;
                case 4: this.investors.push(new Investor(this.x, this.y + this.distance * 4, 1));
                break;
            }
        }
        this.corners = [ 
            this.investors[0].corners[0],
            this.investors[0].corners[1],
            this.investors[this.investorCount - 1].corners[2],
            this.investors[this.investorCount - 1].corners[3]
        ];
    }
    logic(){
        let isActive = false;
        this.corners = [ 
            this.investors[0].corners[0],
            this.investors[0].corners[1],
            this.investors[this.investorCount - 1].corners[2],
            this.investors[this.investorCount - 1].corners[3]
        ];

        for(let i = 0; i < this.investorCount; i++){
            this.investors[i].x = this.x
            this.investors[i].y = this.y + (this.distance * i)
        }
        
        for(let investor of this.investors){
            investor.logic()
            if(investor.active)
                isActive = true;
        }
        for(let investor of this.investors){
            if(!this.active)
                investor.active = false
        }
        if(!isActive)
            this.active = false;  
    }
    mostDown(){
        let md = { y: 0 }
        for(let investor of this.investors){
            if(investor.active){
                if(investor.y > md.y)
                    md = investor;
            }
        }
        return md;
    }
    shoot(){
        if(Math.random() > 0.995 && this.shot == null)
            this.shot = new Shot(this.x, this.mostDown().y + (this.size / 2), 0.5)
    }
    bulletsLogic(){
        if(this.shot != null){
            this.shot.move()
            if(this.shot.y >  900)
                this.shot = null;
        }
    

        for(let j = 0; j < game.bunkers.length; j++){
            if(this.shot != null){
                if((this.shot.y <= game.bunkers[j].corners[3][1]) && 
                (this.shot.y >= game.bunkers[j].corners[0][1]) && 
                (this.shot.x <= game.bunkers[j].corners[3][0]) && 
                (this.shot.x >= game.bunkers[j].corners[0][0])){
                    for(let k = 0; k < game.bunkers[j].parts.length; k++){
                        if(game.bunkers[j].parts[k].active){
                            if(this.shot != null){
                                if((this.shot.y <= game.bunkers[j].parts[k].corners[3][1]) && 
                                (this.shot.y >= game.bunkers[j].parts[k].corners[0][1]) && 
                                (this.shot.x <= game.bunkers[j].parts[k].corners[3][0]) && 
                                (this.shot.x >= game.bunkers[j].parts[k].corners[0][0])){
                                    this.shot = null;
                                    game.bunkers[j].parts[k].onHit(2);
                                }
                            }
                        }
                    }
                }
            }
        }
    if(this.shot != null){
        if((this.shot.y <= Player.corners[3][1]) && 
            (this.shot.y >= Player.corners[0][1]) && 
            (this.shot.x <= Player.corners[3][0]) && 
            (this.shot.x >= Player.corners[0][0])){
                if(this.shot.x > Player.x - (Player.size / 2) && this.shot.x < Player.x + (Player.size / 2)){
                this.shot = null;
                Player.onHit();}
        }
    }
    }
    paint(){
        for(let investor of this.investors){
            if(investor.active)
                investor.paint();
        }
        if(this.shot != null)
            this.shot.paint()
    }
    }



    
class InvestroNation{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.goingLeft = true;
        this.goingRight = false;
        this.goingDown = false;
        this.position = [x, y];
        this.speed = 0.2;
        this.investorsSumm = 0;
        this.distance = 60
        this.columns = [];
        for(let i = 0; i < 11; i++){
            if(i < 5)
                this.columns.push(new Column(this.x - (this.distance * (5 - i)), this.y));
            if(i == 5)
                this.columns.push(new Column(this.x, this.y));
            if(i > 5)
                this.columns.push(new Column(this.x + (this.distance * (i - 5)), this.y));  
        }
    }
    logic(){
        for(let column of this.columns){
            if(column.active){
            column.logic()
            column.shoot()
            column.bulletsLogic()   
            }
            
        }

        for(let i = 0; i < 11; i++){
            if(i < 5){
                this.columns[i].x = this.x - (this.distance * (5 - i))
                this.columns[i].y = this.y
            }
            if(i == 5){
                this.columns[i].x = this.x
                this.columns[i].y = this.y
            }
            if(i > 5){
                this.columns[i].x = this.x + (this.distance * (i - 5))
                this.columns[i].y = this.y
            } 
        
        }
        this.investorsSumm = this.totalInvestors();
        this.speed = 5 / this.investorsSumm;
    }
    totalInvestors(){
        let investorCount = 0;
        for(let column of this.columns){
            for(let investor of column.investors)
                if(investor.active)
                    investorCount++;
        }
        return investorCount;
    }
    investorDown(){
        for(let column of this.columns){
            for(let investor of column.investors){
                if(investor.active && investor.y > 650){
                    return true;
                }
            }
        }

    }
    mostLeft(){
        let ml = {x: 1000}
        for(let column of this.columns){
            if(column.active && column.x < ml.x)
                ml = column;
        }
        return ml;
    }
    mostRight(){
        let mr = {x: 0}
        for(let column of this.columns){
            if(column.active && column.x > mr.x)
                mr = column;
        }
        return mr;
    }
    goLeft(){
        if(this.mostLeft().x > 50)
            this.x -= this.speed;
        else{
            this.goingDown = true; 
        }
    }
    goRight(){
        if(this.mostRight().x < 750)
            this.x += this.speed;
        else{
            this.goingDown = true;
        }
    }
    goDown(){
        this.y += 25;
        this.goingDown = false;
        this.goingLeft = !this.goingLeft;
        this.goingRight = !this.goingRight

    }
    move(){
        if(this.goingDown)
            this.goDown();
        else if(this.goingLeft)
            this.goLeft();
        else if(this.goingRight)
            this.goRight();
    }
    paint(){
        for(let column of this.columns){
            if(column.active)
                column.paint();
        }
    }
}

class Shot{
    constructor(x,y, direction){
        this.x = x;
        this.y = y;
        this.speed = 8;
        this.sizeX = 3;
        this.sizeY = 20;
        this.direction = direction;
        this.image = new Image();
        if(direction < 0)
            this.image.src = "shot.png";
        if(direction > 0){
            this.image.src = "dollar.png";  
            this.sizeX = 10;
            this.sizeY = 20;
        }

    }
    move(){
        this.y += this.direction * this.speed;
    }
    paint(){
        ctx.drawImage(this.image, this.x - this.sizeX / 2, this.y - this.sizeY / 2, this.sizeX, this.sizeY);
    }
}

class BunkerPiece {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.position = [x, y];
        this.health = 2;
        this.size = 13;
        this.active = true;
        this.image = new Image();
        this.image.src = "window.png";
        this.corners = [ 
            [this.x - this.size, this.y - this.size],
            [this.x + this.size, this.y - this.size],
            [this.x - this.size, this.y + this.size],
            [this.x + this.size, this.y + this.size]
        ];
    }
    paint(){
        ctx.drawImage(this.image, this.corners[0][0], this.corners[0][1], this.size * 2, this.size * 2);
    }
    onHit(byWho){
        
        this.health--
        if(this.health == 1){
            if(byWho == 1)
                this.image.src = "pindow.png"
            if(byWho == 2)
                this.image.src = "bindow.png"
        }
        else if(this.health < 1){
            this.image.src = "";
            this.active = false;
        }
    }
    
}

class SkyScraper {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 50;
        this.near = 13;
        this.far = 37;
        this.corners = [
            [this.x - this.size, this.y - this.size],
            [this.x + this.size, this.y - this.size],
            [this.x - this.size, this.y + this.size],
            [this.x + this.size, this.y + this.size],
        ]
        this.partsPositions = [
            [[this.x - this.far, this.y - this.far], [this.x - this.near, this.y - this.far], [this.x + this.near, this.y - this.far], [this.x + this.far, this.y - this.far]],
            [[this.x - this.far, this.y - this.near], [this.x - this.near, this.y - this.near], [this.x + this.near, this.y - this.near], [this.x + this.far, this.y - this.near]],
            [[this.x - this.far, this.y + this.near], [this.x - this.near, this.y + this.near], [this.x + this.near, this.y + this.near], [this.x + this.far, this.y + this.near]],
            [[this.x - this.far, this.y + this.far], [this.x - this.near, this.y + this.far], [this.x + this.near, this.y + this.far], [this.x + this.far, this.y + this.far]]
        ]
        this.parts = [];
        this.createParts();

    }
    createParts(){
        for(let r = 0; r < 4; r++){
            for(let c = 0; c < 4; c++){
                this.parts.push(new BunkerPiece(this.partsPositions[r][c][0], this.partsPositions[r][c][1]));
            }
        }
    }
    paint(){
        for(let i = 0; i < this.parts.length; i++){
            if(this.parts[i].active == true){
               // console.log("["+this.parts[i].x+"  "+this.parts[i].y+"]")
                this.parts[i].paint();
            }
        }
    }
}

let Player = {
    x: 400,
    y: 750,
    size: 40,
    lives: 3,
    shot: null,
    corners: [],
    image:  new Image(),
    heart: new Image(),
    logic: function(){
        this.corners = [ 
            [this.x - this.size / 2, this.y - this.size / 2],
            [this.x + this.size / 2, this.y - this.size / 2],
            [this.x - this.size / 2, this.y + this.size / 2],
            [this.x + this.size / 2, this.y + this.size / 2]
        ];
    },
    paint: function(){
        this.image.src = 'player.png';
        this.heart.src = "heart.png"   
        ctx.drawImage(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        this.paintlives();
        this.paintUI();
        if(this.shot != null)
            this.shot.paint();
    },
    paintlives: function(){
        for(let i = 0; i < this.lives; i++){
            ctx.drawImage(this.heart, 5 + i * 35, 765, this.size * 0.75, this.size * 0.75);
        }
    },
    paintUI: function(){
        ctx.font = '30px Bangers';
        ctx.fillStyle = 'white';
        ctx.fillText("Bill: "+game.score+"$", 5, 25)
        ctx.fillText("Round: "+game.round, 5, 55)
        ctx.fillText("Worst bill: "+game.highscore+"$", 300, 25)
        
    },
    shoot: function(){
        this.shot = new Shot(this.x, this.y - this.size / 2, -1);
    },
    bulletsLogic: function(){
        if(this.shot != null){
            this.shot.move();

            if(this.shot.y < - 100){
                this.shot = null;
            }
        
            for(let j = 0; j < game.bunkers.length; j++){
                if(this.shot != null){
                    if((this.shot.y <= game.bunkers[j].corners[3][1]) && 
                    (this.shot.y >= game.bunkers[j].corners[0][1]) && 
                    (this.shot.x <= game.bunkers[j].corners[3][0]) && 
                    (this.shot.x >= game.bunkers[j].corners[0][0])){
                        for(let k = 0; k < game.bunkers[j].parts.length; k++){
                            if(game.bunkers[j].parts[k].active){
                                if(this.shot != null){
                                    if((this.shot.y <= game.bunkers[j].parts[k].corners[3][1]) && 
                                    (this.shot.y >= game.bunkers[j].parts[k].corners[0][1]) && 
                                    (this.shot.x <= game.bunkers[j].parts[k].corners[3][0]) && 
                                    (this.shot.x >= game.bunkers[j].parts[k].corners[0][0])){
                                        this.shot = null
                                        game.bunkers[j].parts[k].onHit(1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        
            for(let column of game.investorNation.columns){
                if(column.active){
                    if(this.shot != null){
                       if(this.shot.x <= column.corners[3][0] &&
                        this.shot.x >= column.corners[0][0] &&
                        this.shot.y <= column.corners[3][1] &&
                        this.shot.y >= column.corners[0][1]){
                            for(let investor of column.investors){
                                if(investor.active){
                                    if(this.shot != null){
                                        if(this.shot.x <= investor.corners[3][0] &&
                                        this.shot.x >= investor.corners[0][0] &&
                                        this.shot.y <= investor.corners[3][1] &&
                                        this.shot.y >= investor.corners[0][1]){
                                            investor.active = false;
                                            game.score += investor.reward * game.round;
                                            this.shot = null;
                                        }
                                    }
                                }
                            }
                        }    
                    }
                }
            }
        }
    },
    onHit: function(){
        this.lives--
    }
}

let game = {
    bg: new Image(),
    welcomeImg: new Image(),
    brokeImg: new Image(),
    direction: 0,
    score: 0,
    highscore: 0,
    round: 1,
    bunkers: [],
    stoop: false,
    lose: false,
    win: false,
    welcomeScreen: true,
    investorNation: null,
    init: function(){
        document.addEventListener('click', function (){
                if(Player.shot == null)
                Player.shoot();
                
        });
        document.addEventListener('keydown', function (){
            game.welcomeScreen = false
            if(game.lose){
                game.newGame()
                game.lose = false
                game.stoop = false
                Player.lives = 3;
                game.score = 0;
                game.round = 1
            }
        });
        canvas.addEventListener('mousemove', function(ev) {
                Player.x = ev.offsetX;
        });
    },
    start: function(){
        this.bg.src = "bg.png"
        this.welcomeImg.src = "welcome.png"
        this.brokeImg.src = "broke.png"
        this.newGame();
             
        this.timer = setInterval(()=>{
            
            if(this.lose){
                this.stoop = true;
                this.broke()
            }
            else if(this.welcomeScreen){
                this.welcome();
            }
            else if(this.win){
                this.newGame()
                this.round++;
                this.win = false
            }
            else if(!this.stoop)
                this.repaint();
        }, 1000 / 120)
    },
    welcome: function(){
        ctx.drawImage(this.welcomeImg, 0, 0, 800, 800);
    },
    broke: function(){
        ctx.drawImage(this.brokeImg, 0, 0, 800, 800);
        ctx.font = '60px Bangers';
        ctx.fillStyle = 'red';
        ctx.fillText("Your total bill is "+game.score+"$", 150, 570)
        ctx.fillText("Your worst bill is "+game.highscore+"$", 150, 630)
    },
    stop: function(){
        this.stoop = true;
    },
    state: function(){
        if(this.investorNation.investorDown() || Player.lives < 1)
            this.lose = true;
        if(this.investorNation.investorsSumm < 1)
            this.win = true;
    },
    newGame(){
        this.investorNation = null;
        this.investorNation = new InvestroNation(400, 100);
        this.bunkers.splice(0,4)
        for(let i = 0; i < 4; i++)
            this.bunkers.push(new SkyScraper(100 + (i * 200), 650));
    },
    repaint: function(){
        ctx.drawImage(this.bg, 0, 0, 800, 800);
        Player.logic();
        Player.bulletsLogic();
        this.investorNation.logic()
        this.investorNation.move();
        for(let i = 0; i < 4; i++)
            this.bunkers[i].paint();
        Player.paint();
        this.investorNation.paint();
        this.state();
        if(this.score > this.highscore)
            this.highscore = this.score;

    }
}

game.init();
game.start();
