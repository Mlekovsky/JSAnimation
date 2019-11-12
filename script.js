var canvas;
var context;
var repeater;
var backgroundColor = "#88cdf2"; 
var pile;
var island; var islandHeight = 100; var islandWidth = 250; var islandColor="#dde077";
var water; var waterHeight; var waterWidth; var waterColor = "#0324fc";
var sun; var sunColor = "#f6fa00"; var opacityMinRange = 0.9; var sunMaxSize = 1.1; var sunRaysCount = 5;
var fishColor = "#de7a10"; var fishCount = 3; var fishEyeColor = "#f2356b "; //#57a0ff = niebieski
const Directions = {
    LEFT: 'left',
    RIGHT: 'right'
};

function beginAnimation()
{
    canvas = document.getElementById( "myCanvas" );
    context = canvas.getContext( "2d" );

    context.fillStyle = backgroundColor;
    context.fillRect( 0, 0, canvas.width, canvas.height);

    //Initiailze Pile
    pile = new Pile();    
    pile.setHeight(3);

    //Initialize Island
    island = new Island(islandHeight,islandWidth, islandColor);
    island.init();
    island.setReferencePoint(0,canvas.height - islandHeight);

    //Initialize Water
    waterWidth = canvas.width - islandWidth;
    waterHeight = islandHeight - 20;
    water = new Water(waterHeight, waterWidth, waterColor);
    water.init();
    water.setReferencePoint(canvas.width - waterWidth, canvas.height - waterHeight);
    water.initFishes();
    //Initialize Sun;
    sun = new Sun(sunColor, 30);
    sun.init();

    repeater = setTimeout(continueAnimation, 100);
}

function continueAnimation()
{
    context.fillStyle = backgroundColor;
    context.fillRect( 0, 0, canvas.width, canvas.height );
    island.draw();
    pile.draw();
    water.draw();
    sun.draw();
    repeater = setTimeout(continueAnimation, 100);
}

function Pile()
{
    this.cannonBalls = [];
    this.height = 0;
    this.heightChanged = false;

    this.addCannonBall = function(Circle)
    {
        cannonBalls.push(Circle);
    }

    this.setHeight = function(height)
    {
        this.height = height;
        this.heightChanged = true;
    }

    this.drawCannonBalls = function()
    {
        var indexCounter = 0;
        for(var i = 0; i <= this.height; i++)
        {
            for(var j = 0; j <= i;j++)
            {
                var ball = this.cannonBalls[indexCounter++];
                context.save();
                context.transform(1,0,0,1,ball.trX,ball.trY);
                ball.display();
                context.restore();
            }
        }
    }

    this.fillCannonBalls = function(){
        for(var i = 0; i <= this.height; i++)
        {
            for(var j = 0; j <= i; j++)
            {
               this.cannonBalls.push(new Circle(
                    10,"#000000", island.X0 + island.width / 1.6 + (i + 1)*18, island.height + island.Y0 - (j + 1)*18
               ));
            }
        }
        this.heightChanged = false;   
    }
    
    this.draw = function()
    {
        if(this.heightChanged)
        {
            this.fillCannonBalls();
        }
        this.drawCannonBalls();
    }
}

function Island(height, width, color)
{
    this.height = height;
    this.width = width;
    this.color = color;

    this.X0 = 0;
    this.Y0 = 0;

    this.init = function()
    {
        this.land = new Rect(this.color);
    }

    this.draw = function()
    {
        context.save();
        context.transform(this.width,0,0,this.height, this.X0, this.Y0);
        this.land.display();
        context.restore();
    }

    this.setReferencePoint = function(x,y)
    {
        this.land.setReferencePoint(x,y);
        this.X0 = x;
        this.Y0 = y;
    }
}

function Water(height,width,color)
{
    this.height = height;
    this.width = width;
    this.color = color;
    this.X0 = 0;
    this.Y0 = 0;

    this.fishes = [];

    this.init = function()
    {
        this.water = new Rect(this.color);
    }

    this.initFishes = function()
    {
        for(var i = 0; i < fishCount; i++)
        {
            var fish = new Fish(fishColor, 10,15,20,20);
            fish.setReferencePoint(this.X0, this.Y0);
            fish.init();
            this.fishes.push(fish);
        }
    }

    this.drawFishes = function()
    {
        for(var i = 0; i < fishCount; i++)
        {
            var fish = this.fishes[i];
            fish.move();
            fish.draw();
        }
    }

    this.removeFish = function()
    {
        this.fishes.pop();
    }

    this.addFish = function()
    {
        var fish = new Fish(fishColor, 10,15,20,20);
            fish.setReferencePoint(this.X0, this.Y0);
            fish.init();
            this.fishes.push(fish);
    }

    this.draw = function()
    {
        context.save();
        context.transform(this.width,0,0,this.height, this.water.X0, this.water.Y0);
        this.water.display();
        context.restore();
        this.drawFishes();
    }

    this.setReferencePoint = function(x,y)
    {
        this.water.setReferencePoint(x,y);
        this.X0 = x;
        this.Y0 = y;
    }
}

