/*
      插件将实现以下功能，
      1. 打开本地文件，并将文件输出到canvas标签上
      2. 在一定范围内拖动，自动调整位置
      3. 设置rgb曲线
      4. 设置色相
      5. 设置亮度
      6. 设置各种滤镜
*/

var PhotoShop = function(opt) {
    var _this = this;

    _this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    _this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

    _this.upLoadButton = opt.upLoadButton; //打开文件的按钮
    _this.proxyUpLoadButton = opt.proxyUpLoadButton; //打开文件事件的代理按钮
    _this.canvas = opt.canvas; //canvas标签  用来装 图片

    _this.ctx = _this.canvas.getContext('2d'); //ctx对象
    _this.parentContainer = _this.canvas.parentNode; //装canvas的父容器

    _this.__img = new Image(); //加载图片的临时资源
    _this.__privateEvent = {
        getImage: function(file) {
            var reader = new FileReader(),
                button = _this.upLoadButton;

            reader.readAsDataURL(button.files[0]);
            reader.onload = function() {
                _this.__img.src = reader.result;
            }
        },
        reLoad: function() {
            var img = _this.__img,
                width = img.width,
                height = img.height;
            _this.canvas.width = width;
            _this.canvas.height = height;
            _this.ctx.drawImage(img, 0, 0);

            _this.__privateEvent.setParentPos();

        },
        setParentPos: function() {
            var img = _this.__img,
                width = img.width,
                height = img.height;

            var cw = _this.clientWidth,
                ch = _this.clientHeight;

            pCleft = (cw - width) / 2;
            pcTop = (ch - height) / 2;

            _this.parentContainer.style.width = width + 'px';
            _this.parentContainer.style.height = height + 'px';
            _this.parentContainer.style.left = pCleft + 'px';
            _this.parentContainer.style.top = pcTop + 'px';
        },

    }

    this.init();
}

PhotoShop.prototype.init = function() {
    var _this = this;
    _this.__img.onload = _this.__privateEvent.reLoad;

    /*
          _this.proxyUpLoadButton.onclick = function(e){
                _this.upLoadButton.onchange();
          };
    */

    _this.upLoadButton.onchange = _this.__privateEvent.getImage; //初始化图片

    window.onresize = function() {
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

PhotoShop.prototype.dragMove = function(dom) {
    var _this = this,
        _dom = dom,
        _startPos,
        realPos = { left: 0, top: 0 },
        startCPos,
        _dragStatus = false;

    _dom.onmousedown = function() {
        _dragStatus = true;
        _startPos = cursorPosition();
        var _left = parseInt(_dom.style.left.split("px"));
        var _top = parseInt(_dom.style.top.split("px"));
        startCPos = {
            left: _left,
            top: _top
        }
    }

    _dom.onmousemove = function() {
        if (!_dragStatus) return;

        var _endPos, nowLeft, nowTop, deviationX, deviationY, imageWidth,
            imageHeight, clientWidth, clientHeight, realDeviationX, realDeviationY;

        nowLeft = _dom.offsetLeft; // now margin left
        nowTop = _dom.offsetTop; // now margin top
        _endPos = cursorPosition(); // now cursor position
        deviationX = _endPos.x - _startPos.x; // now cursor deviation x more than 0 right
        deviationY = _endPos.y - _startPos.y; // now cursor deviation y more than 0 down
        imageWidth = _dom.offsetWidth; //image width    
        imageHeight = _dom.offsetHeight; //image height
        clientWidth = _this.clientWidth; //client width
        clientHeight = _this.clientHeight; //client height
        /*
        1.
          图片宽高小于容器宽度
          图片始终居中，拖拽的上下左右偏移量不大于100px;
          释放之后回到原始位置
        2.
          图片宽小于容器宽度  高度大于容器宽度
          图片左右始终居中，左右偏移量不大于100px
          如果向上拖拽 那么图片底部距离容器底部的距离不大于100px；
          释放之后左右位置不变，底部距离为0；
          反之相同
        3.
          图片高小于容器宽度 宽大于容器宽度
          图片上下始终居中，上下偏移量不大于100px
          如果向左拖拽 那么图片右侧距离容器右侧的距离不大于100px；
          释放之后上下位置不变，图片右侧距离容器右侧为0；
          反之相同
        4.
          图片宽高均大于容器宽高
          2，3相结合

        */

        //判断宽度图片宽度是否大于容器宽度，如果不，则始终居中
        if (imageWidth <= clientWidth && imageHeight <= clientHeight) {
            realPos.left = (clientWidth - imageWidth) / 2;
            realPos.top = (clientHeight - imageHeight) / 2;


        } else if (imageWidth <= clientWidth && imageHeight > clientHeight) {
            //realPos.x = nowLeft;
            //判断Y轴位移方向，判断偏移量 以及边界
            console.log("a");
        } else if (imageWidth > clientWidth && imageHeight <= clientHeight) {
            console.log("b");

        } else if (imageWidth > clientWidth && imageHeight > clientHeight) {
            console.log("c");

        }
        console.log(deviationX, deviationY);

        _dom.style.left = startCPos.left + deviationX + 'px';
        _dom.style.top = startCPos.top + deviationY + 'px';

        //console.log(nowLeft)
        //计算出真实位置使用缓动动画调整位置，提供两个参数，dom；position


    }

    _dom.onmouseup = function() {
        //  if(_dragStatus) _this.Animate(_dom,realPos); 
        _dom.style
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
};


PhotoShop.prototype.Animate = function(element, position, speed, callback) {
    //移动到指定位置，position:移动到指定left及top 格式{left:120, top:340}或{left:120}或{top:340}；speed:速度 1-100，默认为10
    if (typeof(element) == 'string') element = document.getElementById(element);
    if (!element.effect) {
        element.effect = {};
        element.effect.move = 0;
    }
    clearInterval(element.effect.move);
    var speed = speed || 10;
    var start = (function(elem) {
        var posi = { left: elem.offsetLeft, top: elem.offsetTop };
        while (elem = elem.offsetParent) {
            posi.left += elem.offsetLeft;
            posi.top += elem.offsetTop;
        };
        return posi;
    })(element);
    element.style.position = 'absolute';
    var style = element.style;
    var styleArr = [];
    if (typeof(position.left) == 'number') styleArr.push('left');
    if (typeof(position.top) == 'number') styleArr.push('top');
    element.effect.move = setInterval(function() {
        for (var i = 0; i < styleArr.length; i++) {
            start[styleArr[i]] += (position[styleArr[i]] - start[styleArr[i]]) * speed / 100;
            style[styleArr[i]] = start[styleArr[i]] + 'px';
        }
        for (var i = 0; i < styleArr.length; i++) {
            if (Math.round(start[styleArr[i]]) == position[styleArr[i]]) {
                if (i != styleArr.length - 1) continue;
            } else {
                break;
            }
            for (var i = 0; i < styleArr.length; i++) style[styleArr[i]] = position[styleArr[i]] + 'px';
            clearInterval(element.effect.move);
            if (callback) callback.call(element);
        }
    }, 20);
};