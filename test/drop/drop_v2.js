(function(win,doc){
      var PhotoShop = function( config ){
            var _this = this;
            _this.canvas = config.canvas,
            _this.upLoadButton = config.upLoadButton ,
            _this.proxyUpLoadButton = config.proxyUpLoadButton,
            _this.container = config.container;
            _this.ctx = _this.canvas.getContext('2d');
            _this.__img = new Image();

            _this.__getImage = function(file) {

                  var reader = new FileReader(),
                        button = _this.upLoadButton;

                  reader.readAsDataURL(button.files[0]);
                  reader.onload = function() {
                        _this.__img.src = reader.result;
                  }
            };

            _this.__reLoad =  function() {
                  var img = _this.__img,
                        width = img.width,
                        height = img.height;

                  _this.canvas.width = width;
                  _this.canvas.height = height;
                  _this.ctx.drawImage(img, 0, 0);

                  _this.__setInitPosition();
              };

            _this.__setInitPosition = function() {
                  var img = _this.__img,
                        imageWidth = img.width,
                        imageHeight = img.height;

                  var cw = _this.container.offsetWidth,
                        ch = _this.container.offsetHeight;

                  var posCanvasleft = (cw - imageWidth) / 2;
                  var posCanvasTop = (ch - imageHeight) / 2;

                  _this.canvas.style.width = imageWidth + 'px';
                  _this.canvas.style.height = imageHeight + 'px';

                  _this.canvas.style.position = "absolute";
                  _this.canvas.style.left = posCanvasleft + 'px';
                  _this.canvas.style.top = posCanvasTop + 'px';
            };

            _this.upLoadButton.onchange = _this.__getImage;
            _this.__img.onload = _this.__reLoad;

            _this.init();
      };

      PhotoShop.prototype = {
            init : function(){
                  console.log(" init function");

                  var _this = this;

                  _this.refreshPosition();
                  _this.dragMove(_this.canvas);

            },

            refreshPosition : function(){
                  var _this = this;
                  window.onresize = function() {
                        _this.setCanvasPosition();
                  }
            },

            setCanvasPosition : function(){
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

            dragMove : function(dom) {
                  var _this = this,
                        _dom = dom,
                        _startPos,
                        realPos = { left: 0, top: 0 },
                        startCPos,
                        _dragStatus = false;

                  _dom.onmousedown = function() {
                        if(window.moveTimer) clearInterval(window.moveTimer);
                        _dragStatus = true;
                        _startPos = cursorPosition();
                        var _left = dom.offsetLeft;

                        var _top = dom.offsetTop;

                        startCPos = {
                              left: _left,
                              top: _top
                        }
                  }

                  _dom.onmousemove = function() {
                        if (!_dragStatus) return;

                        var _endPos, deviationX, deviationY;

                        _endPos = cursorPosition(); // now cursor position

                        deviationX = _endPos.x - _startPos.x; // now cursor deviation x more than 0 right
                        deviationY = _endPos.y - _startPos.y; // now cursor deviation y more than 0 down

                        _dom.style.left = startCPos.left + deviationX + 'px';
                        _dom.style.top = startCPos.top + deviationY + 'px';

                  }

                  _dom.onmouseup = function() {
/*
      释放的时候  计算正确位置
*/
                        var imageWidth, imageHeight, containerWidth,containerHeight,nowLeft,nowTop;

                        imageWidth = _dom.offsetWidth; //image width    
                        imageHeight = _dom.offsetHeight; //image height
                        nowLeft = _dom.offsetLeft; // now margin left
                        nowTop = _dom.offsetTop; // now margin top
                        containerWidth = _this.container.offsetWidth; //container width
                        containerHeight = _this.container.offsetHeight; //container height

                        //判断宽度图片宽度是否大于容器宽度，如果不，则始终居中
                        if (imageWidth <= containerWidth && imageHeight <= containerHeight) {
                              realPos.x = (containerWidth - imageWidth) / 2;
                              realPos.y = (containerHeight - imageHeight) / 2;

                        } else if (imageWidth <= containerWidth && imageHeight > containerHeight) {
                              realPos.x = (containerWidth - imageWidth) / 2;
                              //判断Y轴位移方向，判断偏移量 以及边界
/*                              if(){

                              }*/

                              
                        } else if (imageWidth > containerWidth && imageHeight <= containerHeight) {
                              
                              realPos.y = (containerHeight - imageHeight) / 2;

                        } else if (imageWidth > containerWidth && imageHeight > containerHeight) {
                              console.log("c");

                        }


                       if(_dragStatus) _this.Animate(_dom,realPos,800); 
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

            Animate : function(dom, position, duration,callback) {
                  //移动到指定位置，position:移动到指定left及top 格式{left:120, top:340}或{left:120}或{top:340}；speed:速度 1-100，默认为10
                  
                  var startTime = +new Date;
                  var startPos = {
                        x : dom.offsetLeft,
                        y : dom.offsetTop
                  };
                  if(window.moveTimer) clearInterval(window.moveTimer);
                  var sineaseOut = function(t,b,c,d){
                        return c * ((t = t/d-1) * t * t + 1) + b;
                  }
                  window.moveTimer = setInterval(function(){
                        if(step() == false){
                              clearInterval(window.moveTimer);
                              if (callback) callback.call(element);
                        }
                  },19);

                  var step = function(){
                        var t = +new Date;
                        if(t >= startTime + duration){
                              update(dom,position);
                              return false;
                        }
                        var pos = { x : 0, y : 0 };
                       
                        pos.x = sineaseOut(t - startTime, startPos.x, position.x- startPos.x, duration);
                        pos.y = sineaseOut(t - startTime, startPos.y, position.y- startPos.y, duration);

                        update(dom,pos);
                  };

                  var update = function(dom,pos){
                        dom.style.left = pos.x +'px';
                        dom.style.top = pos.y +'px';
                  }
            }

      }

      window.PhotoShop = PhotoShop;

})(window,document)