function Fish(color,bodySize, finLength, finHeight, eyeSize)
{
    this.X0 = 0;
    this.Y0 = 0;
    this.color = color;
    this.direction = Directions.RIGHT;
    this.finLength = finLength;
    this.bodySize = bodySize;
    this.finHeight = finHeight;
    this.eyeSize = eyeSize;

    this.posX = 0;
    this.posY = 0;

    this.currentSinValue = 0;
    this.maxSinValue = Math.PI * 2;
    this.minSinValue = 0;
    this.waterCenter = (canvas.height - water.Y0) / 2;

    this.init = function()
    {
        this.fin = new Rect(fishColor);
        this.posX = this.X0 + (Math.random() * water.width);
        this.currentSinValue = Math.random() * Math.PI * 2;
        this.posY = this.Y0 + Math.sin(this.currentSinValue) * (this.waterCenter - 5);
        this.setDirection(Directions.RIGHT);
        this.eye = new Circle(fishEyeColor, this.eyeSize, this.X0, this.Y0);
    }
    
    this.setDirection = function(direction)
    {
         this.direction = direction;
    }

    this.move = function(){
        switch(this.direction)
        {
            case Directions.RIGHT:
                this.posX += 1;
                if(this.posX > canvas.width - (this.bodySize + this.finLength))
                {
                    this.posX = canvas.width - this.bodySize - this.finLength;
                    this.direction = Directions.LEFT;
                }
                break;
            case Directions.LEFT:
                this.posX -= 1;
                if(this.posX < water.X0 + this.bodySize + this.finLength)
                {
                    this.posX = water.X0 + this.bodySize + this.finLength;
                    this.direction = Directions.RIGHT;
                }
                break;
        }

        this.currentSinValue += Math.PI / 20;

        if(this.currentSinValue >= this.maxSinValue)
        {
            this.currentSinValue = 0;
        }
        this.posY = this.Y0 + Math.sin(this.currentSinValue) * (this.waterCenter - this.bodySize);
    }

    this.draw = function()
    {
        switch(this.direction)
        {
            case Directions.RIGHT:
                //draw body
                context.save();
                context.beginPath();
                context.ellipse(this.posX + this.finLength + this.bodySize, this.posY + this.waterCenter, this.bodySize * 1.5, this.bodySize, 0, 0, 2 * Math.PI);
                context.stroke();
                context.fillStyle = fishColor;
                context.fill();
                context.restore();
                //draw fin
                context.save();
                context.beginPath();
                context.moveTo(this.posX + this.bodySize, this.posY - (this.finHeight / 2) + this.waterCenter + this.bodySize);
                context.lineTo(this.posX + this.bodySize - this.finLength, this.posY - this.finHeight + this.waterCenter + this.bodySize);
                context.lineTo(this.posX + this.bodySize - this.finLength, this.posY + this.waterCenter + this.bodySize);
                context.fillStyle = fishColor;
                context.fill();
                context.restore();
                //draw eye
                context.save();
                context.transform(1,0,0,1,this.posX + this.bodySize - 5, this.posY + (this.bodySize / 2));
                this.eye.display();
                context.restore();
                break;
            case Directions.LEFT:
                //draw body
                 context.save();
                 context.beginPath();
                 context.ellipse(this.posX + this.finLength + this.bodySize, this.posY + this.waterCenter, this.bodySize * 1.5, this.bodySize, 0, 0, 2 * Math.PI);
                 context.stroke();
                 context.fillStyle = fishColor;
                 context.fill();
                 context.restore();
                 //draw fin
                 context.save();
                 context.beginPath();
                 context.moveTo(this.posX + (2 * this.finLength + this.bodySize), this.posY - (this.finHeight / 2) + this.waterCenter + this.bodySize);
                 context.lineTo((this.posX + this.finLength) + (2 * this.finLength + this.bodySize), this.posY - this.finHeight + this.waterCenter + this.bodySize);
                 context.lineTo((this.posX + this.finLength) + (2 * this.finLength + this.bodySize), this.posY + this.waterCenter + this.bodySize);
                 context.fillStyle = fishColor;
                 context.fill();
                 context.restore();
                 //draw eye
                 context.save();
                 context.transform(1,0,0,1,this.posX + this.bodySize - 5, this.posY + (this.bodySize / 2));
                 this.eye.display();
                 context.restore();                
                break;
        }
       
    }

    this.setReferencePoint = function(x,y)
    {
        this.X0 = x;
        this.Y0 = y;
    }
}

