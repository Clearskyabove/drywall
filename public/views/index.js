

$(function(){

	var $win = $(window),
		$right =  $("#right");

	//resize blue background
	$win.on("resize",function(){
		var tobeHeight = $win.height() - $right.offset().top;
		$right.css("height", tobeHeight); //css format since height() doesn't respect border-box property
	});
	$win.trigger("resize");
});