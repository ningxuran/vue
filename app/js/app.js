// new Vue({
//     el:'#app',
//     data: {
//         message:'hello vue.js.'
//     }
// });

const net = require('net');
// const client = net.connect({ path: "./.UDS" });

var fs = require('fs');

// 点号表示当前文件所在路径
var str = fs.realpathSync('.');
console.log(str);

// client.on('data', (data) => {
//     //use this data to show
//     console.log("Mission Control got: " + data.toString());
// });
// client.on('error', (error) => {
//     console.log(error.toString());
// });
// //use this to send command
// client.write("Command goes here~~~~~~");

// init 
var eChart = echarts.init(document.getElementById('e-attr'));
var navList = document.getElementById("nav-list");
var header = document.getElementById("header");
var overlay = document.getElementById("overlay");
var otherView = document.getElementById("other-view");
var batteryNumber = document.getElementById("battery-number");  
var batteryLevel = document.getElementById("battery-level");  
var heightValue = document.getElementById("height-value");
var disValue= document.getElementById("dis-value"); 
var vsValue = document.getElementById("vs-value");
var hsValue = document.getElementById("hs-value");


var app = {};
var now = new Date();
var time = now.getSeconds();
var date = [time];

var batteryTmp = [];
var channelsTmp = [];
var velocityTmp = [];
var data = [];

var channelOne = [];
var channelTwo = [];
var channelThr = [];
var channelFou = [];
var channelFiv = [];
var channelSix = [];
var channelSev = [];
var channelEig = [];

var decision = [];

