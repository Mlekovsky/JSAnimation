var canvas;
var context;
var repeater;
var pile;
var island; var islandHeight = 70; var islandWidth = 180;
var backgroundColor = "#88cdf2"; var islandColor="#dde077";

function beginAnimation()
{
    canvas = document.getElementById( "myCanvas" );
    context = canvas.getContext( "2d" );

    context.fillStyle = backgroundColor;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    pile = new Pile();    
    pile.setHeight(3);

    island = new Island(islandHeight,islandWidth, islandColor);
    island.init();
    island.setReferencePoint(0,canvas.height - islandHeight);

    repeater = setTimeout(continueAnimation, 100);
}

function continueAnimation()
{
    island.draw();
    pile.draw();
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
                ball.draw();
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
                    10,"#000000",0, island.land.X0 + island.width / 3 + (i + 1)*18, island.height + island.land.Y0  - (j+1)*18
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

    this.init = function()
    {
        this.land = new Rect(this.color);
    }

    this.draw = function()
    {
        context.save();
        context.transform(this.width,0,0,this.height, this.land.X0, this.land.Y0);
        this.land.display();
        context.restore();
    }

    this.setReferencePoint = function(x,y)
    {
        this.land.setReferencePoint(x,y);
    }
}

function Water(height,width,color)
{
//TODO:Fill with logic
}

function Fish()
{
//TODO:Fill with logic
}

function Tree()
{
//TODO:Fill with logic
}

function Sun()
{
//TODO:Fill with logic
}

function Cloud()
{
//TODO:Fill with logic
}

function Cannon()
{
//TODO:Fill with logic    
}

function Circle(radius, color, opactiy, rX, rY)
{
    this.Y = 0,
    this.X = 0
    this.radius = radius;
    this.color = color;
    this.opactiy = opactiy;
    this.trX = rX;
    this.trY = rY;

    this.draw = function (){
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