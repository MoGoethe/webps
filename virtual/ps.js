(function(win, doc) {
    var PhotoShop = function(config) {
        var _this = this;
        _this.canvas = config.canvas,
        _this.upLoadButton = config.upLoadButton,
        _this.proxyUpLoadButton = config.proxyUpLoadButton,
        _this.container = config.container;
        _this.ctx = _this.canvas.getContext('2d');

        _this.maxCanvasWidth = 0;
        _this.maxCanvasHeight = 0;
        _this.minCanvasWidth = 0;
        _this.minCanvasHeight = 0;

        _this.__img = new Image();

        _this.__getImage = function(file) {

            var reader = new FileReader(),
                button = _this.upLoadButton;

            reader.readAsDataURL(button.files[0]);
            reader.onload = function() {
                _this.__img.src = reader.result;
            }
        };

        _this.__reLoad = function() {
            var img = _this.__img,
                width = img.width,
                height = img.height,
                cw = _this.container.offsetWidth,
                ch = _this.container.offsetHeight,
                canvasW = width,
                canvasH = height;

            var mult_w = (width / cw).toFixed(2);
            mult_h = (height / ch).toFixed(2);

            if (mult_w > 1 || mult_h > 1) {
                var mult_base = (mult_h > mult_w) ? mult_h : mult_w; //获取缩放倍数

                canvasW = parseInt((width / mult_base).toFixed(2));
                canvasH = parseInt((height / mult_base).toFixed(2));

            }

            _this.maxCanvasWidth = width * 3;
            _this.maxCanvasHeight = height *3;
            _this.minCanvasWidth = canvasW;
            _this.minCanvasHeight = canvasH;           

            _this.canvas.width = canvasW;
            _this.canvas.height = canvasH;
            _this.ctx.drawImage(img, 0, 0, canvasW, canvasH);

            _this.__setInitPosition();
        };

        _this.__setInitPosition = function() {
            var canvas = _this.canvas,
                canvasWidth = canvas.width,
                canvasHeight = canvas.height;

            var cw = _this.container.offsetWidth,
                ch = _this.container.offsetHeight;

            var posCanvasleft = (cw - canvasWidth) / 2;
            var posCanvasTop = (ch - canvasHeight) / 2;

            _this.canvas.style.width = canvasWidth + 'px';
            _this.canvas.style.height = canvasHeight + 'px';

            _this.canvas.style.position = "absolute";
            _this.canvas.style.zIndex = "1";
            _this.canvas.style.left = posCanvasleft + 'px';
            _this.canvas.style.top = posCanvasTop + 'px';
        };

        _this.upLoadButton.onchange = _this.__getImage;
        _this.__img.onload = _this.__reLoad;

        _this.init();

        return {
            setRGBData: _this.setRGBData,
            setFilter : _this.setFilter
        }
    };

    PhotoShop.prototype = {
        init: function() {
            console.log(" init function");

            var _this = this;

            _this.refreshPosition();
            _this.dragMove(_this.canvas);
            _this.scrollFun(_this.canvas, _this._narrow, _this._enlarge);

        },

        refreshPosition: function() {
            var _this = this;
            window.onresize = function() {
                _this.setCanvasPosition();
            }
        },

        setCanvasPosition: function() {
            var _this = this,
                canvas = _this.canvas,
                cw = _this.container.offsetWidth,
                ch = _this.container.offsetHeight,
                canvasW = canvas.width,
                canvasH = canvas.height;

            var posCanvasleft = (cw - canvasW) / 2;
            var posCanvasTop = (ch - canvasH) / 2;

            canvas.style.left = posCanvasleft + 'px';
            canvas.style.top = posCanvasTop + 'px';
        },

        dragMove: function(dom) {
            var _this = this,
                _dom = dom,
                _startPos, //cursor start position
                realPos = { x: 0, y: 0 },
                startDOMPos,
                _endPos, //cursor end position
                deviationX,
                deviationY,
                _dragStatus = false;

            _dom.onmousedown = function() {
                if (window.moveTimer) clearInterval(window.moveTimer);
                _dragStatus = true;
                _startPos = cursorPosition();
                var x = dom.offsetLeft;

                var y = dom.offsetTop;

                startDOMPos = {
                    x: x,
                    y: y
                }
            }

            _dom.onmousemove = function() {
                if (!_dragStatus) return;

                _endPos = cursorPosition(); // now cursor position

                deviationX = _endPos.x - _startPos.x; // now cursor deviation x more than 0 right
                deviationY = _endPos.y - _startPos.y; // now cursor deviation y more than 0 down

                _dom.style.left = startDOMPos.x + deviationX + 'px';
                _dom.style.top = startDOMPos.y + deviationY + 'px';

            }

            _dom.onmouseup = function() {
                /*
                      释放的时候  计算正确位置
                */
                var imageWidth, imageHeight, containerWidth, containerHeight, nowLeft, nowTop;

                imageWidth = _dom.offsetWidth; //image width    
                imageHeight = _dom.offsetHeight; //image height
                nowLeft = _dom.offsetLeft; // now margin left
                nowTop = _dom.offsetTop; // now margin top
                containerWidth = _this.container.offsetWidth; //container width
                containerHeight = _this.container.offsetHeight; //container height

                //判断图片宽高是否大于容器宽高，如果不，则始终居中
                if (imageWidth <= containerWidth && imageHeight <= containerHeight) {
                    realPos.x = (containerWidth - imageWidth) / 2;
                    realPos.y = (containerHeight - imageHeight) / 2;

                } else if (imageWidth <= containerWidth && imageHeight > containerHeight) {
                    realPos.x = (containerWidth - imageWidth) / 2;
                    //判断Y轴位移方向，判断偏移量 以及边界
                    if (deviationY < 0) {
                        //move up
                        if (containerHeight > imageHeight + nowTop) {
                            realPos.y = containerHeight - imageHeight;
                        } else {
                            realPos.y = nowTop;
                        }

                    } else {
                        if (nowTop > 0) {
                            realPos.y = 0;
                        } else {
                            realPos.y = nowTop;
                        }
                    }

                } else if (imageWidth > containerWidth && imageHeight <= containerHeight) {
                    //判断X轴移动方向
                    if (deviationX < 0) {

                        if (containerWidth > imageWidth + nowLeft) {
                            realPos.x = containerWidth - imageWidth;
                        } else {
                            realPos.x = nowLeft;
                        }

                    } else {
                        if (nowLeft > 0) {
                            realPos.x = 0;
                        } else {
                            realPos.x = nowLeft;
                        }
                    }

                    realPos.y = (containerHeight - imageHeight) / 2;

                } else if (imageWidth > containerWidth && imageHeight > containerHeight) {
                    if (deviationX < 0) {

                        if (containerWidth > imageWidth + nowLeft) {
                            realPos.x = containerWidth - imageWidth;
                        } else {
                            realPos.x = nowLeft;
                        }

                    } else {
                        if (nowLeft > 0) {
                            realPos.x = 0;
                        } else {
                            realPos.x = nowLeft;
                        }
                    }

                    if (deviationY < 0) {
                        //move up
                        if (containerHeight > imageHeight + nowTop) {
                            realPos.y = containerHeight - imageHeight;
                        } else {
                            realPos.y = nowTop;
                        }

                    } else {
                        if (nowTop > 0) {
                            realPos.y = 0;
                        } else {
                            realPos.y = nowTop;
                        }
                    }

                }

                if (_dragStatus) _this.Animate(_dom, realPos, 800);
                _dragStatus = false;

            }
            var cursorPosition = function() {
                var ev = ev || window.event;
                if (ev.pageX || ev.pageY) {
                    return { x: ev.pageX, y: ev.pageY };
                }
                return {
                    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                    y: ev.clientY + document.body.scrollTop - document.body.clientTop
                };
            };
        },

        Animate: function(dom, position, duration, callback) {
            //移动到指定位置，position:移动到指定left及top 格式{left:120, top:340}或{left:120}或{top:340}；speed:速度 1-100，默认为10

            var startTime = +new Date;
            var startPos = {
                x: dom.offsetLeft,
                y: dom.offsetTop
            };
            if (window.moveTimer) clearInterval(window.moveTimer);
            var sineaseOut = function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            }
            window.moveTimer = setInterval(function() {
                if (step() == false) {
                    clearInterval(window.moveTimer);
                    if (callback) callback.call(element);
                }
            }, 19);

            var step = function() {
                var t = +new Date;
                if (t >= startTime + duration) {
                    update(dom, position);
                    return false;
                }
                var pos = { x: 0, y: 0 };

                pos.x = sineaseOut(t - startTime, startPos.x, position.x - startPos.x, duration);
                pos.y = sineaseOut(t - startTime, startPos.y, position.y - startPos.y, duration);

                update(dom, pos);
            };

            var update = function(dom, pos) {
                dom.style.left = pos.x + 'px';
                dom.style.top = pos.y + 'px';
            }
        },

        scrollFun: function(dom, eu, ed) {
            var _this = this;

            var __scrollFun = function(e) {
                e = e || window.event;
                if (e.wheelDelta) {
                    if (e.wheelDelta > 0) {
                        eu.call(dom, _this);
                    }
                    if (e.wheelDelta < 0) {
                        ed.call(dom, _this);
                    }
                } else if (e.detail) {
                    if (e.detail > 0) {
                        eu.call(dom, _this);
                    }
                    if (e.detail < 0) {
                        ed.call(dom, _this);
                    }
                }
                _this.setCanvasPosition();
            }
            if (document.addEventListener) {
                dom.addEventListener('DOMMouseScroll', __scrollFun, false);
            }
            dom.onmousewheel = __scrollFun;

        },

        _narrow: function(ps) {
            var self = this,
                that = ps,
                img = that.__img,
                baseWidth = img.width,
                baseHeight = img.height,
                canvasW = self.width,
                canvasH = self.height,
                maxWidth = that.maxCanvasWidth,
                maxHeight = that.maxCanvasHeight,
                minWidth = that.minCanvasWidth,
                minHeight = that.minCanvasHeight;
                _mult = 0.94,

            console.log("缩小之前：",canvasW,canvasH);

            canvasW = parseInt((canvasW * _mult).toFixed(2));
            canvasH = parseInt((canvasH * _mult).toFixed(2));
            
            console.log("计算之后：",canvasW,canvasH);

            if(canvasW == minWidth || canvasH == minHeight){
                return false;
            }

            if(canvasW < minWidth || canvasH < minHeight){
                canvasW = minWidth;
                canvasH = minHeight;
            }

            console.log("缩小为：",canvasW,canvasH);

            self.width = canvasW;
            self.height = canvasH;
            self.style.width = canvasW + 'px';
            self.style.height = canvasH + 'px';
            that.ctx.drawImage(img, 0, 0, canvasW, canvasH);
        },
        _enlarge: function(ps) {
            var self = this,
                that = ps,
                img = that.__img,
                baseWidth = img.width,
                baseHeight = img.height,
                canvasW = self.width,
                canvasH = self.height,
                maxWidth = that.maxCanvasWidth,
                maxHeight = that.maxCanvasHeight,
                minWidth = that.minCanvasWidth,
                minHeight = that.minCanvasHeight;
                _mult = 1.08,

            console.log("放大之前：",canvasW,canvasH);

            canvasW = parseInt(canvasW * _mult).toFixed(2);
            canvasH = parseInt(canvasH * _mult).toFixed(2);
            
            console.log("计算之后：",canvasW,canvasH);

            if(canvasW == maxWidth || canvasH == maxHeight){
                return  false;
            }

            if(canvasW > maxWidth || canvasH > maxHeight){
                canvasW = maxWidth;
                canvasH = maxHeight;
            }

            console.log("放大为：",canvasW,canvasH);

            self.width = canvasW;
            self.height = canvasH;
            self.style.width = canvasW + 'px';
            self.style.height = canvasH + 'px';
            that.ctx.drawImage(img, 0, 0, canvasW, canvasH);

        },

        setRGBData: function(rgb) {
            console.log(rgb);
        },

        setFilter:function(name,obj){
            var _this = this;

            switch(name){
                case "blurImage" : console.log("a");
                    return;
                case "2" : console.log("aaaa");

            }



        }

    }

    window.PhotoShop = PhotoShop;

})(window, document)