function Ship()
{

}

function Sun(color, radius)
{
    this.color = color;
    this.radius = radius;
    this.opacityValue = opacityMinRange;
    this.addOpacity = true;
    this.scaleValue = 1;
    this.shrink = true;

    this.sunRaysWidth = 30;
    this.sunRays = [];

    // this.initSunRays = function()
    // {
    //     for(var i = 0 ; i < sunRaysCount ; i++)
    //     {
    //         this.sunRays.push(new Rect(sunColor));
    //     }
    // }
    
    this.init = function()
    {
        this.rX =  35; //top left corner;
        this.rY =  35;
        this.sun = new Circle(this.radius, this.color, this.rX ,this.rY);
        // this.initSunRays();
    }
    
    this.opacityHandler = function()
    {
        if(this.addOpacity)
        {
            this.opacityValue += 0.05;
            if(this.opacityValue >= 1)
            {
                this.opacityValue == 1;
                this.addOpacity = false;
            }
        }
        else    
        {
            this.opacityValue -= 0.05;
            if(this.opacityValue <= opacityMinRange)
            {
                this.opacityValue = opacityMinRange;
                this.addOpacity = true;
            }
        }
    }

    this.sizeHandler = function()
    {
        if(this.shrink)
        {
            this.scaleValue -= 0.005;
            if(this.scaleValue <= 1)
            {
                this.scaleValue = 1;
                this.shrink = false;
            }
        }
        else
        {
            this.scaleValue += 0.005;
            if(this.scaleValue >= sunMaxSize)
            {
                this.scaleValue = sunMaxSize;
                this.shrink = true;
            }
        }
    }
    // this.drawSunRays = function()
    // {
    //     for(var i = 0; i < sunRaysCount; i++)
    //     {
    //         context.save();
    //         var sunRay = this.sunRays[i];
    //         context.transform(10 ,0.9,-0.9 ,1,this.rX + 50, (i + 1)*20);
    //         sunRay.display();
    //         context.restore();
    //     }
    // }
    
    this.draw = function(){
        this.opacityHandler();
        this.sizeHandler();
        // this.drawSunRays();
        context.save();
        context.globalAlpha = this.opacityValue;
        context.transform(this.scaleValue,0,0,this.scaleValue,this.rX, this.rY);
        this.sun.display();
        context.restore();
    }
}

function Cloud()
{
//TODO:Fill with logic
}

function Cannon()
{
//TODO:Fill with logic    
}

function Circle(radius, color, rX, rY)
{
    this.Y = 0,
    this.X = 0
    this.radius = radius;
    this.color = color;
    this.trX = rX;
    this.trY = rY;

    this.display = function (){
        context.fillStyle = this.color;
        context.beginPath();
        context.arc( this.X, this.Y, this.radius, 0, Math.PI * 2 );
        context.closePath();
        context.fill();
    }
}

function Rect( color )
{
    this.X = 0;
    this.Y = 0;
    this.W = 1;
    this.H = 1;
    this.Color = color;
    this.X0 = 0;
    this.Y0 = 0;

    this.display = function( ) { 
      context.fillStyle = this.Color;
      context.fillRect( this.X, this.Y, this.W, this.H );
    };

    this.setReferencePoint = function( x, y ) {
        this.X0 = x;
        this.Y0 = y;
    }
}
//ButtonsEvents

function AddCannonBall()
{
    if(pile.height < 4)
    {
        pile.setHeight(pile.height + 1);
    }
}

function RemoveCannonBall()
{
    if(pile.height > 0 )
    {
        pile.setHeight(pile.height - 1);
    }
}

function AddFish()
{
    if(fishCount < 10)
    {
        ++fishCount;
        water.addFish();
    }
}

function RemoveFish()
{
    if(fishCount > 1)
    {
        --fishCount;
        water.removeFish();
    }
}