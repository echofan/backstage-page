define(function(require, exports, module) {

    var requestAnimFrame = window.requestAnimationFrame	||
        window.webkitRequestAnimationFrame	||
        window.mozRequestAnimationFrame		||
        window.oRequestAnimationFrame		||
        window.msRequestAnimationFrame		||
        function (callback) { window.setTimeout(callback, 1000 / 60); };

    var Chart = function(opts){
        this.defs = {
            selector: '#canvas',
            point: 'pctchg',
            xCount: 4,
            yCount: 4,
            offset: {
                top: 40,
                right: 100,
                bottom: 80,
                left: 20
            }
        };

        var _extend = function(source, destination){
            if(typeof source !== 'object'){
                source = {};
            }
            for(var property in source){
                destination[property] = source[property];
            }
        }
        _extend(opts, this.defs);

        this.init();
    };

    Chart.prototype = {
        //格式化日期，将20160906改为09/06
        formateDate: function(day){
            var d = day.toString();
            return d.substring(4, 6) + '/' + d.substring(6);
        },
        absPercent: function(){
            var maxPer = 0, minPer = 1;
            for(var i=0; i<this.defs.days.length; i++){
                var day = this.defs.days[i];
                for(var j=0; j<day.data.length; j++){
                    maxPer = Math.max(maxPer, day.data[j][this.defs.point]);
                    minPer = Math.min(minPer, day.data[j][this.defs.point]);
                }
            }
            return {
                max: maxPer,
                min: minPer,
                abs: maxPer - minPer
            }
        },
        //标注右边百分比
        fillRightText: function(){
            var ctx = this.ctx;
            var cols = this.cols;
            var yCount = this.defs.yCount;
            var newAbs = cols.abs * 1.1;
            var newMin = cols.min * 1.1;
            var newMax = cols.max * 1.1;
            var percent = newMin*100;

            for(var i=this.reginLines.length-1; i>=0; i--){
                ctx.fillText(percent.toFixed(2)+'%', this.reginLines[i].x + 10, this.reginLines[i].y-30);
                percent +=  newAbs/yCount*100;
            }

        },
        //标注底部日期
        fillBottomText: function(){
            var ctx = this.ctx;
            var day = this.defs.days[0];
            var len = day.data.length;
            var xCount = this.defs.xCount;
            var yCount = this.defs.yCount;
            var width = this.width/xCount;
            var top = this.height - this.defs.offset.bottom + 30;
            var left = 0;

            //字体设置
            ctx.font = '20px Verdana';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';

            if(typeof day.data === 'object' && len > 4){
                for(var i=0; i<xCount; i++){
                    var num = Math.ceil(len/xCount*i);
                    if(i == xCount-1){
                        num = len - 1;
                    }
                    //输出日期
                    left = this.defs.offset.left+width*i + 25;
                    ctx.fillText(this.formateDate(day.data[num]['transday']), left, top);
                }
            }
        },
        //画曲线
        drawLines: function(){
            var that = this;
            var ctx = this.ctx;
            var days = this.defs.days;
            var cols = this.cols;
            var colsH = (this.height-this.defs.offset.top-this.defs.offset.bottom)/(cols.abs*1.1);

            //循环画多条线
            for(var i in days){
                var day = days[i];
                var data = day.data;
                var point = that.defs.point;
                var w = (that.width-that.defs.offset.left-that.defs.offset.right) / (data.length-1);	//每个点的距离

                //开始画线
                var j = 0,
                    x = that.defs.offset.left,
                    y = that.height-that.defs.offset.bottom+cols.min*1.1*colsH;
                //直线的起点
                ctx.moveTo(x, y);
                ctx.beginPath();

                //循环画每个点
                for(j=1; j<data.length-1; j++){
                    ctx.lineTo(j*w+x, y-data[j][point]*colsH); 	//直线的终点
                    ctx.lineWidth = 3; 							//直线的宽度
                    ctx.strokeStyle = day.fillStyle;			//直线的颜色
                    ctx.lineCap = 'round';						//直线端点：round、butt、square
                    ctx.stroke();
                }
                ctx.closePath();
            }
        },
        //画曲线框
        drawRegin: function(){
            var ctx = this.ctx;
            var count = 4;
            var x = y = 0;
            var width = this.width - this.defs.offset.left - this.defs.offset.right;
            var height = this.height - this.defs.offset.top - this.defs.offset.bottom;
            var rowHeight = height/count;
            //记录线的位置
            this.reginLines = [];

            //开始画曲线框和线
            ctx.save();
            ctx.translate(this.width/2, this.height/2);
            ctx.rotate(Math.PI);
            ctx.translate(-this.width/2, -this.height/2);
            //画曲线框
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#ececec';
            ctx.lineWidth = 1;
            ctx.fillRect(this.defs.offset.right, this.defs.offset.bottom, width, height);
            ctx.strokeRect(this.defs.offset.right, this.defs.offset.bottom, width, height);
            //画直线
            ctx.strokeStyle = '#ddd';
            for(var i=0; i<count; i++){
                y = this.defs.offset.bottom + rowHeight * i;
                x = this.defs.offset.left + width + 35;
                ctx.beginPath();
                ctx.moveTo(this.defs.offset.right, y);
                ctx.lineTo(this.defs.offset.right + width, y);
                ctx.stroke();
                ctx.closePath();
                this.reginLines.push({x: x, y: y});
            }
            y = this.defs.offset.bottom + rowHeight * count;
            x = this.defs.offset.left + width + 35;
            this.reginLines.push({x: x, y: y});

           ctx.restore();
        },
        clearRect: function(x, y, w, h){
            x = x || 0;
            y = y || 0;
            w = w || this.width;
            h = h || this.height;
            this.ctx.clearRect(x, y, w, h);
        },
        paint: function(){
            this.clearRect();
            this.drawRegin();
            this.drawLines();
            this.fillBottomText();
            this.fillRightText();
        },
        init: function(){
            this.cols = this.absPercent();
            this.canvas = document.querySelector(this.defs.selector);
            this.ctx = this.canvas.getContext('2d');
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.paint();
        }
    }

    return Chart;
});

