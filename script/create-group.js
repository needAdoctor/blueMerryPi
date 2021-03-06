$(function() {
    //添加和移除标签  start
    (function(){
        var labelInput = $(".disp");
        var ipva=$(".ipva");
        var iInp=$(".i_inp");

        //按下回车键生成标签
        $(ipva).on("keypress", function () {
            if (window.event) {
                oEvent = window.event;		//处理兼容性，获得事件对象
                //设置IE的charCode值
                oEvent.charCode = (oEvent.type == "keypress") ? oEvent.keyCode : 0;
            }
            if (oEvent.keyCode == 13) {
                var rds = $(this).val();
                var parten = /^\s*$/;
                if (parten.test(rds)) {
                } else {
                    //var sortable = $(".ui-sortable");

                    $(this).parent().find(".disp").append('<span id="dc" class="sort"  style="  background: rgb(16,157,89);  white-space: nowrap; border-radius:3px; float: left;  display: block; padding-left: 5px; margin: 8px;  height: 22px;  font-size: 14px;  color: #fff;  text-indent: 0; "><div  id="dart"  style="padding:0px 6px; cursor:pointer; height:22px; display:block; float:left;   line-height:22px;">' + rds + '</div><img  class="close"  src="indexImg/close2.png" style="float:left; display:block; cursor:pointer; " /></span>');
                    $(this).val("");

                    again();
                }
            }
        });

        //点击推荐标签后生成标签并显示
        $(".recommend-label a").on("click", function () {
            $(ipva).parent().find(".disp").append('<span id="dc" class="sort"  style="  background: rgb(16,157,89);  white-space: nowrap; border-radius:3px; float: left;  display: block; padding-left: 5px; margin: 8px;  height: 22px;  font-size: 14px;  color: #fff;  text-indent: 0; "><div  id="dart"  style="padding:0px 6px; cursor:pointer; height:22px; display:block; float:left;   line-height:22px;">' + $(this).html() + '</div><img class="close" src="indexImg/close2.png" style="float:left; display:block; cursor:pointer; " /></span>');
            $(ipva).val("");

            again();
        });

        function again(){
            //如果标签个数大于2个则移除输入框
            if ((labelInput.children().length - 1) > 2) {
                $(".ipva").remove();
            }

            //点击关闭图标时移除当前标签，并加回输入框
            $(".close").on("click",function(){
                console.log("haha");
                $(this).parent().remove();
                if((labelInput.children().length - 1) <3  &&  $(".ipva").length===0){
                    $(".i_inp").append("    <input class='ipva'   name=''    type='text'   />");
                    console.log($(".ipva"));
                }
            });
        }

        $(iInp).on("click",function(){
            $(this).find(".ipva").css("display","block");
            $(this).find(".ipva").focus();
        });

    })();
    //添加和移除标签  end


    //上传头像插件
    // 截图插件
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
                };

            obj.spinner.show();
            obj.image.onload = function() {
                obj.spinner.hide();
                setBackground();
                el.bind('mousedown', imgMouseDown);
                el.bind('mousemove', imgMouseMove);
                $(window).bind('mouseup', imgMouseUp);
                // el.bind('mousewheel DOMMouseScroll', zoomImage);
            };
            obj.image.src = options.imgSrc;
            el.on('remove', function(){$(window).unbind('mouseup', imgMouseUp)});

            return obj;
        };

        jQuery.fn.cropbox = function(options){
            return new cropbox(options, this);
        };
    }));

    var options =
    {
        thumbBox: '.thumbBox',
        spinner: '.spinner',
        imgSrc: 'indexImg/dog.jpg'
    };
    var cropper = $('.imageBox').cropbox(options);
    $('#upload-file').on('change', function () {
        var reader = new FileReader();
        reader.onload = function (e) {
            options.imgSrc = e.target.result;
            cropper = $('.imageBox').cropbox(options);
        };
        reader.readAsDataURL(this.files[0]);
        //this.files = [];         //临时性注释
    });
    $('#btnCrop').on('click', function () {
        var img = cropper.getDataURL();
        $('.p_cropped').html('');
        $('.p_cropped').append('<img src="' + img + '" align="absmiddle" style="width:76px;height:76px;margin-top:4px;;box-shadow:0px 0px 12px #7E7E7E;" ><p>76px*76px</p>');
        $('.p_cropped').append('<img src="' + img + '" align="absmiddle" style="width:128px;margin-top:4px;height:128px;box-shadow:0px 0px 12px #7E7E7E;"><p>128px*128px</p>');
        $('.p_cropped').append('<img src="' + img + '" align="absmiddle" style="width:180px;margin-top:4px;height:180px;box-shadow:0px 0px 12px #7E7E7E;"><p>180px*180px</p>');
    });
    $('#btnZoomIn').on('click', function () {
        cropper.zoomIn();
    });
    $('#btnZoomOut').on('click', function () {
        cropper.zoomOut();
    });

    var bodyScroll=function(event){
        event.preventDefault();
    };

    //上传头像按钮的模拟点击  start
    $(".p-mengban").on("click",function(){
        $("#upload-file").trigger("click");
        $(".p-mengban").hide();
    });

});



