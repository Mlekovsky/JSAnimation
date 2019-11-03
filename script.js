var canvas;
var window;
var repeater;

function beginAnimation()
{
    canvas = document.getElementById( "myCanvas" );
    window = canvas.getContext( "2d" );

    window.fillStyle = backgroundColor;
    window.fillRect( 0, 0, canvas.width, canvas.height );

    repeater = setTimeout(continueAnimation, 10);
}

function continueAnimation()
{

}

function Pile()
{

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