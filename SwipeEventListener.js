(function () {
    "use strict";
    
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== 'function') {
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }
            var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }
    
    
    function SwipeEventListener(target, callback) {
        this.fingerCount = 0;
        this.startX = 0;
        this.startY = 0;
        this.curX = 0;
        this.curY = 0;
        this.minLength = 72;
        var self = this;
        this.callback = callback;
        target.addEventListener("touchstart", this.touchStart.bind(this), false);
        target.addEventListener("touchmove", this.touchMove.bind(this), false);
        target.addEventListener("touchend", this.touchEnd.bind(this), false);
    }
    SwipeEventListener.prototype.touchStart = function (event) {
        this.fingerCount = event.touches && event.touches.length || 1;
        if (this.fingerCount == 1) {
            this.startX = event.touches[0].pageX;
            this.startY = event.touches[0].pageY;
        } else {
            this.touchCancel(event);
        }
    }
    SwipeEventListener.prototype.touchMove = function (event) {
        if (event.touches && event.touches.length == 1) {
            this.curX = event.touches[0].pageX;
            this.curY = event.touches[0].pageY;
        } else {
            this.touchCancel(event);
        }
    }
    SwipeEventListener.prototype.touchEnd = function (event) {
        if (this.fingerCount == 1 && this.curX != 0) {
            var swipeLength = Math.round(Math.sqrt(Math.pow(this.curX - this.startX, 2) + Math.pow(this.curY - this.startY, 2)));
            if (swipeLength >= this.minLength) {
                var swipeAngle = this.caluculateAngle();
                var swipeDirection = this.determineSwipeDirection(swipeAngle);
                this.callback(swipeDirection, event);
                this.touchCancel(event);
            } else {
                this.touchCancel(event);
            }
        } else {
            this.touchCancel(event);
        }
    }
    SwipeEventListener.prototype.touchCancel = function (event) {
        this.fingerCount = 0;
        this.startX = 0;
        this.startY = 0;
        this.curX = 0;
        this.curY = 0;
    }
    SwipeEventListener.prototype.caluculateAngle = function () {
        var X = this.startX - this.curX;
        var Y = this.curY - this.startY;
        var Z = Math.round(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2)));
        var r = Math.atan2(Y, X);
        var swipeAngle = Math.round(r * 180 / Math.PI);
        if (this.swipeAngle < 0) {
            this.swipeAngle = 360 - Math.abs(this.swipeAngle);
        }
        return swipeAngle;
    }
    SwipeEventListener.prototype.determineSwipeDirection = function (swipeAngle) {
        var swipeDirection = '';
        if ((swipeAngle <= 45) && (swipeAngle >= -45)) {
            swipeDirection = 'left';
        } else if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            swipeDirection = 'left';
        } else if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            swipeDirection = 'right';
        } else if ((swipeAngle > 45) && (swipeAngle < 135)) {
            swipeDirection = 'down';
        } else {
            swipeDirection = 'up';
        }
        return swipeDirection;
    }
    window.addSwipeListener = function (target, callback) {
        if (target.nodeName == undefined) {
            return;
        }
        callback = typeof callback == 'function' ? callback : function () {};
        var obj = new SwipeEventListener(target, callback);
    }
})();
