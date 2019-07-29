/**
 * 铅笔
 * @param points 点数组
 * @param stroke 颜色
 * @param strokeWidth 线粗细
 */
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

/**
 * 椭圆
 * @param x x坐标
 * @param y y坐标
 * @param rx x半径
 * @param ry y半径
 * @param stroke 描边颜色
 * @param strokeWidth 描边大小
 */
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

/**
 * stage鼠标移动
 * @param flag 是否可绘制
 * @param ev 传入的event对象
 */
function stageMousedown(flag, ev) {
    if (flag) {
        let x=ev.evt.offsetX, y=ev.evt.offsetY;
        pointStart=[x, y];

        switch (flag) {
            case 'pencil':
                drawPencil(pointStart, 'red', 2);
                break;
            case 'ellipse':
                // 椭圆
                drawEllipse(x, y, 0, 0, 'red', 2);
                break;
            case 'rect':
                drawRect(x, y, 0, 0, 'red', 0);
                break;
            case 'rectH':
                drawRect(x, y, 0, 0, 'red', 2);
                break;
            default:
                break;
        }
        drawing=true;
    }
}

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
