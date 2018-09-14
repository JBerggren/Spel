function Vector(x, y) {
    this.x = x;
    this.y = y;
    this.angle = Math.atan2(this.y, this.x);
    this.angle = this.angle >= 0 ? this.angle : this.angle + 2 * Math.PI;
}

Vector.prototype.getLength = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.setLength = function(length) {    
    if (length < 0) {
        this.x = 0;
        this.y = 0;
        return;
    }
    
    this.x = Math.cos(this.angle) * length;
    this.y = Math.sin(this.angle) * length;
};

Vector.prototype.getAngle = function() {
    var angle = Math.atan2(this.y, this.x);
    return angle >= 0 ? angle : angle + 2*Math.PI;
};

Vector.prototype.setAngle = function (angle) {
    var length = this.getLength();
    this.angle = angle;
    this.setLength(length);
};
