define(function(require, exports, module) {

	function getFontHeightInPixels(fontFamily, fontSize, fontWeight) {  //计算当前字体字号情况下的lineheight

		var height, textMeasureEl;

		fontWeight = fontWeight || "normal";

		try {
			var style = "position:absolute; left:0px; top:-20000px; padding:0px;margin:0px;border:none;white-space:pre;line-height:" + fontSize + "px;" + "font-family:" + fontFamily + "; " + "font-size:" + fontSize + "px; font-weight:" + fontWeight + ";";

			if (!textMeasureEl) {
				var body = document.body;
				textMeasureEl = document.createElement("span");
				textMeasureEl.innerHTML = "";
				var textNode = document.createTextNode("test");
				textMeasureEl.appendChild(textNode);
				body.appendChild(textMeasureEl);
			}

			textMeasureEl.style.display = "";
			textMeasureEl.setAttribute("style", style);

			height = Math.round(textMeasureEl.offsetHeight);
			textMeasureEl.style.display = "none";
			body.removeChild(textMeasureEl);
		} catch (e) {
			height = Math.ceil(fontSize * 1.1);
		}

		return Math.max(height, fontSize);
	}

	var rAF = window.requestAnimationFrame	||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame		||
		window.msRequestAnimationFrame		||
		function (callback) { window.setTimeout(callback, 1000 / 60); };

	function Pie (opt) {

		var textAttr;
		
		this.options = {

			selector: '#canvas',
			lineWidth: 1,
			strokeStyle: '',  //笔触颜色	////哪里在用？
			fillStyle: '',  //填充颜色	////同上
			autoline: 20,
			radio: 0.60,
			per: 0.10,
			textAttr: {
				fontSize: 12,
				fontWeight: 'normal',
				fontFamily: 'Helvetica Neue'
			},
			padding: 10,
			radius: 0,
			animateEnble: true,
			type: 1
		};

		$.extend(this.options, opt);

		this.init();
	}

	Pie.prototype = {

		clear: function  (x,y,w,h) {  //清除canvas内容
			
			var width = w ? w : this.width,
				height = h ? h : this.height;
			this.context.clearRect(x || 0, y || 0, width, height);
		},

		filterData: function  (data) {  //筛掉小于等于0的数据
			
			var arr = [];

			data.forEach(function  (item, index) {
				
				if (item.data > 0) {
					arr.push(item);
				}
			});

			return arr;
		},

		sort: function  (data) {  //对数据进行排序：从小到大
			
			return data.sort(function(a, b) {

				if (a.data < b.data) {
					return -1;

				} else if (a.data == b.data) {
					return 0;
				} else {
					return 1;
				}
			});
		},

		getSum: function  (data) {  //数据求和
			
			var sum = 0;

			data.forEach(function  (item, index) {
				
				sum += item.data ? parseFloat(item.data) : 0;
			});

			return sum;
		},

		formatPercent: function  (data) {  //将数据变为百分数
			
			data = (data || 0) * 100;
			return (data.toString().length > 5 ? data.toFixed(2) : data) + '%';
		},

		getTextAttr: function  (percent, startAngel, angel, item, index, lastItem) {  //返回文本相关信息（文本内容、坐标、对齐方式、颜色等）

			angel = startAngel + angel / 2;
			var lradius = this.radius * (percent < this.options.per ? 1 : this.options.radio),
				cos = Math.cos(angel),
				sin = Math.sin(angel),
				pos = {}, formatPercent;

			pos.sx = this.x + lradius * cos;  //this.x,this.y为圆心坐标	////why?
			pos.sy = this.y + lradius * sin;
			pos.textAlign = 'center';

			pos.textBaseline = item.label ? ['bottom', 'top'] : ['middle'];  //如果数据中有label的话，label和ratio分为两行，竖直方向分别下对齐和上对齐，如果没有的话，只有ratio一行文本，竖直方向居中对齐。
			formatPercent = this.formatPercent(percent);
			pos.text = item.label ? [item.label , formatPercent] : [formatPercent];

			if (percent < this.options.per) {

				pos.mx = this.x + (lradius + this.options.autoline) * cos;
				pos.my = this.y + (lradius + this.options.autoline) * sin;

				if ('my' in lastItem && Math.abs(lastItem['my'] - pos.my) < this.LINEHEIGHT*2) {  //字体重合
					pos.my = pos.my + this.LINEHEIGHT*2;
				}

				if (Math.abs(sin) !== 1) {
					pos.ex = pos.mx + (cos > 0 ? this.options.autoline : -this.options.autoline);
					pos.ey = pos.my;
				}

				pos.textAlign = 'left';
				pos.strokeStyle = pos.fillStyle = '#999999';	////如何将此颜色值提到参数设置中去？
			}else {
				pos.fillStyle = '#FFFFFF';	////同上
			}

			return pos;
		},

		handleData: function  (data) {  //返回角度、填充颜色以及文本相关信息
			
			data = this.filterData(data);
			var _this = this,
				arr = [],
				sum = this.getSum( data ),
				lastend = -Math.PI / 4,
				allAngel = Math.PI * 2;

			var percent,angel;

			if (sum == 0) {

				return [{}];
			}

			data = this.sort(data);
			data.forEach(function  (item, index) {
				
				percent = item.ratio ? item.ratio : item.data / sum;
				angel = percent * allAngel;

				arr.push({
					startAngel: lastend,
					middleAngel: lastend + angel / 2,
					endAngel: lastend + angel,
					fillStyle: item.fillStyle,
					textParams: _this.getTextAttr(percent, lastend, angel, item, index, index > 0 ? arr[index - 1].textParams : {})
				});

				lastend += angel;
			});

			if (data.length == 1) {
				arr[0].textParams['sx'] = this.x;  //如果只有一组数据，文本写在圆心处
				arr[0].textParams['sy'] = this.y;
			}

			return arr;
		},

		drawText: function  (textParams) {  //画文本及指向线
			
			var context = this.context,
				options = this.options,
				textAttr = options.textAttr,
				font  = textAttr.fontWeight + ' ' + textAttr.fontSize + 'px ' + textAttr.fontFamily;

			context.lineWidth = options.lineWidth;

			if ('mx' in textParams) {
				context.beginPath();
				context.strokeStyle = textParams.strokeStyle;
				context.moveTo(textParams.sx,textParams.sy);
				context.lineTo(textParams.mx,textParams.my);

				if ('ex' in textParams) {
					context.lineTo(textParams.ex,textParams.ey);
				}
				context.stroke();
			}

			context.font = font;
			context.textAlign = textParams.textAlign;
			context.fillStyle = textParams.fillStyle;
			textParams.textBaseline.forEach(function  (item, index) {

				context.textBaseline = item;
				context.fillText( textParams.text[index], textParams.ex || textParams.mx || textParams.sx, textParams.ey || textParams.my || textParams.sy);
			});
		},

		drawSector: function  (item) {  //画扇形

			var context = this.context;

			context.beginPath();
			context.arc(item.x || this.x, item.y || this.y, item.radius || this.radius, item.startAngel, item.endAngel,false);
			context.lineTo(item.x || this.x, item.y || this.y);
			context.closePath();
			context.fillStyle = item.fillStyle;
			context.fill();
		},

		drawPie: function  (data, flag) {  //画圆及文本

			var _this = this;

			this.clear();

			data.forEach(function  (item, index) {
				_this.drawSector(item);

				if (flag == true) {
					_this.drawText(item.textParams);
				}
			});
		},

		linear: function (start, alter, curTime, dur) {

            return start + curTime / dur * alter;
        },

        easeInQuad: function (t, b, c, d) {
			return c*(t/=d)*t + b;  //时间函数，速度先慢后快，公式相当于c * t2 / d2 + b（t2是t的平方的意思）
		},

        getSection: function (val, data) {
        	
        	var arr = [],
        		lastend = 0;

        	val -= Math.PI / 4;

        	for (var i = 0, length = data.length; i < length; i ++ ){

        		if (val >= data[i].startAngel && val <= data[i].endAngel) {
        			arr.push({
        				fillStyle: data[i].fillStyle,
        				startAngel: data[i].startAngel,
        				endAngel: val
        			});       			
        			break;
        		}

        		arr.push(data[i]);
        	}

        	//alert(arr);  慢动作看动画过程
			return arr;			
        },

		animateDrawCircle: function  (data) {  //画圆动画
			
			var angel = Math.PI * 2,
				t = 0,  //时间点
                c = 360,  //360度
                d = 1000,  //动画继续的时间
                b = 0,  //起始值
                step = 1000 / 60;

            var _this = this;

			var fn = function  () {
				
				var val;

                if (t > d) {
                    _this.drawPie(data, true);
                    return;
                }

                val = _this.easeInQuad(t, b , c, d);  //time-function获取当前时间点的度数
                _this.drawPie( _this.getSection(angel * val / 360, data) );  //画扇形
                t += step;
                rAF(fn);  //执行requestAnimationFrame
			};

			fn();
		},

		scaleDrawSector: function  (data, index) {  //点击放大动画
			var start = 0,
                alter = 10,
                dur = 400,
                curTime = 0,
                step = 1000 / 60;

            var _this = this,
            	radius = this.radius,
            	preRadius = this.radius + alter;

            this.isInAnimating = true;

            var after = function  () {
            	
            	if (_this.index === index) {  //上次和这次
            		data[index].radius = radius;
            	}else{
            		data[index].radius = preRadius;
            	}

            	if (_this.index !== false && index !== _this.index) {

                	data[_this.index].radius = radius;
                }

                return data;
            };

			var scale = function  () {
				
				var val;

                if (curTime > dur) {
                    _this.drawPie(after(data), true);
                    _this.isInAnimating = false;
                    _this.index = _this.index === index ? false : index;
                    return;
                }

                val = _this.linear(start, alter, curTime, dur);

                if (_this.index === index) {

                	data[index].radius = preRadius - val;

                }else{
                	data[index].radius = radius + val;
                }

                if (_this.index !== false && index !== _this.index) {

                	data[_this.index].radius = preRadius - val;
                }

                _this.drawPie(data, true);
                curTime += step;
                //alert(curTime);  慢动作看动画过程
                rAF(scale);
			};

			scale();
		},

		animateDrawSector: function  (data, index) {  //点击移动动画
			
			var start = 0,
                alter = 12,
                dur = 400,
                curTime = 0,
                step = 1000 / 60;

            var _this = this,
            	x = data[index].x || this.x,
            	y = data[index].y || this.y,
            	curSin = (this.index === index ? -1 : 1) * Math.sin(data[index].middleAngel),
            	curCos = (this.index === index ? -1 : 1) * Math.cos(data[index].middleAngel),
            	preSin,preCos,x1,y1;

            if (this.index !== false && this.index !== index) {
            	preSin = -Math.sin(data[this.index].middleAngel);
            	preCos = -Math.cos(data[this.index].middleAngel);
            	x1 = data[this.index].x;
            	y1 = data[this.index].y;
            }

            this.isInAnimating = true;

			var fn = function  () {
				
				var val;

                if (curTime > dur) {
                    _this.drawPie(data, true);
                    _this.isInAnimating = false;
                    _this.index = _this.index === index ? false : index;
                    return;
                }

                val = _this.linear(start, alter, curTime, dur);

                data[index].x = x + val * curCos;
                data[index].y = y + val * curSin;

                if (_this.index !== false && index !== _this.index) {

                	data[_this.index].x = x1 + val * preCos;
                	data[_this.index].y = y1 + val * preSin;
                }

                _this.drawPie(data, true);
                curTime += step;
                rAF(fn);
			};

			fn();
		},

		isInWhichSection: function  (x, y) {
			
			var line = Math.sqrt(Math.pow(this.x - x,2) + Math.pow(this.y - y,2)),
				asin,acos,angel;

			if (line > this.radius) {
				return false;
			}

			acos = Math.acos((x - this.x) / line);
			asin = Math.asin((y - this.y) / line);

			if (acos > 0 && asin > 0) {
				angel = acos;
			}else if (acos > 0 && asin < 0) {
				angel = Math.PI * 2 - acos;
			}else if (acos < 0 && asin > 0) {
				angel = Math.PI / 2 + asin;
			}else if (acos < 0 && asin < 0) {
				angel = Math.PI - asin;
			}

			return angel;  //因为上面处理数据handleData是从-Math.PI / 4开始的
		},

		tapResponse: function  (e) {
			
			e.preventDefault();

			var offset = $(this.canvas).offset(),
				scrollTop = $(window).scrollTop(),
				x = (e.touches ? e.touches[0].clientX : e.clientX) - offset.left,
				y = (e.touches ? e.touches[0].clientY : e.clientY) - (offset.top - scrollTop), 
				angel,index;

			var lastend =  Math.PI * 7 / 4;

			if (this.isInAnimating === true) {
				return;
			}

			x = (this.canvasPixelRatio ? this.canvasPixelRatio : 1) * x;
			y = (this.canvasPixelRatio ? this.canvasPixelRatio : 1) * y;

			if ( (angel = this.isInWhichSection(x, y)) === false) {
				return;
			}

			for (var i = 0, length = this.data.length; i < length; i++) {		////此处的data从哪儿读取的？

				if (lastend < angel && angel - Math.PI * 2 < this.data[i].endAngel) {

					index = i;
					break;
				}

				if (this.data[i].startAngel <= angel && this.data[i].endAngel >= angel) {
					index = i;
					break;
				}
			}

			switch (this.options.type){

				case 1: 
					this.scaleDrawSector(this.data.concat([]), index);
					break;
				case 2: 
					this.animateDrawSector(this.data.concat([]), index);
					break;
			}
			
		},

		draw: function  (data) {
			
			this.data = data = this.handleData(data);

			var context = this.context,
				options = this.options
				_this = this;

			this.clear();

			if (options.animateEnble) {

				this.animateDrawCircle(data);

			}else {

				data.forEach(function  (item, index) {
					_this.drawSector(item);
					_this.drawText(item.textParams);
				});
			}
		},

		setPixelRatio: function  () {  //计算canvas像素比
			
			var devicePixelRatio = window.devicePixelRatio || 1;
			var backingStorePixelRatio = this.context.webkitBackingStorePixelRatio ||
				this.context.mozBackingStorePixelRatio ||
				this.context.msBackingStorePixelRatio ||
				this.context.oBackingStorePixelRatio ||
				this.context.backingStorePixelRatio || 1;
			
			//this.canvasPixelRatio = devicePixelRatio / backingStorePixelRatio;
			this.canvasPixelRatio = 1;
		},

		setSize: function  () {  //根据canvas像素比重置canvas大小
			
			var canvas = $(this.canvas),
				width = canvas.css('width'),
				height = canvas.css('height'),
				ratio = this.canvasPixelRatio;

			width = width ? parseFloat( width.replace('px', '') || 0) : canvas.parent().width();
			height = height ? parseFloat( height.replace('px', '') || 0) : canvas.parent().height();

			if ('scale' in this.context) {		////scale？
				this.context.scale(ratio, ratio);
			}

			this.width = this.canvas.width = width * ratio;
			this.height = this.canvas.height = height * ratio;
			this.canvas.style.width = width + 'px';
			this.canvas.style.height = height + 'px';
		},

		initParams: function  () {
			var options = this.options,
				textAttr = options.textAttr;

			this.setPixelRatio();
			this.setSize();
			this.LINEHEIGHT = getFontHeightInPixels(textAttr.fontFamily,textAttr.fontSize,textAttr.fontWeight);
			this.x = parseInt( this.width / 2 );  //圆心的位置
			this.y = parseInt( this.height / 2 );  //圆心的位置
			this.radius = options.radius || ( Math.min(this.width,this.height) - options.padding * 2 ) / 2;  //圆半径
			this.index = false;
		},

		init: function  () {

			var options = this.options,
				canvas;

			canvas = this.canvas = $(options.selector)[0];

			if (!canvas) {
				return;
			}

			this.context = canvas.getContext('2d');
			this.initParams();
			canvas.addEventListener('click', $.proxy(this.tapResponse, this), false);
		}
	};

    return Pie;
});