option = {
    backgroundColor: '#1b1b1b',
    tooltip : {
        formatter: "{a} <br/>{c} {b}"
    },
    toolbox: {
        show : false
    },
    series : [
        {
            name:'速度',
            type:'gauge',
            min:0,
            max:200,
            splitNumber:5,
            radius: '90%',
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
                    width: 1,
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisLabel: {            // 坐标轴小标记
                textStyle: {       // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                length :5,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            splitLine: {           // 分隔线
                length :8,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width:1,
                    color: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {           // 分隔线
                shadowColor : '#fff', //默认透明
                shadowBlur: 5,
                width: 4,
            },
            title : {
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 5,
                    fontStyle: 'italic',
                    color: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            detail : {
                offsetCenter: [0, '60%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: 'rgba(30,144,255,0.8)',
                    fontSize: 25
                }
            },
            data:[{value: 40, name: 'km/h'}]
        }
    ]
};

eChart.setOption(option);

// set echarts
// option .series[0].data[0].value = 11
// eChart.setOption(option,true);



// 百度地图API功能
var map = new BMap.Map("allmap");
var point = new BMap.Point(116.331398,39.897445);
map.centerAndZoom(point,12);

var geolocation = new BMap.Geolocation();
geolocation.getCurrentPosition(function(r){
if(this.getStatus() == BMAP_STATUS_SUCCESS){
  var mk = new BMap.Marker(r.point);
  map.addOverlay(mk);
  map.panTo(r.point);
  console.log('您的位置：'+r.point.lng+','+r.point.lat);
}
else {
  alert('failed'+this.getStatus());
}        
},{enableHighAccuracy: true})




$(".glyphicon-th-list").on("click", function () {
	// header.style.display = "none";
	otherView.style.display = "none";
	overlay.style.display = "block";
	navList.style.display = "block";

	$(".overlay").on("click", function () {
		navList.style.display = "none";
		overlay.style.display = "none";
		// header.style.display = "block";
		otherView.style.display = "block";
	});
});


// Create a client instance
client = new Paho.MQTT.Client("yogurtshen.com", 8000, "myClientId");

// client = new Paho.MQTT.Client("test.mosquitto.org", 8080, "clientId");

// var client = new Paho.MQTT.Client("ws://iot.eclipse.org/ws", "myClientId" + new Date().getTime());
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("FlightLog", 1);
  client.subscribe("Navigation", 1);

  client.subscribe("/World");

}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
    console.log(message.payloadString);
    console.log(typeof message.payloadString)
    
    // dataTest = JSON.stringify(dataTest);
    // console.log(dataTest.Battery);
    console.log(message.destinationName);

    if (message.destinationName == "FlightLog") {
        var data = eval('(' + message.payloadString + ')');
        // battery

        var battery = data.Battery.split(",")
        var voltage = batteryTmp[0];
        var level = batteryTmp[1];
        var current = batteryTmp[2];

        // time
        // now = new Date();
        // now.setTime(dataTest.TimeStamp * 1000);
        // dateTmp = now.toLocaleTimeString();
        // date.push(dateTmp);

        // channels
        // channelsTmp = dataTest.ServoOutput.split(",");
        // channelOne.push(channelsTmp[0]);
        // channelTwo.push(channelsTmp[1]);
        // channelThr.push(channelsTmp[2]);
        // channelFou.push(channelsTmp[3]);
        // channelFiv.push(channelsTmp[4]);
        // channelSix.push(channelsTmp[5]);
        // channelSev.push(channelsTmp[6]);
        // channelEig.push(channelsTmp[7]);
        // channelFiv.push(1500);

        // velocity
        velocityTmp = dataTest.Velocity.split(",");
        EKF = dataTest.EKF;
        Mode = dataTest.Mode;
        Status = dataTest.SystemStatus;

        // attitude
        attitudeTmp = dataTest.Attitude.split(",");

        // x = document.getElementById("EKF");  //查找元素
        // x.innerHTML="EKF : " + EKF + " ";

        // y = document.getElementById("Mode");  //查找元素
        // y.innerHTML="Mode : " + Mode + " ";

        // z = document.getElementById("Status");  //查找元素
        // z.innerHTML="System Status : " + Status + " ";

        var 

        // data
        batteryNumber.innerHTML= current;      
        batteryLevel.innerHTML= level;
        heightValue.innerHTML= "10.0";
        disValue.innerHTML= "10.0";
        vsValue.innerHTML= "10.0";
        hsValue.innerHTML= "10.0";

        len = date.length
        if (len > 20) {
            voltage.shift();
            current.shift();
            level.shift();

            date.shift();

            channelOne.shift();
            channelTwo.shift();
            channelThr.shift();
            channelFou.shift();
            channelFiv.shift();
            channelSix.shift();
            channelSev.shift();
            channelEig.shift();

        };

        // ecahrts
        option.series[0].data[0].value = 11
        eChart.setOption(option,true);

        // battery
        if (batteryTmp > 30) {
            var tmp = batteryTmp - 30;
            var width = tmp.toString() + '%';
            $(".progress-bar-info").css("width", width);
        }
        else if(batteryTmp > 10){
            var tmp = batteryTmp - 10;
            var width = tmp.toString() + '%';
            $(".progress-bar-info").css("width", 0);
            $(".progress-bar-warning").css("width", width);
        }else{
            var tmp = batteryTmp;
            var width = tmp.toString() + '%';
            $(".progress-bar-info").css("width", 0);
            $(".progress-bar-warning").css("width", 0);
            $(".progress-bar-danger").css("width", width);
        }

    }

    // for decision

    // else if (message.destinationName == "Navigation"){
    //     decision = dataTest.Navigation;
    //     // decision = "a";

    //     // time
    //     now = new Date();
    //     now.setTime(dataTest.TimeStamp * 1000);
    //     dateTmp = now.toLocaleTimeString();

    //     de = document.getElementById("decision");  //查找元素
    //     de.innerHTML += "<p>" + dateTmp + " : " + decision + "</p>";
    //     de.scrollTop = de.scrollHeight;
    // }


}          

if (option && typeof option === "object") {
eChart.setOption(option, true);
} 

$(".take-off").on("click", function () {
    alert("take off");
    var message = new Paho.MQTT.Message("take off");
    message.destinationName = "/World";
    client.send(message);
});

$(".back-home").on("click", function () {
    alert("back home");
    var message = new Paho.MQTT.Message("back home");
    message.destinationName = "/World";
    client.send(message);
});

$(".cancel").on("click", function () {
    alert("cancel");
    var message = new Paho.MQTT.Message("cancel");
    message.destinationName = "/World";
    client.send(message);
});
$(".glyphicon-cloud-upload").on("click", function () {
    $("#win").css("display", "block");
});
$(".submit_button").on("click", function () {
    var direction_text = $(".direction_text").val();
    var distance_text = $(".distance_text").val();
    var mes = direction_text + "," + distance_text;
    console.log(mes);
    var message = new Paho.MQTT.Message(mes);
    message.destinationName = "/World";
    client.send(message);
});
$(".cancel_button").on("click", function () {
    $("#win").css("display", "none");
});
$(".turn-up").on("click", function () {
    alert("turn up");
    var message = new Paho.MQTT.Message("turn up");
    message.destinationName = "/World";
    client.send(message);
});
$(".turn-down").on("click", function () {
    alert("turn down");
    var message = new Paho.MQTT.Message("turn down");
    message.destinationName = "/World";
    client.send(message);
});
$(".turn-left").on("click", function () {
    alert("turn left");
    var message = new Paho.MQTT.Message("turn left");
    message.destinationName = "/World";
    client.send(message);
});
$(".turn right").on("click", function () {
    alert("turn right");
    var message = new Paho.MQTT.Message("turn right");
    message.destinationName = "/World";
    client.send(message);
});

//数据准备,  
var points = [];//原始点信息数组  
var bPoints = [];//百度化坐标数组。用于更新显示范围。  
  
//地图操作开始  
var map = new BMap.Map("allmap");    
  
map.centerAndZoom(new BMap.Point(116.404, 39.915), 15); //初始显示中国。  
  
// map.enableScrollWheelZoom();//滚轮放大缩小  
  
setTimeout(dynamicLine, 1000);//动态生成新的点。

//添加线  
function addLine(points){  
  
    var linePoints = [],pointsLen = points.length,i,polyline;  
    if(pointsLen == 0){  
        return;  
    }  
    // 创建标注对象并添加到地图     
    for(i = 0;i <pointsLen;i++){  
        linePoints.push(new BMap.Point(points[i].lng,points[i].lat));  
    }  
  
    polyline = new BMap.Polyline(linePoints, {strokeColor:"red", strokeWeight:5, strokeOpacity:0.5});   //创建折线  
    map.addOverlay(polyline);   //增加折线  
}  

//随机生成新的点，加入到轨迹中。  
function dynamicLine(){  
    var lng = 100+getRandom(40);  
    var lat = 35+getRandom(30);  
    var id = getRandom(1000);  
    var point = {"lng":lng,"lat":lat,"status":1,"id":id}  
    var makerPoints = [];  
    var newLinePoints = [];  
    var len;  
  
    makerPoints.push(point);              
    // addMarker(makerPoints);//增加对应该的轨迹点  
    points.push(point);  
    bPoints.push(new BMap.Point(lng,lat));  
    len = points.length;  
    newLinePoints = points.slice(len-2, len);//最后两个点用来画线。  
  
    addLine(newLinePoints);//增加轨迹线  
    setZoom(bPoints);  
    setTimeout(dynamicLine, 1000);  
}  

// 获取随机数  
function getRandom(n){  
    return Math.floor(Math.random()*n+1)  
}  

//根据点信息实时更新地图显示范围，让轨迹完整显示。设置新的中心点和显示级别  
function setZoom(bPoints){  
    var view = map.getViewport(eval(bPoints));  
    var mapZoom = view.zoom;   
    var centerPoint = view.center;   
    map.centerAndZoom(centerPoint,mapZoom);  
} 

var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
var mapType2 = new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_LEFT});

var overView = new BMap.OverviewMapControl();
var overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});

//添加地图类型和缩略图
function add_control(){
    map.addControl(mapType1);          //2D图，卫星图
    map.addControl(mapType2);          //左上角，默认地图控件
    map.setCurrentCity("北京");        //由于有3D图，需要设置城市哦
    map.addControl(overView);          //添加默认缩略地图控件
    map.addControl(overViewOpen);      //右下角，打开
}
add_control();


