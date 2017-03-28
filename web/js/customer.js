//$("#sortable").sortable();
//$("#sortable").disableSelection();

countTodos();

// all done btn
$("#checkAll").click(function(){
    AllDone();
	saveItems();
});

function init(){
$.ajax({url: "https://bin-todo.run.aws-usw02-pr.ice.predix.io/read", success: function(result){ //http://127.0.0.1:3000/read
			var rows = result.split("\n");
			for(var row in rows) {
				if(rows[row] != ''){
					var s = rows[row].split(",");
					//for(var val in s) {
						if(s[1] != 'done'){
								var markup = '<li class="ui-state-default" time='+s[2]+'><div class="checkbox"><label><input type="checkbox" value="" />'+ s[0] +', created on '+s[2]+'</label></div></li>';
								$('#sortable').append(markup);
							}else{
									var markup = '<li time='+s[3]+'>'+ s[0] +', created on '+s[2]+', finished on '+s[3]+'<button class="btn btn-default btn-xs pull-right  remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>';
									$('#done-items').append(markup);
							}
					//}
				}
			}
			$('.add-todo').val('');
            countTodos();
			sortList();
		}});
}
/*
$.ajax({url: "https://ge-307009384/items?id=done", success: function(result){
			var s = result.split(",");
			for(var val in s) {
				if(s[val] != ''){
    var markup = '<li>'+ s[val] +'<button class="btn btn-default btn-xs pull-right  remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>';
	$('#done-items').append(markup);
					}
			}
		}});

//create todo
 $('.add-todo').on('keypress',function (e) {
      e.preventDefault
      if (e.which == 13) {
           if($(this).val() != ''){
           var todo = $(this).val();
            createTodo(todo); 
            countTodos();
           }else{
               // some validation
           }
      }
}); */

function sortList(){
	
			var mylist = $('#sortable');
			var listitems = mylist.children('li').get();
			 listitems.sort(function(a, b) {
			   return $(b).attr("time").localeCompare($(a).attr("time"));
			})
			$.each(listitems, function(idx, itm) { mylist.append(itm); });
			
	
			var donelist = $('#done-items');
			var donelistitems = donelist.children('li').get();
			 donelistitems.sort(function(a, b) {
			   return $(b).attr("time").localeCompare($(a).attr("time"));
			})
			$.each(donelistitems, function(idx, itm) { donelist.append(itm); });
			
}

function saveItems(){
	var data = '';
	 for(var i=0;i<$("#sortable li").length;i++) {
		 if($("#sortable li")[i].innerText[$("#sortable li")[i].innerText.length-1] == '\n'){
			  var content = $("#sortable li")[i].innerText.substr(0,$("#sortable li")[i].innerText.length-1);
			  var c = content.split(', created on ');
			data+= c[0]+',,'+c[1]+'\n';
		 }else {
			 var content = $("#sortable li")[i].innerText;
			 var c = content.split(', created on ');
			 data+= c[0]+',,'+c[1]+'\n';
		 }
	 }
	 for(var i=0;i<$("#done-items li").length;i++) {
		 var content = $("#done-items li")[i].innerText;
		 var c = content.split(', created on ');
		 var t = c[1].split(', finished on ');
			data+= c[0]+',done,'+t[0]+','+t[1]+'\n';
	 }
	 
	 $.ajax({
	  type: "POST",
	  url: "https://bin-todo.run.aws-usw02-pr.ice.predix.io/write", //http://127.0.0.1:3000/write
	  data: data,
	  success: function(data) {	},
	  dataType: "text"
	});
	
}
	
$("#add").click(function(){
           if($("#newItem").val() != ''){
           var todo = $("#newItem").val();
            createTodo(todo); 
            countTodos();
			saveItems();
			sortList();
           }else{
               // some validation
           }
});

// mark task as done
$('.todolist').on('change','#sortable li input[type="checkbox"]',function(){
    if($(this).prop('checked')){
        var doneItem = $(this).parent().parent().find('label').text();
        $(this).parent().parent().parent().addClass('remove');
        done(doneItem);
		saveItems();
        countTodos();
    }
});

//delete done task from "already done"
$('.todolist').on('click','.remove-item',function(){
    removeItem(this);
	saveItems();
});

// count tasks
function countTodos(){
    var count = $("#sortable li").length;
    $('.count-todos').html(count);
}

function getCurrentDate(){
	
	var today = new Date(); 
	var dd = today.getDate(); 
	var mm = today.getMonth()+1; //January is 0! 
	var yyyy = today.getFullYear(); 
	if(dd<10){ dd='0'+dd; } 
	if(mm<10){ mm='0'+mm; } 
	var hours = today.getHours(), minutes = today.getMinutes(), seconds = today.getSeconds(); 
	return yyyy+'-'+mm+'-'+dd+'_'+hours + (minutes < 10 ? ":0" : ":") + minutes+(seconds < 10 ? ":0" : ":") + seconds;  
}

function getDateValue(){
	
	var today = new Date(); 
	var dd = today.getDate(); 
	var mm = today.getMonth()+1; //January is 0! 
	var yyyy = today.getFullYear(); 
	if(dd<10){ dd='0'+dd; } 
	if(mm<10){ mm='0'+mm; }
	return mm+'/'+dd+'/'+yyyy;  
}

//create task
function createTodo(text){
	
    var markup = '<li class="ui-state-default" time='+getCurrentDate()+' deadline='+$('#date-value').val()+'><div class="checkbox"><label><input type="checkbox" value="" />'+ text +', created on '+getCurrentDate()+'</label></div></li>';
    $('#sortable').append(markup);
	/*if($('#sortable').children().length>0){
		$('#sortable li:eq(0)').prepend(markup);
	}else{
		$('#sortable').append(markup);
	}*/
    $('.add-todo').val('');
}

//mark task as done
function done(doneItem){
    var done = doneItem;
    var markup = '<li time='+getCurrentDate()+'>'+ done +', finished on '+getCurrentDate()+'<button class="btn btn-default btn-xs pull-right  remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>';
    //$('#done-items li:eq(0)').prepend(markup);
	$('#done-items').append(markup);
    $('.remove').remove();
}

//mark all tasks as done
function AllDone(){
    var myArray = [];

    $('#sortable li').each( function() {
         myArray.push($(this).text());   
    });
    
    // add to done
    for (i = 0; i < myArray.length; i++) {
        $('#done-items').append('<li>' + myArray[i] + '<button class="btn btn-default btn-xs pull-right  remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>');
    }
    
    // myArray
    $('#sortable li').remove();
    countTodos();
}

//remove done task from list
function removeItem(element){
    $(element).parent().remove();
}