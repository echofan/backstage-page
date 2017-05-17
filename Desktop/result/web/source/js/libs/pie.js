define(function(require, exports, module) {

    var Pie = function(opts) {
        this.defs = {
            selector: '#canvas',
            r: 150,
            data: null
        }

        this.extend(opts, this.defs);
        this.init();

    };

    Pie.prototype = {
        /**
         ** 覆盖配置项
         */
        extend: function(source, destination){
            for(src in source){
                destination[src] = source[src];
            }
            return destination;
        },
        /**
         ** 重置canvas 的宽和高
         */
        resetCanvas: function(w, h){
            this.canvas.style.width = w + 'px';
            this.canvas.style.height = h + 'px';
        },
        /**
         ** 获取所有数据总和
         */
        getTotal: function(data){

            if(data){
                var amountTotal = 0;
                for (var i = 0; i < data.length; i++) {
                    amountTotal += data[i].amount;
                }
                return amountTotal;
            }
        },
        /**
         ** 获取圆的数据
         */
        getPieData: function(){
            var r = this.defs.r;
            var data = this.defs.data;
            var total = this.getTotal(data);
            var angle = -Math.PI/2, lineAngle = 0;
            var x, y, x1, y1;
            var colors = ['#2196F3', '#9B58B5', '#FF8806','#2196F3', '#9B58B5', '#FF8806','#2196F3', '#9B58B5', '#FF8806','#2196F3', '#9B58B5', '#FF8806','#2196F3', '#9B58B5', '#FF8806','#2196F3', '#9B58B5', '#FF8806'];
            if(data){
                for (var i = 0; i < data.length; i++) {
                    lineAngle = angle + data[i].percent * Math.PI;
                    angle += data[i].percent * 2 * Math.PI;

                    x = r*1.05 * Math.cos(lineAngle);
                    y = r*1.05 * Math.sin(lineAngle);
                    x1 = 3*r/2 * Math.cos(lineAngle);
                    y1 = 3*r/2 * Math.sin(lineAngle);

                    data[i].fillStyle = colors[i];
                    data[i].linePoint = [{x: x, y: y}, {x : x1, y: y1}];
                }
                return data;
            }
        },
        /**
         ** 画圆
         */
        drawCircle: function(){
            var ctx = this.ctx;
            var pieData = this.getPieData();
            var r = this.defs.r;
            //开始画圆
            var startArc = endArc = -Math.PI/2;

            for(var i=0; i<pieData.length; i++){
                endArc += 2*Math.PI*pieData[i].percent;

                ctx.beginPath();
                ctx.arc(this.width/2, this.height/2, r, startArc, endArc, false);
                ctx.lineTo(this.width/2, this.height/2, 150);
                ctx.fillStyle = pieData[i].fillStyle;
                ctx.fill();
                ctx.closePath();

                this.drawLines(ctx, pieData[i].linePoint, pieData[i].label, pieData[i].percent);
                startArc = endArc;
            }
        },
        fillText: function(ctx, x, y, text) {
            ctx.font = '24px Georgia';
            ctx.fillStyle = '#666';
            ctx.fillText(text, x, y);
        },
        /**
         ** 画线条
         */
        drawLines: function(ctx, linePoint, label, per){
            var width = this.width/2;
            var height = this.height/2;
            var lineDist = 0, textDist = 10;
            var percent = (per*100).toFixed(2) + '%';
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#666';
            ctx.beginPath();
            ctx.moveTo(width + linePoint[0].x, height + linePoint[0].y);
            ctx.lineTo(width + linePoint[1].x, height + linePoint[1].y);
            ctx.stroke();

            if(linePoint[0].x>0){
                lineDist = 100;
            }else if(linePoint[0].x<0){
                textDist -= 100;
                lineDist = -100;
            }
            ctx.lineTo(width + linePoint[1].x + lineDist, height + linePoint[1].y);
            ctx.stroke();
            ctx.closePath();

            this.fillText(ctx, width + linePoint[1].x + textDist, height + linePoint[1].y-15, label);
            this.fillText(ctx, width + linePoint[1].x + textDist, height + linePoint[1].y+20, percent);
        },
        /**
         ** 覆盖配置项
         */
        init: function() {
            this.canvas = document.querySelector(this.defs.selector);
            this.ctx = this.canvas.getContext('2d');
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.resetCanvas(this.width/2, this.height/2);
            this.drawCircle();
        }
    }

    return Pie;
});
