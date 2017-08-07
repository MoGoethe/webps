/*

"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    var cropbox = function(options, el){
        var el = el || $(options.imageBox),
            obj =
            {
                state : {},
                ratio : 1,
                options : options,
                imageBox : el,
                thumbBox : el.find(options.thumbBox),
                spinner : el.find(options.spinner),
                image : new Image(),
                getDataURL: function ()
                {
                    var width = this.thumbBox.width(),
                        height = this.thumbBox.height(),
                        canvas = document.createElement("canvas"),
                        dim = el.css('background-position').split(' '),
                        size = el.css('background-size').split(' '),
                        dx = parseInt(dim[0]) - el.width()/2 + width/2,
                        dy = parseInt(dim[1]) - el.height()/2 + height/2,
                        dw = parseInt(size[0]),
                        dh = parseInt(size[1]),
                        sh = parseInt(this.image.height),
                        sw = parseInt(this.image.width);

                    canvas.width = width;
                    canvas.height = height;
                    var context = canvas.getContext("2d");
                    context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                    var imageData = canvas.toDataURL('image/png');
                    return imageData;
                },
                getBlob: function()
                {
                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/png;base64,','');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return  new Blob([new Uint8Array(array)], {type: 'image/png'});
                },
                zoomIn: function ()
                {
                    this.ratio*=1.1;
                    setBackground();
                },
                zoomOut: function ()
                {
                    this.ratio*=0.9;
                    setBackground();
                }
            },
            setBackground = function()
            {
                var w =  parseInt(obj.image.width)*obj.ratio;
                var h =  parseInt(obj.image.height)*obj.ratio;

                var pw = (el.width() - w) / 2;
                var ph = (el.height() - h) / 2;

                el.css({
                    'background-image': 'url(' + obj.image.src + ')',
                    'background-size': w +'px ' + h + 'px',
                    'background-position': pw + 'px ' + ph + 'px',
                    'background-repeat': 'no-repeat'});
            },
            imgMouseDown = function(e)
            {
                e.stopImmediatePropagation();

                obj.state.dragable = true;
                obj.state.mouseX = e.clientX;
                obj.state.mouseY = e.clientY;
            },
            imgMouseMove = function(e)
            {
                e.stopImmediatePropagation();

                if (obj.state.dragable)
                {
                    var x = e.clientX - obj.state.mouseX;
                    var y = e.clientY - obj.state.mouseY;

                    var bg = el.css('background-position').split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    el.css('background-position', bgX +'px ' + bgY + 'px');

                    obj.state.mouseX = e.clientX;
                    obj.state.mouseY = e.clientY;
                }
            },
            imgMouseUp = function(e)
            {
                e.stopImmediatePropagation();
                obj.state.dragable = false;
            },
            zoomImage = function(e)
            {
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.ratio*=1.1 : obj.ratio*=0.9;
                setBackground();
            }

        obj.spinner.show();
        obj.image.onload = function() {
            obj.spinner.hide();
            setBackground();

            el.bind('mousedown', imgMouseDown);
            el.bind('mousemove', imgMouseMove);
            $(window).bind('mouseup', imgMouseUp);
            el.bind('mousewheel DOMMouseScroll', zoomImage);
        };
        obj.image.src = options.imgSrc;
        el.on('remove', function(){$(window).unbind('mouseup', imgMouseUp)});

        return obj;
    };

    jQuery.fn.cropbox = function(options){
        return new cropbox(options, this);
    };
}));*/

window.onload = function() {
      console.log("start");
}

/*
      插件将实现以下功能，
      1. 打开本地文件，并将文件输出到canvas标签上
*/

var PhotoShop = function(opt){
      var _this = this;

      _this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
      _this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

      _this.upLoadButton = opt.upLoadButton;//打开文件的按钮
      _this.proxyUpLoadButton = opt.proxyUpLoadButton;//打开文件事件的代理按钮
      _this.canvas = opt.canvas;//canvas标签  用来装 图片

      _this.ctx = _this.canvas.getContext('2d');                  //ctx对象
      _this.parentContainer = _this.canvas.parentNode;      //装canvas的父容器

      _this.__img = new Image();                                        //加载图片的临时资源
      _this.__privateEvent = {
            getImage : function(file) {
                  var reader = new FileReader(),
                        button = _this.upLoadButton;

                  reader.readAsDataURL(button.files[0]);
                  reader.onload = function() {
                        _this.__img.src = reader.result;
                  }
            },
            reLoad : function(){
                  var img  = _this.__img,
                        width = img.width,
                        height = img.height;
                  _this.canvas.width = width;
                  _this.canvas.height = height;
                  _this.ctx.drawImage(img, 0, 0);

                  _this.__privateEvent.setParentPos();

            },
            setParentPos:function(){
                  var img  = _this.__img,
                        width = img.width,
                        height = img.height;

                  var cw = _this.clientWidth,
                        ch = _this.clientHeight;

                  pCleft =  (cw - width) / 2;
                  pcTop = (ch - height) / 2;

                   _this.parentContainer.style.width = width + 'px';
                  _this.parentContainer.style.height = height + 'px';
                  _this.parentContainer.style.left = pCleft + 'px';
                  _this.parentContainer.style.top = pcTop + 'px';
            },

      }

      this.init();
}

PhotoShop.prototype.init = function(){
      var _this = this;
      _this.__img.onload = _this.__privateEvent.reLoad;

/*
      _this.proxyUpLoadButton.onclick = function(e){
            _this.upLoadButton.onchange();
      };
*/

      _this.upLoadButton.onchange = _this.__privateEvent.getImage;    //初始化图片

      window.onresize = function(){
            _this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
            _this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            _this.__privateEvent.setParentPos();
      }

      _this.dragMove(_this.parentContainer);

};

/*
      抓取移动函数，
      如果 被抓取的dom 小于视口的dom，那么始终居中；
      如果 被抓取dom 大于视口dom，那么上下左右四个方向的反方向
*/

PhotoShop.prototype.dragMove = function(dom){
      var _dom = dom,
            _startPos,
            startCPos,
            _dragStatus = false;

      _dom.onmousedown = function(){
            _dragStatus = true;
            _startPos = cursorPosition();
            var _left = parseInt( _dom.style.left.split("px") );
            var _top = parseInt( _dom.style.top.split("px") );
            startCPos = {
                  left : _left,
                  top : _top
            }
      }

      _dom.onmousemove = function(){
            if(!_dragStatus) return;
            
            var _endPos = cursorPosition();

            console.log(_dom.offsetLeft);

            _dom.style.left = startCPos.left + ( _endPos.x - _startPos.x ) +'px';
            _dom.style.top = startCPos.top + ( _endPos.y - _startPos.y ) +'px';

            //计算出真实位置使用缓动动画调整位置，提供两个参数，dom；position
         //   slowDownMove(_dom,realPos);

      }

       _dom.onmouseup = function(){
            _dragStatus = false;
      }
      var cursorPosition = function (){
            var ev = ev || window.event;
            if(ev.pageX || ev.pageY){
                  return {x:ev.pageX,y:ev.pageY};
            }
            return {
                  x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                  y:ev.clientY + document.body.scrollTop - document.body.clientTop
            };
      };
      var slowDownMove = function(d,p){

      }
};


