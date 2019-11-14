var canvas;
var context;
var repeater;
var backgroundColor = "#88cdf2"; 
var pile; var pileMaxSize = 7;
var island; var islandHeight = 100; var islandWidth = 250; var islandColor="#dde077";
var water; var waterHeight; var waterWidth; var waterColor = "#0324fc";
var sun; var sunColor = "#f6fa00"; var opacityMinRange = 0.9; var sunMaxSize = 1.1; var sunRaysCount = 5;
var fishColor = "#de7a10"; var fishCount = 6; var fishEyeColor = "#f2356b "; var fishLimit = 15; //#57a0ff = niebieski
var cloudColor = "#e9f0f5"; var cloudCount = 5; var cloudElementsize = 15; var clouds = []; var cloudLimit = 7;
var ship;
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
    pile.setHeight(5);

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
    //Initialize coulds
    InitializeClouds();
    
    ship = new Ship();
    ship.setReferencePoint(water.X0 + 150, water.Y0);
    ship.init();

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
    ship.draw();
    DrawClouds();
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
        for(var i = 0; i < this.height; i++)
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
        this.cannonBalls = [];
        for(var i = 0; i < this.height; i++)
        {
            for(var j = 0; j <= i; j++)
            {
               this.cannonBalls.push(new Circle(
                    10,"#000000", island.X0 + island.width / 3 + (i + 1)*18, island.height + island.Y0 - (j + 1)*18
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
        if(Math.random() > 0.5) {
            this.setDirection(Directions.RIGHT);
        }
        else{
            this.setDirection(Directions.LEFT);
        }    
    
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
    this.X0 = 0;
    this.Y0 = 0;

    this.woodColor = "#91572a";
    this.lineColor = "#1f1711";
    this.windowColor = "#bec2b8";
    this.flagColor = "#edece6";

    this.bottomWidth = 250;
    this.bottomHeight = 80;

    this.windowWidth = 20;
    this.windowHeight = 30;

    this.pillarHeight = 250;
    this.pillarWidth = 15;

    this.windows = [];
    this.windowsCount = 5;

    this.draw = function()
    {
        //bottom
        context.save();
        context.transform(this.bottomWidth, 0, -50, -this.bottomHeight, this.X0, this.Y0);
        this.bottom1.display();
        context.restore();

        context.save();
        context.transform(this.bottomWidth, 0, 50, -this.bottomHeight, this.X0, this.Y0);
        this.bottom2.display();
        context.restore();
        //windows
        for(var i = 0; i < this.windowsCount; i++)
        {
            var window = this.windows[i];
            context.save();
            context.transform(this.windowWidth, 0, 0, -this.windowHeight, this.X0 + ((i + 1) * 40) - (this.windowWidth / 2), this.Y0 - (this.bottomHeight / 2) + (this.windowHeight / 2));
            window.display();
            context.restore();
        }
        //pillar
        context.save();
        context.transform(this.pillarWidth, 0,0, -this.pillarHeight, this.pillar.X0, this.pillar.Y0);
        this.pillar.display();
        context.restore();

         //flag
        switch(this.direction)
        {
            case Directions.RIGHT:
                    context.save();
                    context.beginPath();
                    context.ellipse(this.pillar.X0 + this.pillarWidth, this.pillar.Y0 - this.pillarHeight / 2, this.pillarHeight / 2, 20 , Math.PI / 2, 0, Math.PI,true);
                    context.fillStyle = this.flagColor;
                    context.fill();
                    context.restore();
                break;
            case Directions.LEFT:
                    context.save();
                    context.beginPath();
                    context.ellipse(this.pillar.X0, this.pillar.Y0 - this.pillarHeight / 2, this.pillarHeight / 2, 20 , Math.PI / 2, 0, Math.PI);
                    context.fillStyle = this.flagColor;
                    context.fill();
                    context.restore();
                break;    
        }
      
    }

    this.MoveShip = function(direction)
    {       
        this.direction = direction;

        switch(this.direction)
        {
            case Directions.RIGHT:
                if(this.X0 < canvas.width - this.bottomWidth)
                {
                    this.X0 += 1;
                }
                break;
            case Directions.LEFT:
                if(this.X0 > water.X0)
                {
                    this.X0 -=1;
                }
                break;  
        }

        this.pillar.setReferencePoint(this.X0 + (this.bottomWidth / 2) - (this.pillarWidth / 2), this.Y0 - this.bottomHeight);//correct pillar
    }

    this.init = function()
    {
        this.bottom1 = new Rect(this.woodColor);
        this.bottom2 = new Rect(this.woodColor);

        for(var i = 0; i < this.windowsCount; i++)
        {
            this.windows.push(new Rect(this.windowColor));      
        }      
        this.pillar = new Rect(this.woodColor);
        this.pillar.setReferencePoint(this.X0 + (this.bottomWidth / 2) - (this.pillarWidth / 2), this.Y0 - this.bottomHeight);

        this.direction = Directions.RIGHT;
    }

    this.setDirection = function(direction)
    {
        this.direction = direction;
    } 
    
    this.setReferencePoint = function(x,y)
    {
        this.X0 = x;
        this.Y0 = y;
    }
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

function Cloud(color)
{
    this.color = color;
    this.X0 = 0;
    this.Y0 = 0;

    this.posX = 0;
    this.posY = 0;

    this.cloudElementCount = 0;
    this.cloudElementLimit = 10;
    this.elements = [];
    this.xMaxLimit = 30;
    this.xMinLimit = 0;
    this.currentX = 0;    

    this.currentSinValue = 0;
    this.maxSinValue = Math.PI * 2;
    this.minSinValue = 0;

    this.maxUpDistance = 10;

    this.init = function()
    {
         //randomly generate cloud size
        while(this.cloudElementCount < 1)
        {
            this.cloudElementCount = Math.floor(Math.random() * this.cloudElementLimit);
        }

        var columnCount = 1;
        for(var i = 0; i < this.cloudElementCount; i++)
        {
            if(i % 2 == 0)
            {
                this.elements.push(
                    new Circle(cloudElementsize, this.color, columnCount * 15, 5)
                )
                columnCount++;
            }
            else
            {
                this.elements.push(
                    new Circle(cloudElementsize, this.color, columnCount * 15, 15)
                )
            }
        }

        if(Math.random() > 0.5) {
            this.setDirection(Directions.RIGHT);
        }
        else{
            this.setDirection(Directions.LEFT);
        }  

        this.currentSinValue = Math.random() * Math.PI * 2;
        this.posY = this.Y0 + Math.sin(this.currentSinValue) * this.maxUpDistance;
        
        this.currentX = (Math.random() * this.xMaxLimit);
        this.posX = this.currentX + this.X0;
    }

    this.setDirection = function(direction)
    {
       this.direction = direction;
    }
    
    this.move = function()
    {
        this.posX = this.X0 + this.currentX;

        switch(this.direction)
        {
            case Directions.RIGHT:
                this.currentX++;
                if(this.currentX > this.xMaxLimit)
                {   
                    this.direction = Directions.LEFT;
                }
                break;
            case Directions.LEFT:
                this.currentX--;
                if(this.currentX < this.xMinLimit)
                {
                    this.direction = Directions.RIGHT;
                }
                break;
        }

        this.currentSinValue += Math.PI / 30;

        if(this.currentSinValue >= this.maxSinValue)
        {
            this.currentSinValue = 0;
        }
        this.posY = this.Y0 + Math.sin(this.currentSinValue) * this.maxUpDistance;
    }

    this.draw = function()
    {
        for(var i = 0; i < this.cloudElementCount; i++)
        {
            var element = this.elements[i];
            context.save();
            context.transform(1,0,0,1, this.posX + element.trX, this.posY + element.trY)
            element.display();
            context.restore();
        }
    }

    this.setReferencePoint = function(x,y)
    {
        this.X0 = x;
        this.Y0 = y
    }
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
//GlobalFunctions
function MakeCloud()
{
    var cloud = new Cloud(cloudColor);
    var previousLastCloud = clouds[cloudCount - 1];
    cloud.setReferencePoint(previousLastCloud.X0 + 100, sun.rY + Math.random() * 30);
    cloud.init();
    return cloud;
}

function InitializeClouds()
{
    for(var i = 0; i < cloudCount; i++)
    {
        var cloud = new Cloud(cloudColor);
        cloud.setReferencePoint(sun.rX + ((i + 1) * 100), sun.rY + (Math.random() * 30));
        cloud.init();
        clouds.push(cloud);
    }
}

function DrawClouds()
{
    for(var i = 0; i < cloudCount; i++)
    {
        var cloud = clouds[i];
        cloud.move();
        cloud.draw();
    }
}
//ButtonsEvents

function AddCannonBall()
{
    if(pile.height < pileMaxSize)
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
    if(fishCount < fishLimit)
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

function AddCloud()
{
    if(cloudCount < cloudLimit)
    {
        var cloud = MakeCloud();
        ++cloudCount;
        clouds.push(cloud);
    }
}

function RemoveCloud()
{
    if(cloudCount > 1)
    {
        --cloudCount;
        clouds.pop();
    }
}
//ArrowHandler
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37: //left
            ship.MoveShip(Directions.LEFT);
            break;
        case 39: //right
            ship.MoveShip(Directions.RIGHT);
            break;
    }
};