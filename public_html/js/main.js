var BASEPATH = "http://www.furukoo.fr/furukoov3/";
var LastMsgTime = 12345678901234; // 14 digits
var Adress = "00000000000000";
var Smoke = false;
var rLoopTmrId = null;
var LoginFrm = 1500;

var ChatMsgListGrdUI = null;
var ChatMsgInputTfdUI = null;

$(function(){zebra.ready(function(){main();});});

function main(){
  eval(zebra.Import("ui","layout","ui.grid","io"));
  $.ajaxSetup({
    error: function(xhr){
      console.log('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
    }
  });
  drawUI();
  readingLoop();
 
}

function drawUI(){
  eval(zebra.Import("ui","layout","ui.grid"));
  var r = new zCanvas(400,400).root;
  r.setLayout(new BorderLayout(1,1));
  //r.fullScreen();
  
  ChatMsgListGrdUI = new List();
  ChatMsgInputTfdUI = new HtmlTextField("Msg here");
  ChatMsgInputTfdUI.element.id = 'ChatMsgInputTfdId';
  
  r.add(CENTER, new ScrollPan(ChatMsgListGrdUI));
  r.add(BOTTOM, ChatMsgInputTfdUI);
  
  $('#ChatMsgInputTfdId').on("keyup", function(e){if(e.keyCode === 13){msgXmt();}});

}

function readingLoop(){
  var rq=null;
  rq=$.ajax({type:'POST', data:{u:'Yvan', t:LastMsgTime, r:'1500', a:Adress},
  dataType: 'text', timeout: 6000, cache: false,
  contentType:'application/x-www-form-urlencoded' , 
  url: BASEPATH + "r.php",
  beforeSend: function(){if(rq!==null){rq.abort();}},
  success: function(data){
    // console.log(data);
    switch(data){
      case "" : rLoopTmrId = setTimeout(readingLoop, 1200); break;
      default : 
        // console.log(data + ' 2 ');
        var j = $.parseJSON(data);
        if(j===null){
          console.log(j);
          rLoopTmrId = setTimeout(readingLoop, 1200);
          break;
        }
        msgRcv(j); break;
    };
  },
  error  : function(){
  if(rq !== null){rq.abort();}; rLoopTmrId = setTimeout(readingLoop, 2000);}
  });
}

function msgRcv(json){
  rLoopTmrId = setTimeout(readingLoop, 1200);  
  $.each(json, function(){
    if(LastMsgTime <= this['t']){
       LastMsgTime = this['t'];
    }
    switch(this['s']){
      case 0 :
        displayTextinChatBox(this['D'],0);
    };
  });
  //$('#ChatMsgListGrdUI').scrollTop(5000);

}

function displayTextinChatBox(Msg,ChatColor){
  ChatMsgListGrdUI.model.add(Msg);
  ChatMsgListGrdUI.select(ChatMsgListGrdUI.model.count()-1);
}

function msgXmt(){
  $.ajax({type:'POST',
  data:{d:'{"D":"' + $('#ChatMsgInputTfdId').val() + '","U":"Yvan","c":2', t:LastMsgTime, s:0, a:Adress},
  dataType: 'text', timeout: 6000, cache: false,
  url: BASEPATH + "w.php",
  success: function(){$('#ChatMsgInputTfdId').val('');},
  error  : function(){msgXmt();}
  });
}
