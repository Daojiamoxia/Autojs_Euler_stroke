/**
 * 作者：Althumi,lsnuxiaotao
 * 时间：2021/8/12---12:20
 * 开发环境:vsCode
 * 使用语言：Javascript
 * 
 * 运行环境：Auto.js 8.0
 * 
 * 测试机型：vivo Y3
 * 
 * 连接成功色板：#ffff415b
 * 
 * 5阶一笔画
 * 右上角坐标：(148,304),(254,304)
 *            (148,410)
 * 
 * 坐标相距：106
 * 
 * 4阶
 * 右上角坐标：(148,304),(289,304)
 *            (148,445)
 * 
 * 坐标相距：141
 * 
 * 3阶
 * 右上角坐标：(184,339),(360,339)
 *            (184,515)
 * 
 * 坐标相距：176
 * 
 * 最快滑动速度：500ms
 * 最快等待截图速度：200ms
 * 
 * 重置按钮坐标：(134,1377)
 * 
 * 测试机型：HUAWEI P30
 * 
 * 连接成功色板：#ffff415c
 * 
 * 5阶一笔画
 * 右上角坐标：(223,502),(382,502)
 *            (148,661)
 * 
 * 坐标相距：159
 * 
 * 重置按钮坐标：(199,2093)
 * 
 * 最快滑动速度：200ms
 * 最快等待截图速度：100ms
 * 使用该代码要自行调节下列参数
 * 
 */

console.log("各项初始化中...");

//节点
function node(x, y){
    this.x = x;
    this.y = y;
}

//红色色调
var red_arg = "#ffff415b";

//右上角坐标
var s_x = 148,s_y = 304;

//重置按钮坐标
var r_x = 134, r_y = 1377;

//坐标间距
var d = 106;

//一笔画阶数
var n = 5;

//滑动数速度
var speed = 500;

//截图等待速度
var photo_speed = 200;

//初始化保存节点坐标数组
var a = new Array();
for(var i = 0 ; i < n*n ; ++i){
    a[i] = new node(0, 0);
}

//设置右上角坐标
a[0].x = s_x, a[0].y = s_y;

//设置重置按钮坐标
var reset = new node(r_x,r_y);

//初始化邻接矩阵
var g = new Array();

for(var i = 0; i < n*n; ++i){
    g[i] = new Array();
    for(var j = 0; j < n*n; ++j){
        g[i][j] = 0;
    }
}

//保存图片变量，颜色变量，字符串变量，中点坐标
var img, color, s_colors, t_x, t_y;

//申请截图权限
if (!requestScreenCapture()) {
    toast("请求截图失败");
    
    console.log("请求截图失败");
    
    exit();
};

//设置边界点坐标
for(var i = 1; i < n; ++i){
    a[i*n].x = a[0].x;
    a[i*n].y = a[(i-1)*n].y + d;

    a[i].x = a[i-1].x + d;
    a[i].y = a[0].y;
}

//设置全部坐标
var temp;
for(var i = 1; i < n; ++i){
    for(var j = 1; j < n; ++j){
        temp = i*n + j;
        
        a[temp].x = a[temp-(n+1)].x + d;
        a[temp].y = a[temp-(n+1)].y + d;
    }
}


//建立邻接矩阵（）
var x1, y1, x2, y2;

for(var i = 0; i < n*n; ++i){
    //当前坐标点
    x1 = a[i].x, y1 = a[i].y;
    for(var j = i + 1; j < n*n; ++j){
        //遍历坐标点 
        x2 = a[j].x, y2 = a[j].y;

        //当前坐标点与遍历坐标点的中
        t_x = (x1 + x2)/2;
        t_y = (y1 + y2)/2;
        
        //执行连接两点
        gesture(speed, [x1, y1], [x1 - d/2, y1 - d/2], [x1 - d/2, y2 - d/2], [x2 - d/2, y2 - d/2], [x2, y2]);
        
        //等待截屏时间200ms
        sleep(photo_speed);
        
        //执行截图
        img = captureScreen();
        
        //获取截图指定坐标颜色
        color = images.pixel(img, t_x, t_y);

        //转换为字符串类型
        s_colors=colors.toString(color);

        //检查是否为红色，如果是则两点之间有连线，记录邻接矩阵，否则不记录。
        if(s_colors == red_arg){
            g[i][j] = 1;
            g[j][i] = 1;
        }

        //点击重置按钮
        click(reset.x, reset.y);
    }
}


console.log("邻接矩阵创建成功...");

console.log("初始化成功...");

console.log("开始计算一笔画路径...");


var begin_node=0;                                     //起点坐标

var oula_path = new Array();                          //保存路径栈

var ld = new Array();                                 //记录每个点的入度

for(var i = 0; i < n*n; ++i){
    ld[i] = 0;
}

//欧拉一笔画算法
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

//设置每个节点的入度
for (var i = 0; i < n*n; ++i){
    for(var j = 0 ; j < n*n; ++j){
        if(g[i][j]>0){
            ld[j]++;
        }
    }
}

//找出奇点，并作为起点
for(var i = 0; i < n*n; ++i) if(ld[i] % 2 == 1){
    begin_node = i;
    break;
}

//执行欧拉回路
oula(begin_node);

oula_path.push(begin_node);

console.log("计算成功开始解题...");

var len = oula_path.length;                   //当前剩余路径长度
var x = oula_path[len-1];                     //获取栈顶元素
oula_path.pop();                              //出栈

var pre = x;                                  //保存上一个节点坐标
 
//开始解题
while(oula_path.length>0)
{
    //记录上一个节点坐标
    x1 = a[pre].x, y1 = a[pre].y;
     
    //获取当前节点坐标
    len = oula_path.length;
    x = oula_path[len-1];
    oula_path.pop();

    x2 = a[x].x, y2 = a[x].y;

    //执行连接
    gesture(speed, [x1, y1], [x1 - d/2, y1 - d/2], [x1 - d/2, y2 - d/2], [x2 - d/2, y2 - d/2], [x2, y2]);

    //将当前节点作为下一个节点的上一个节点坐标
    pre = x;
}

console.log("解题成功...");
