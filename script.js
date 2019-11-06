var canvas;
var context;
var repeater;
var pile;
var backgroundColor = "#CCCCCC";

function beginAnimation()
{
    canvas = document.getElementById( "myCanvas" );
    context = canvas.getContext( "2d" );

    context.fillStyle = backgroundColor;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    pile = new Pile();    
    pile.setHeight(3);
    repeater = setTimeout(continueAnimation, 100);
}

function continueAnimation()
{
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
                context.transform(1,0,0,1,(i+1)*25,(j+1) * 25);
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
                    12,"#000000",0
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

function Circle(radius, color, opactiy)
{
    this.Y = 0,
    this.X = 0
    this.radius = radius;
    this.color = color;
    this.opactiy = opactiy;

    this.draw = function (){
        context.fillStyle = this.color;
        context.beginPath();
        context.arc( this.X, this.Y, this.radius, 0, Math.PI * 2 );
        context.closePath();
        context.fill();
    }
}