var gfilter = {  
    type: "canvas",  
    name: "filters",  
    author: "zhigang",  
    getInfo: function () {  
        return this.author + ' ' + this.type + ' ' + this.name;  
    },  
  
    /** 
     * invert color value of pixel, new pixel = RGB(255-r, 255-g, 255 - b) 
     *  
     * @param binaryData - canvas's imagedata.data 
     * @param l - length of data (width * height of image data) 
     */  
    colorInvertProcess: function(binaryData, l) {  
        for (var i = 0; i < l; i += 4) {  
            var r = binaryData[i];  
            var g = binaryData[i + 1];  
            var b = binaryData[i + 2];  
      
            binaryData[i] = 255-r;  
            binaryData[i + 1] = 255-g;  
            binaryData[i + 2] = 255-b;  
        }  
    },  
      
    /** 
     * adjust color values and make it more darker and gray... 
     *  
     * @param binaryData 
     * @param l 
     */  
    colorAdjustProcess: function(binaryData, l) {  
        for (var i = 0; i < l; i += 4) {  
            var r = binaryData[i];  
            var g = binaryData[i + 1];  
            var b = binaryData[i + 2];  
  
            binaryData[i] = (r * 0.272) + (g * 0.534) + (b * 0.131);  
            binaryData[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);  
            binaryData[i + 2] = (r * 0.393) + (g * 0.769) + (b * 0.189);  
        }  
    },  
      
    /** 
     * deep clone image data of canvas 
     *  
     * @param context 
     * @param src 
     * @returns 
     */  
    copyImageData: function(context, src)  
    {  
        var dst = context.createImageData(src.width, src.height);  
        dst.data.set(src.data);  
        return dst;  
    },  
      
    /** 
     * convolution - keneral size 5*5 - blur effect filter(模糊效果) 
     *  
     * @param context 
     * @param canvasData 
     */  
    blurProcess: function(context, canvasData) {  
        console.log("Canvas Filter - blur process");  
        var tempCanvasData = this.copyImageData(context, canvasData);  
        var sumred = 0.0, sumgreen = 0.0, sumblue = 0.0;  
        for ( var x = 0; x < tempCanvasData.width; x++) {      
            for ( var y = 0; y < tempCanvasData.height; y++) {      
      
                // Index of the pixel in the array      
                var idx = (x + y * tempCanvasData.width) * 4;         
                for(var subCol=-2; subCol<=2; subCol++) {  
                    var colOff = subCol + x;  
                    if(colOff <0 || colOff >= tempCanvasData.width) {  
                        colOff = 0;  
                    }  
                    for(var subRow=-2; subRow<=2; subRow++) {  
                        var rowOff = subRow + y;  
                        if(rowOff < 0 || rowOff >= tempCanvasData.height) {  
                            rowOff = 0;  
                        }  
                        var idx2 = (colOff + rowOff * tempCanvasData.width) * 4;      
                        var r = tempCanvasData.data[idx2 + 0];      
                        var g = tempCanvasData.data[idx2 + 1];      
                        var b = tempCanvasData.data[idx2 + 2];  
                        sumred += r;  
                        sumgreen += g;  
                        sumblue += b;  
                    }  
                }  
                  
                // calculate new RGB value  
                var nr = (sumred / 25.0);  
                var ng = (sumgreen / 25.0);  
                var nb = (sumblue / 25.0);  
                  
                // clear previous for next pixel point  
                sumred = 0.0;  
                sumgreen = 0.0;  
                sumblue = 0.0;  
                  
                // assign new pixel value      
                canvasData.data[idx + 0] = nr; // Red channel      
                canvasData.data[idx + 1] = ng; // Green channel      
                canvasData.data[idx + 2] = nb; // Blue channel      
                canvasData.data[idx + 3] = 255; // Alpha channel      
            }  
        }  
    },  
      
    /** 
     * after pixel value - before pixel value + 128 
     * 浮雕效果 
     */  
    reliefProcess: function(context, canvasData) {  
        console.log("Canvas Filter - relief process");  
        var tempCanvasData = this.copyImageData(context, canvasData);  
        for ( var x = 1; x < tempCanvasData.width-1; x++)   
        {      
            for ( var y = 1; y < tempCanvasData.height-1; y++)  
            {      
      
                // Index of the pixel in the array      
                var idx = (x + y * tempCanvasData.width) * 4;         
                var bidx = ((x-1) + y * tempCanvasData.width) * 4;  
                var aidx = ((x+1) + y * tempCanvasData.width) * 4;  
                  
                // calculate new RGB value  
                var nr = tempCanvasData.data[aidx + 0] - tempCanvasData.data[bidx + 0] + 128;  
                var ng = tempCanvasData.data[aidx + 1] - tempCanvasData.data[bidx + 1] + 128;  
                var nb = tempCanvasData.data[aidx + 2] - tempCanvasData.data[bidx + 2] + 128;  
                nr = (nr < 0) ? 0 : ((nr >255) ? 255 : nr);  
                ng = (ng < 0) ? 0 : ((ng >255) ? 255 : ng);  
                nb = (nb < 0) ? 0 : ((nb >255) ? 255 : nb);  
                  
                // assign new pixel value      
                canvasData.data[idx + 0] = nr; // Red channel      
                canvasData.data[idx + 1] = ng; // Green channel      
                canvasData.data[idx + 2] = nb; // Blue channel      
                canvasData.data[idx + 3] = 255; // Alpha channel      
            }  
        }  
    },  
      
    /** 
     *  before pixel value - after pixel value + 128 
     *  雕刻效果 
     *  
     * @param canvasData 
     */  
    diaokeProcess: function(context, canvasData) {  
        console.log("Canvas Filter - process");  
        var tempCanvasData = this.copyImageData(context, canvasData);  
        for ( var x = 1; x < tempCanvasData.width-1; x++)   
        {      
            for ( var y = 1; y < tempCanvasData.height-1; y++)  
            {      
      
                // Index of the pixel in the array      
                var idx = (x + y * tempCanvasData.width) * 4;         
                var bidx = ((x-1) + y * tempCanvasData.width) * 4;  
                var aidx = ((x+1) + y * tempCanvasData.width) * 4;  
                  
                // calculate new RGB value  
                var nr = tempCanvasData.data[bidx + 0] - tempCanvasData.data[aidx + 0] + 128;  
                var ng = tempCanvasData.data[bidx + 1] - tempCanvasData.data[aidx + 1] + 128;  
                var nb = tempCanvasData.data[bidx + 2] - tempCanvasData.data[aidx + 2] + 128;  
                nr = (nr < 0) ? 0 : ((nr >255) ? 255 : nr);  
                ng = (ng < 0) ? 0 : ((ng >255) ? 255 : ng);  
                nb = (nb < 0) ? 0 : ((nb >255) ? 255 : nb);  
                  
                // assign new pixel value      
                canvasData.data[idx + 0] = nr; // Red channel      
                canvasData.data[idx + 1] = ng; // Green channel      
                canvasData.data[idx + 2] = nb; // Blue channel      
                canvasData.data[idx + 3] = 255; // Alpha channel      
            }  
        }  
    },  
      
    /** 
     * mirror reflect 
     *  
     * @param context 
     * @param canvasData 
     */  
    mirrorProcess : function(context, canvasData) {  
        console.log("Canvas Filter - process");  
        var tempCanvasData = this.copyImageData(context, canvasData);  
        for ( var x = 0; x < tempCanvasData.width; x++) // column  
        {      
            for ( var y = 0; y < tempCanvasData.height; y++) // row  
            {      
      
                // Index of the pixel in the array      
                var idx = (x + y * tempCanvasData.width) * 4;         
                var midx = (((tempCanvasData.width -1) - x) + y * tempCanvasData.width) * 4;  
                  
                // assign new pixel value      
                canvasData.data[midx + 0] = tempCanvasData.data[idx + 0]; // Red channel      
                canvasData.data[midx + 1] = tempCanvasData.data[idx + 1]; ; // Green channel      
                canvasData.data[midx + 2] = tempCanvasData.data[idx + 2]; ; // Blue channel      
                canvasData.data[midx + 3] = 255; // Alpha channel      
            }  
        }  
    },  
}; 

