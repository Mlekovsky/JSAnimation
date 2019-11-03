var canvas;
var window;
var repeater;
var pile;

function beginAnimation()
{
    canvas = document.getElementById( "myCanvas" );
    window = canvas.getContext( "2d" );

    window.fillStyle = backgroundColor;
    window.fillRect( 0, 0, canvas.width, canvas.height );

    pile = new Pile();    

    repeater = setTimeout(continueAnimation, 10);
}

function continueAnimation()
{

}

function Pile()
{
    this.cannonBalls = [];
    this.height = 0;

    this.addCannonBall = function(Circle)
    {
        cannonBalls.push(Circle);
    }

    this.setHeight = function(height)
    {
        this.height = height;
    }

    this.draw = function()
    {
        fillCannonBalls();
        drawCannonBalls();
    }

    this.drawCannonBalls = function()
    {
        for(var i = 0; i < this.height; i++)
        {
            
        }
    }

    this.fillCannonBalls = function(){
        for(var i = 0; i < this.height; i++)
        {
            for(var j = 0; j < i; j++)
            {
               cannonBalls.push(new Circle(
                    10,"#FFFFFF",0
               ));
            }
        }   
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
        context.arc( this.X, this.Y, this.radius, 0, Math.PI * 2, true );
        context.closePath();
        context.fill();
    }
}