<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no">
  <title>Tcplayer Demo</title>
  <link href="https://web.sdk.qcloud.com/player/tcplayer/release/v4.8.0/tcplayer.min.css" rel="stylesheet"/>
  <!--播放器脚本文件-->
  <script src="https://web.sdk.qcloud.com/player/tcplayer/release/v4.8.0/tcplayer.v4.8.0.min.js"></script>
  <script src="https://tcplayer.vcube.tencent.com/tcplayer-plugins/tcplayer-barrage-plugin.js"></script>

  <style>
    html,body{
      margin: 0;
      padding: 0;
    }
    .tcplayer {
      margin: 0 auto;
    }

    @media only screen and (min-device-pixel-ratio: 2), only screen and (-webkit-min-device-pixel-ratio: 2) {
      .tcp-logo-img {
        width: 50%;
      }
    }

    @media screen and (max-width: 480px) {
      #player-container-id {
        width: 100%;
        height: 240px;
      }
    }

  </style>
</head>
<body>

<video id="player-container-id" preload="auto" width="640" height="360" playsinline webkit-playsinline>
</video>

<script>
  var player = TCPlayer("player-container-id", {
    fileID: "387702307847129127",
    appID: "1500006438",
    psign: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTUwMDAwNjQzOCwiZmlsZUlkIjoiMzg3NzAyMzA3ODQ3MTI5MTI3IiwiY3VycmVudFRpbWVTdGFtcCI6MTY2NzIxNjY1MywiY29udGVudEluZm8iOnsiYXVkaW9WaWRlb1R5cGUiOiJSYXdBZGFwdGl2ZSIsInJhd0FkYXB0aXZlRGVmaW5pdGlvbiI6MTB9LCJleHBpcmVUaW1lU3RhbXAiOjIyMDEwMTEyMDAsInVybEFjY2Vzc0luZm8iOnsiZG9tYWluIjoiMTUwMDAwNjQzOC52b2QyLm15cWNsb3VkLmNvbSIsInNjaGVtZSI6IkhUVFBTIn19.AYqjCMFQlo9nn6EMaF0Nol5vVq9miaoUqyvmFF62aSg',
  });

  const tcplayerBarrage = new TcplayerBarragePlugin(player);
  tcplayerBarrage.init();

  // 场景一：加载弹幕列表，通常可配合后端通过接口加载
  const timeLine = [{
    "mode": 1,
    "text":" Hello World",
    "stime": 2000,
    "size":  25,
    "color": '#FFFFFF'
  }, {"mode": 1,
    "text": "Hello World",
    "stime": 4000,
    "size": 25,
    "color": '#FFFFFF'
  },];
  tcplayerBarrage.load(timeLine);
  tcplayerBarrage.start();

  //场景二：用户输入并发送弹幕
  document.getElementById('send').addEventListener('click', function(e){
    e.preventDefault();
    var barrage = {
      "mode":1,
      "text": document.getElementById('danmu-input').value,
      "size": 30,
      "color":'#ff0000',
    };
    // 即时发送弹幕
    tcplayerBarrage.send(barrage);
  });

</script>
</body>
</html>
