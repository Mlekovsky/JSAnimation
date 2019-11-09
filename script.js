var canvas;
var context;
var repeater;
var backgroundColor = "#88cdf2"; 
var pile;
var island; var islandHeight = 90; var islandWidth = 250; var islandColor="#dde077";
var water; var waterHeight; var waterWidth; var waterColor = "#0324fc";
var sun; var sunColor = "#f6fa00"; var opacityMinRange = 0.3; var sunMaxSize = 1.5; var sunRaysCount = 5;

function beginAnimation()
{
    canvas = document.getElementById( "myCanvas" );
    context = canvas.getContext( "2d" );

    context.fillStyle = backgroundColor;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    //Initiailze Pile
    pile = new Pile();    
    pile.setHeight(3);

    //Initialize Island
    island = new Island(islandHeight,islandWidth, islandColor);
    island.init();
    island.setReferencePoint(0,canvas.height - islandHeight);

    //Initialize Water
    waterWidth = canvas.width - islandWidth;
    waterHeight = islandHeight - 30;
    water = new Water(waterHeight, waterWidth, waterColor);
    water.init();
    water.setReferencePoint(canvas.width - waterWidth, canvas.height - waterHeight);

    //Initialize Sun;
    sun = new Sun(sunColor, 30);
    sun.init();

    repeater = setTimeout(continueAnimation, 100);
}

function continueAnimation()
{
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


    this.init = function()
    {
        this.water = new Rect(this.color);
    }

    this.draw = function()
    {
        context.save();
        context.transform(this.width,0,0,this.height, this.water.X0, this.water.Y0);
        this.water.display();
        context.restore();
    }

    this.setReferencePoint = function(x,y)
    {
        this.water.setReferencePoint(x,y);
        this.X0 = x;
        this.Y0 = y;
    }
}

function Fish()
{
//TODO:Fill with logic
}

function Tree()
{
//TODO:Fill with logic
}

function Sun(color, radius)
{
    this.color = color;
    this.radius = radius;
    this.opacityValue = opacityMinRange;
    this.addOpacity = true;
    this.scaleValue = 1;
    this.shrink = true;

    this.sunRaysWidth = 10;
    this.sunRays = [];

    this.initSunRays = function()
    {
        for(var i = 0 ; i < sunRaysCount ; i++)
        {
            this.sunRays.push(new Rect(sunColor));
        }
    }
    
    this.init = function()
    {
        this.rX =  35; //top left corner;
        this.rY =  35;
        this.sun = new Circle(this.radius, this.color, this.rX ,this.rY);
        this.initSunRays();
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
            this.scaleValue -= 0.1;
            if(this.scaleValue <= 1)
            {
                this.scaleValue = 1;
                this.shrink = false;
            }
        }
        else
        {
            this.scaleValue += 0.1;
            if(this.scaleValue >= sunMaxSize)
            {
                this.scaleValue = sunMaxSize;
                this.shrink = true;
            }
        }
    }
    this.drawSunRays = function()
    {
        context.save();
        for(var i = 0; i < sunRaysCount; i++)
        {
            var sunRay = this.sunRays[i];
            context.transform(this.sunRaysWidth ,i/sunRaysCount, - (i/sunRaysCount),2,this.rX + 40, this.rY + 40);
            sunRay.display();
        }
        context.restore();
    }
    
    this.draw = function(){
        this.opacityHandler();
        this.sizeHandler();
        this.drawSunRays();
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