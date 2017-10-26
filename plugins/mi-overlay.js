
function init(){
if(typeof $j == 'undefined'){
    $j=$.noConflict();    
}

var params=[];
var scripts = document.getElementsByTagName('script');
for(var i = 0 ; i < scripts.length; i++){
	if(typeof $j(scripts[i]).attr('src') != 'undefined' && $j(scripts[i]).attr('src').indexOf('mi-overlay.js') > -1){
        params = $j(scripts[i]).data();
	}
}
     
if(params['portrait']){
    var portrait = params['portrait'];
}else{
    var portrait = false;    
}
if(params['landscape']){
    var landscape = params['landscape'];
}else{
    var landscape = false;    
}
if(params['href']){
    var link_url = params['href'];
}else{
    var link_url = '#';    
}

if(params['video']){
    var video_url = params['video'];
}     
if(params['autoplay']){
    var autoplay = params['autoplay'];
}else{
    var autoplay = true;
}


var youtube;
var vimeo;

if (!$j("link[href='https://cdn.rawgit.com/mercyint/pbshost/v1.0.2/plugins/css/overlay.css']").length){
    $j('<link href="https://cdn.rawgit.com/mercyint/pbshost/v1.0.2/plugins/css/overlay.css" rel="stylesheet">').appendTo("head");
}

if(video_url){
    if(video_url.indexOf('youtu') > -1){
        youtube = true;

        video_id = video_url.substr(video_url.indexOf("v=")+2, video_url.length-1);

        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = function(){
            console.log('api ready');

            var stage = $j('.fluid-width-video-wrapper');
            var player_div = $j('<div/>').attr('id','player');
            stage.empty();
            stage.append(player_div);
        
            var player;
            player = new YT.Player('player', {
            videoId: video_id,
            width:'100%',
            height:'auto',
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
        
        
        function onPlayerReady(event) {
              if(autoplay){
                event.target.playVideo();
              }
        }

        function onPlayerStateChange(event) {
        /*        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
          }*/
        }
        function stopVideo() {
            player.stopVideo();
        }
      
        
        
        }
        $j('#overlay').on('click',function(){
            $j('div.fluid-width-video-wrapper iframe').attr('src','');
            document.getElementById("overlay").style.display = "none";
        });

    }else if(video_url.indexOf("vimeo") > -1){//VIMEO SUPPORT
        vimeo = true;
    }else{
        //Unsupported Video
        video_url=null;
        youtube=false;
        vimeo=false;
    }
}


$j('document').ready(function(){
    
    if(vimeo){
        //load Vimeo
        var overlay = $j('#video_overlay').attr({
            //'onclick':'document.getElementById("overlay").style.display = "none"',
                    });

    	
    	var content_el = $j('#video_overlay div.fluid-width-video-wrapper');
    	
        var url = "https://vimeo.com/api/oembed.json?url="+video_url+"autoplay="+autoplay;
        var format = 'jsonp';
        $j.ajax({type: "GET",
    	        url:url,
    	        dataType:format,
    	        success:function(response){
        	        content_el.html(response.html);
        	        content_el.prepend(closer);

    	        }
        });
        
        overlay.append(content_el);
        $j('#overlay').on('click',function(){
            $j('div.fluid-width-video-wrapper iframe').attr('src','');
            document.getElementById("overlay").style.display = "none";
        });


    }else if (!youtube){//image
    	var image = new Image();
    	var imgHeight;
    	var imgWidth;
    	if($j(window).width() > $j(window).height()){//landscape
    		image.src = landscape;		
    	}else{//Portrait (Mobile)
    		image.src = portrait;
    	}
    	var overlay = $j('#overlay').attr({
    		'id':'overlay',
    		'onclick':'document.getElementById("overlay").style.display = "none"',
    	}).empty();
    	var closer = $j('<img/>').attr({
    		'src':'https://cdn.rawgit.com/mercyint/pbshost/master/plugins/images/close-button.png',
    		'id':'closer',
    		'onclick':'document.getElementById("overlay").style.display = "none"',
    	});
    	var image_slide = $j('<div/>').attr({
    		'id':'image_slide',
    	})
    	
    	if(link_url.length < 0){
        	link_url = "#";        	
    	}
    	
    	var link = $j('<a/>').attr({
    		'href':link_url,
    	});
    	var image_el = $j('<img/>').attr({
    		'src':image.src,
    		'id':'image'
    	});
    	
    	
    	
    	link.append(image_el);
    	image_slide.append(closer);
    	image_slide.append(link);



    	overlay.append(image_slide);
    	
    	
    	$j('body').append(overlay);
        
    }
	
});
}

if(typeof jQuery=='undefined') {
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
    jqTag.onload = init;
    headTag.appendChild(jqTag);
} else {
     init();
}
