/*
 * LeastSquares (leastsquares.js)
 * 
 */
;(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.LeastSquares = factory();
    }
}(this, function(){

    var LeastSquares = function(sample) {
        this.initialize.apply(this, arguments);
        return this;
    };

    LeastSquares.VERSION = '1.0';

    LeastSquares.prototype.initialize = function(sample) {
        this.sample = sample || {};
    };

    LeastSquares.prototype.getSlope = function() {
        var n = this.sample.length;
        var sigmaXY = 0;
        var sigmaX = 0;
        var sigmaY = 0;
        var sigmaXSquare = 0;
        var x;
        var y;
        for (var i = 0; i < n; i++) {
            x = this.sample[i].x;
            y = this.sample[i].y;
            sigmaXY += x * y;
            sigmaX += x;
            sigmaY += y;
            sigmaXSquare += x * x;
        }
        return (n * sigmaXY - sigmaX * sigmaY)
               / ((n * sigmaXSquare) - sigmaX * sigmaX);
    };

    LeastSquares.prototype.getIntercept = function() {
        var n = this.sample.length;
        var sigmaXY = 0;
        var sigmaX = 0;
        var sigmaY = 0;
        var sigmaXSquare = 0;
        var x;
        var y;
        for (var i = 0; i < n; i++) {
            x = this.sample[i].x;
            y = this.sample[i].y;
            sigmaXY += x * y;
            sigmaX += x;
            sigmaY += y;
            sigmaXSquare += x * x;
        }
            return (sigmaXSquare * sigmaY - sigmaXY * sigmaX) 
                　　/ ((n * sigmaXSquare) - sigmaX * sigmaX);
    };

    LeastSquares.prototype.getSD = function() {
        var n = this.sample.length;
        var x;
        var y;
        var variance = 0;
        var sD;
        var slope = this.getSlope();
        var intercept = this.getIntercept();
        for (var i = 0; i < n; i++) {
            x = this.sample[i].x;
            y = this.sample[i].y;
            variance += Math.pow(y - (slope * x + intercept), 2);
        }
        variance /= n;
        sD = Math.sqrt(variance);
        
        return sD;
    };

    return LeastSquares;
}));