var tempContext = null; // global variable 2d context  
window.onload = function() {  
    var source = document.getElementById("source");  
    var canvas = document.getElementById("target");  
    canvas.width = source.clientWidth;  
    canvas.height = source.clientHeight;  
      
    if (!canvas.getContext) {  
        console.log("Canvas not supported. Please install a HTML5 compatible browser.");  
        return;  
    }  
      
    // get 2D context of canvas and draw image  
    tempContext = canvas.getContext("2d");  
    tempContext.drawImage(source, 0, 0, canvas.width, canvas.height);  
  
       // initialization actions  
       var inButton = document.getElementById("invert-button");  
       var adButton = document.getElementById("adjust-button");  
       var blurButton = document.getElementById("blur-button");  
       var reButton = document.getElementById("relief-button");  
       var dkButton = document.getElementById("diaoke-button");  
       var mirrorButton = document.getElementById("mirror-button");  
  
       // bind mouse click event  
       bindButtonEvent(inButton, "click", invertColor);  
       bindButtonEvent(adButton, "click", adjustColor);  
       bindButtonEvent(blurButton, "click", blurImage);  
       bindButtonEvent(reButton, "click", fudiaoImage);  
       bindButtonEvent(dkButton, "click", kediaoImage);  
       bindButtonEvent(mirrorButton, "click", mirrorImage);  
}  
  
