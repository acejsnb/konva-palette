# canvas2D库konva konvajs制作画板功能 类似QQ截图 可拖动
[demo演示](https://xiongshuang.github.io/konva-palette/palette/index.html)

![截图演示](https://github.com/xiongshuang/konva-palette/blob/master/palette.gif)

## 一、 变量申明

    let draw=[], // 绘制的图形数组
        graphNow=null, // 当前图形
        flag=null, // 激活绘制-铅笔 pencil:铅笔 ellipse:椭圆 rect:矩形 rectH:矩形-空心
        drawing=false, // 绘制中
        graphColor='red', // 默认颜色
        pointStart=[]; // 初始坐标

## 二、 获得Konva对象

    // 1 create stage
    const stage=new Konva.Stage({
        container: 'container',
        width: 1200,
        height: 800
    });

    // 2 create layer
    const layer=new Konva.Layer();
    stage.add(layer);
    
    // 3 create our shape
    
    // 移除改变大小事件
    stage.on('mousedown', function(e) {
        // 如果点击空白处 移除图形选择框
        // console.log(e);
    
        if (e.target === stage) {
            stageMousedown(flag, e);
    
            // 移除图形选择框
            stage.find('Transformer').destroy();
            layer.draw();
            return;
        }
        // 如果没有匹配到就终止往下执行
        if (!e.target.hasName('line') && !e.target.hasName('ellipse') && !e.target.hasName('rect') && !e.target.hasName('circle')) {
            return;
        }
        // 移除图形选择框
        stage.find('Transformer').destroy();
    
        // 当前点击的对象赋值给graphNow
        graphNow=e.target;
        // 创建图形选框事件
        const tr = new Konva.Transformer({
            borderStroke: '#000', // 虚线颜色
            borderStrokeWidth: 1, //虚线大小
            borderDash: [5], // 虚线间距
            keepRatio: false // 不等比缩放
        });
        layer.add(tr);
        tr.attachTo(e.target);
        layer.draw();
    });
    
    // 鼠标移动
        stage.on('mousemove', function (e) {
            if (graphNow && flag && drawing) {
                stageMousemove(flag, e);
            }
        });
    
        // 鼠标放开
        stage.on('mouseup', function () {
            drawing=false;
            if (flag === 'text') flag=null;
        });

## 三、 绘制
### 1.铅笔

    // 铅笔
    // @param points 点数组
    // @param stroke 颜色
    // @param strokeWidth 线粗细

    function drawPencil(points, stroke, strokeWidth) {
        const line = new Konva.Line({
            name: 'line',
            points: points,
            stroke: stroke,
            strokeWidth: strokeWidth,
            lineCap: 'round',
            lineJoin: 'round',
            tension: 0.5,
            draggable: true
        });
        graphNow=line;
        layer.add(line);
        layer.draw();
    
        line.on('mouseenter', function() {
            stage.container().style.cursor = 'move';
        });
    
        line.on('mouseleave', function() {
            stage.container().style.cursor = 'default';
        });
    
        line.on('dblclick', function() {
            // 双击删除自己
            this.remove();
            stage.find('Transformer').destroy();
            layer.draw();
        });
    }



### 2.椭圆

     // 椭圆
     // @param x x坐标
     // @param y y坐标
     // @param rx x半径
     // @param ry y半径
     // @param stroke 描边颜色
     // @param strokeWidth 描边大小
     
    function drawEllipse(x, y, rx, ry, stroke, strokeWidth) {
        const ellipse=new Konva.Ellipse({
            name: 'ellipse',
            x: x,
            y: y,
            radiusX: rx,
            radiusY: ry,
            stroke: stroke,
            strokeWidth: strokeWidth,
            draggable: true
        });
        graphNow=ellipse;
        layer.add(ellipse);
        layer.draw();
    
        ellipse.on('mouseenter', function() {
            stage.container().style.cursor = 'move';
        });
    
        ellipse.on('mouseleave', function() {
            stage.container().style.cursor = 'default';
        });
    
        ellipse.on('dblclick', function() {
            // 双击删除自己
            this.remove();
            stage.find('Transformer').destroy();
            layer.draw();
        });
    }


### 3.绘制矩形

    /**
     * 矩形
     * @param x x坐标
     * @param y y坐标
     * @param w 宽
     * @param h 高
     * @param c 颜色
     * @param sw 该值大于0-表示空心矩形（描边宽），等于0-表示实心矩形
     */
    function drawRect(x, y, w, h, c, sw) {
        const rect = new Konva.Rect({
            name: 'rect',
            x: x,
            y: y,
            width: w,
            height: h,
            fill: sw===0?c:null,
            stroke: sw>0?c:null,
            strokeWidth: sw,
            opacity: sw===0?0.5:1,
            draggable: true
        });
        graphNow=rect;
        layer.add(rect);
        layer.draw();
    
        rect.on('mouseenter', function() {
            stage.container().style.cursor = 'move';
        });
    
        rect.on('mouseleave', function() {
            stage.container().style.cursor = 'default';
        });
    
        rect.on('dblclick', function() {
            // 双击删除自己
            this.remove();
            stage.find('Transformer').destroy();
            layer.draw();
        });
    }


### 4.文字

    /**
     * 输入文字
     * @param x x坐标
     * @param y y坐标
     * @param fill 文字颜色
     * @param fs 文字大小
     */
    function drawText(x, y, fill, fs) {
        var text = new Konva.Text({
            text: '双击编辑文字',
            x: x,
            y: y,
            fill: fill,
            fontSize: fs,
            width: 300,
            draggable: true
        });
        graphNow=text;
        layer.add(text);
        layer.draw();
    
        text.on('mouseenter', function() {
            stage.container().style.cursor = 'move';
        });
    
        text.on('mouseleave', function() {
            stage.container().style.cursor = 'default';
        });
    
        text.on('dblclick', function() {
            // 在画布上创建具有绝对位置的textarea
    
            // 首先，我们需要为textarea找到位置
    
            // 首先，让我们找到文本节点相对于舞台的位置:
            let textPosition = this.getAbsolutePosition();
    
            // 然后让我们在页面上找到stage容器的位置
            let stageBox = stage.container().getBoundingClientRect();
    
            // 因此textarea的位置将是上面位置的和
            let areaPosition = {
                x: stageBox.left + textPosition.x,
                y: stageBox.top + textPosition.y
            };
    
            // 创建textarea并设置它的样式
            let textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
    
            let T=this.text();
            if (T === '双击编辑文字') {
                textarea.value = '';
                textarea.setAttribute('placeholder','请输入文字')
            } else {
                textarea.value = T;
            }
    
            textarea.style.position = 'absolute';
            textarea.style.top = areaPosition.y + 'px';
            textarea.style.left = areaPosition.x + 'px';
            textarea.style.background = 'none';
            textarea.style.border = '1px dashed #000';
            textarea.style.outline = 'none';
            textarea.style.color = this.fill();
            textarea.style.width = this.width();
    
            textarea.focus();
    
            this.setAttr('text', '');
            layer.draw();
    
            // 确定输入的文字
            let confirm=(val) => {
                this.text(val?val:'双击编辑文字');
                layer.draw();
                // 隐藏在输入
                if (textarea) document.body.removeChild(textarea);
            };
            // 回车键
            let keydown=(e) => {
                if (e.keyCode === 13) {
                    textarea.removeEventListener('blur', blur);
                    confirm(textarea.value)
                }
            };
            // 鼠标失去焦点
            let blur=() => {
                textarea.removeEventListener('keydown', keydown);
                confirm(textarea.value);
            };
    
            textarea.addEventListener('keydown', keydown);
            textarea.addEventListener('blur', blur);
        });
    }



### 5.鼠标按下

    /**
     * stage鼠标按下
     * @param flag 是否可绘制
     * @param ev 传入的event对象
     */
    function stageMousedown(flag, ev) {
        if (flag) {
            let x=ev.evt.offsetX, y=ev.evt.offsetY;
            pointStart=[x, y];
    
            switch (flag) {
                case 'pencil':
                    drawPencil(pointStart, graphColor, 2);
                    break;
                case 'ellipse':
                    // 椭圆
                    drawEllipse(x, y, 0, 0, graphColor, 2);
                    break;
                case 'rect':
                    drawRect(x, y, 0, 0, graphColor, 0);
                    break;
                case 'rectH':
                    drawRect(x, y, 0, 0, graphColor, 2);
                    break;
                case 'text':
                    drawText(x, y, graphColor, 16);
                    break;
                default:
                    break;
            }
            drawing=true;
        }
    }


### 6.鼠标移动

    /**
     * stage鼠标移动
     * @param flag 是否可绘制
     * @param ev 传入的event对象
     */
    function stageMousemove(flag, ev) {
        switch (flag) {
            case 'pencil':
                // 铅笔
                pointStart.push(ev.evt.offsetX, ev.evt.offsetY);
                graphNow.setAttrs({
                    points: pointStart
                });
                break;
            case 'ellipse':
                // 椭圆
                graphNow.setAttrs({
                    radiusX: Math.abs(ev.evt.offsetX-pointStart[0]),
                    radiusY: Math.abs(ev.evt.offsetY-pointStart[1])
                });
                break;
            case 'rect':
            case 'rectH':
                graphNow.setAttrs({
                    width: ev.evt.offsetX-pointStart[0],
                    height: ev.evt.offsetY-pointStart[1]
                });
                break;
            default:
                break;
        }
        layer.draw();
    }


### 7.选择颜色

    // 选择颜色
    function selectColorFn(t) {
        graphColor=t.value;
    }


### 8.删除

    // 移除图形
    function removeFn() {
        if (graphNow) {
            graphNow.remove();
            stage.find('Transformer').destroy();
            layer.draw();
            graphNow=null;
        } else {
            alert('请选择图形')
        }
    }


