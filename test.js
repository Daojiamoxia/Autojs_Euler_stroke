/**
 * 右上角坐标：(148,304),(254,304)
 *            (148,410)
 * 
 * 坐标相距：106
 * 连接成功色板：#ffff415b
 * 重置按钮坐标：(134,1377)
 */

console.log("各项初始化中...");

 function node(x,y){
    this.x=x;
    this.y=y;
}

var s_x = 148,s_y = 304;
var d = 106;
var n = 5;

var a = new Array();
for(var i = 0 ; i < n*n ; ++i){
    a[i] = new node(0, 0);
}

a[0].x = s_x, a[0].y = s_y;

var reset = new node(134,1377);

var g = new Array();

for(var i = 0; i < n*n; ++i){
    g[i] = new Array();
    for(var j = 0; j < n*n; ++j){
        g[i][j] = 0;
    }
}

var img, color, s_colors, t_x, t_y;

if (!requestScreenCapture()) {
    toast("请求截图失败");
    console.log("请求截图失败");
    exit();
};

//初始化边界点坐标
for(var i = 1; i < n; ++i){
    a[i*5].x = a[0].x;
    a[i*n].y = a[(i-1)*n].y + d;

    a[i].x = a[i-1].x + d;
    a[i].y = a[0].y;
}

//初始化全部坐标
var temp;
for(var i = 1; i < n; ++i){
    for(var j = 1; j < n; ++j){
        temp = i*n + j;
        a[temp].x = a[temp-6].x + d;
        a[temp].y = a[temp-6].y + d;
    }
}

//建立邻接矩阵
var x1, y1, x2, y2;
for(var i = 0; i < n*n; ++i){
    x1 = a[i].x, y1 = a[i].y;
    for(var j = i + 1; j < n*n; ++j){
         x2 = a[j].x, y2 = a[j].y;
         t_x = (x1 + x2)/2;
         t_y = (y1 + y2)/2;

         gesture(500, [x1, y1], [x1 - d/2, y1 - d/2], [x1 - d/2, y2 - d/2], [x2 - d/2, y2 - d/2], [x2, y2]);
         sleep(200);
         img = captureScreen();
         color = images.pixel(img, t_x, t_y);

         s_colors=colors.toString(color);
        
         if(s_colors=="#ffff415b"){
            g[i][j] = 1;
            g[j][i] = 1;
        }

         click(reset.x, reset.y);
    }
}

//console.log(g);

console.log("邻接矩阵创建成功...");

console.log("初始化成功...");
console.log("开始计算一笔画路径...");

//欧拉一笔画算法
var begin_node=0;

var oula_path = new Array();

var ld = new Array();

for(var i = 0; i < n*n; ++i){
    ld[i] = 0;
}
function oula(x)
{
    for(var i = 0 ; i < n*n ; i++)
    {
        if(g[x][i] > 0)
        {
            g[x][i] = 0, g[i][x] = 0;
            oula(i);
            oula_path.push(i);
        }
    }
}

for (var i = 0; i < n*n; ++i){
    for(var j = 0 ; j < n*n; ++j){
        if(g[i][j]>0){
            ld[j]++;
        }
    }
}

for(var i = 0; i < n*n; ++i) if(ld[i] % 2 == 1){
    begin_node = i;
    break;
}

oula(begin_node);
oula_path.push(begin_node);
console.log("计算成功开始解题...");

var len = oula_path.length;
var x = oula_path[len-1]; 
oula_path.pop();

var pre = x;
 
while(oula_path.length>0)
{
     x1 = a[pre].x, y1 = a[pre].y;
     
     len = oula_path.length;
     x = oula_path[len-1];
     oula_path.pop();

     x2 = a[x].x, y2 = a[x].y;

     gesture(500, [x1, y1], [x1 - d/2, y1 - d/2], [x1 - d/2, y2 - d/2], [x2 - d/2, y2 - d/2], [x2, y2]);

     pre = x;
}

console.log("解题成功...");