function bindButtonEvent(element, type, handler)    
{    
    if(element.addEventListener) {    
       element.addEventListener(type, handler, false);    
    } else {    
       element.attachEvent('on'+type, handler); // for IE6,7,8  
    }    
}    
  
function invertColor() {  
    var canvas = document.getElementById("target");  
    var len = canvas.width * canvas.height * 4;  
    var canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);  
    var binaryData = canvasData.data;  
         
       // Processing all the pixels  
       gfilter.colorInvertProcess(binaryData, len);  
  
       // Copying back canvas data to canvas  
       tempContext.putImageData(canvasData, 0, 0);  
}  
  
function adjustColor() {  
    var canvas = document.getElementById("target");  
    var len = canvas.width * canvas.height * 4;  
    var canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);  
       var binaryData = canvasData.data;  
         
       // Processing all the pixels  
       gfilter.colorAdjustProcess(binaryData, len);  
  
       // Copying back canvas data to canvas  
       tempContext.putImageData(canvasData, 0, 0);  
}  
  
function blurImage()   
{  
    var canvas = document.getElementById("target");  
    var len = canvas.width * canvas.height * 4;  
    var canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);  
         
       // Processing all the pixels  
       gfilter.blurProcess(tempContext, canvasData);  
  
       // Copying back canvas data to canvas  
       tempContext.putImageData(canvasData, 0, 0);  
}  
      
function fudiaoImage()   
{  
    var canvas = document.getElementById("target");  
    var len = canvas.width * canvas.height * 4;  
    var canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);  
         
       // Processing all the pixels  
       gfilter.reliefProcess(tempContext, canvasData);  
  
       // Copying back canvas data to canvas  
       tempContext.putImageData(canvasData, 0, 0);  
}  
  
function kediaoImage()   
{  
    var canvas = document.getElementById("target");  
    var len = canvas.width * canvas.height * 4;  
    var canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);  
         
       // Processing all the pixels  
       gfilter.diaokeProcess(tempContext, canvasData);  
  
       // Copying back canvas data to canvas  
       tempContext.putImageData(canvasData, 0, 0);  
}  
  
function mirrorImage()   
{  
    var canvas = document.getElementById("target");  
    var len = canvas.width * canvas.height * 4;  
    var canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);  
         
       // Processing all the pixels  
       gfilter.mirrorProcess(tempContext, canvasData);  
  
       // Copying back canvas data to canvas  
       tempContext.putImageData(canvasData, 0, 0);  
}  
