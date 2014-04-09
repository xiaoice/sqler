/**
 * easyui-扩展
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define(function(require,exports,module){
	 require("my97");
	 exports.init=function(callback){
		 
	     //重写datagrid的编辑文本框
	     $.extend($.fn.datagrid.defaults.editors, {
    	 textComment: {
		        init: function(container, options){
			        var input = $('<input type="text" class="datagrid-editable-input"/>').appendTo(container);
			        return input.wrap("<div class=\"datagrid-editable-input-div\"></div>").validatebox(options);
		        },
		        destroy: function(target){
		        	$(target).remove();
		        },
		        getValue: function(target){
		        	var value=$(target).val();
		        	return $.isEmptyObject(value)?"":value;
		        },
		        setValue: function(target, value){
		        	$(target).val($.isEmptyObject(value)?"":value);
		        },
		        resize: function(target, width){
			        $(target)._outerWidth(width);
			    }
	        },
	     	textbox : {  
	 	    	init: function(container, options){
	 		        var input = $('<input type="text" class="datagrid-editable-input"/>').appendTo(container);
	 		        return input.wrap("<div class=\"datagrid-editable-input-div\"></div>").validatebox(options);
	 	        },
	 	        destroy: function(target){
	 	        	$(target).remove();
	 	        },
	 	        getValue: function(target){
	 	        	var value=$(target).val();
	 	        	return $.isEmptyObject(value)?{}:value;
	 	        },
	 	        setValue: function(target, value){
	 	        	$(target).val($.isEmptyObject(value)?"":value);
	 	        },
	 	        resize: function(target, width){
	 		        $(target)._outerWidth(width);
	 		    }
	         },
	         my97:{
	             init: function(container, options){
	                 var input = $('<input type="text" class="Wdate">').appendTo(container);
	                 options = options || {};
	                 options = $.extend({}, options, {readOnly: true});
	                 return input.focus(function(){
	                     WdatePicker();
	                 });
	             },
	             getValue: function(target){
	                 return $(target).val();
	             },
	             setValue: function(target, value){
	                 $(target).val(value);
	             },
	             resize: function(target, width){
	                 var input = $(target);
	                 if($.boxModel == true){
	                     input.width(width - (input.outerWidth() - input.width()));
	                 }else{
	                     input.width(width);
	                 }
	             }
	         },
	         datetimebox: {
	             init: function(container, options){
	                 var input = $('<input type="text" class="easyui-datetimebox">').appendTo(container);
	                 options = options || {};
	                 options = $.extend({}, options, {formatter: function(date){return $.dateFormat(new Date(date), 'yyyy-MM-dd hh:mm:ss')}})
	                 return input.datetimebox(options);
	             },
	             getValue: function(target){
	            	 var value=$(target).datetimebox('getValue');
			         return $.isEmptyObject(value)?"":value;
	             },
	             setValue: function(target, value){
	                 $(target).datetimebox('setValue', $.isEmptyObject(value)?"":value);
	             },
	             resize: function(target, width){
	                 $(target).datetimebox('resize', width);
	             }
	         },
	         numberspinner: {
	             init: function(container, options){
	                 var input = $('<input type="text">').appendTo(container);
	                 options = options || {};
	                 options = $.extend({}, options, {min:0, editable: false});
	                 return input.numberspinner(options);
	             },
	             getValue: function(target){
	                 return $(target).numberspinner('getValue');
	             },
	             setValue: function(target, value){
	                 $(target).numberspinner('setValue', value);
	             },
	             resize: function(target, width){
	                 $(target).numberspinner('resize', width);
	             }
	         },
	         timespinner: {
	             init: function(container, options){
	                 var input = $('<input type="text">').appendTo(container);
	                 options = options || {};
	                 return input.timespinner(options);
	             },
	             getValue: function(target){
	                 return $(target).timespinner('getValue');
	             },
	             setValue: function(target, value){
	                 $(target).timespinner('setValue', value);
	             },
	             resize: function(target, width){
	                 $(target).timespinner('resize', width);
	             }
	         },
	         combogrid: {
	             init: function(container, options){
	                 var input = $('<input type="text">').appendTo(container);
	                 options = options || {};
	                 options = $.extend({}, options, {panelWidth: 400, editable: false});
	                 return input.combogrid(options);
	             },
	             getValue: function(target){
	                 return $(target).combogrid('getValue');
	             },
	             setValue: function(target, value){
	                 $(target).combogrid('setValue', value);
	             },
	             resize: function(target, width){
	                 $(target).combogrid('resize', width);
	             }
	         }
	     });
	     
	 };
});

(function($){
    $.extend({
        dateFormat: function(date, pattern){
            if (date == null) {
                return null;
            }

            var formatter = "yyyy-MM-dd";
            if (pattern != null) {
            	formatter = pattern;
            }

            var year = date.getFullYear().toString();
            var month = (date.getMonth() + 1).toString();
            var day = date.getDate().toString();
            var hours = date.getHours().toString();
            var minutes = date.getMinutes().toString();
            var seconds = date.getSeconds().toString();
            var yearMarker = formatter.replace(/[^y]/g, '');
            var monthMarker = formatter.replace(/[^M]/g, '');
            var dayMarker = formatter.replace(/[^d]/g, '');
            var hoursMarker = formatter.replace(/[^h]/g, '');
            var minutesMarker = formatter.replace(/[^m]/g, '');
            var secondsMarker = formatter.replace(/[^s]/g, '');
            if (yearMarker.length == 2) {
                year = year.substring(2, 4);
            }

            if (monthMarker.length > 1 && month.length == 1) {
                month = "0" + month;
            }

            if (dayMarker.length > 1 && day.length == 1) {
                day = "0" + day;
            }

            if (hoursMarker.length > 1 && hours.length == 1) {
                hours = "0" + hours;
            }

            if (minutesMarker.length > 1 && minutes.length == 1) {
                minutes = "0" + minutes;
            }

            if (secondsMarker.length > 1 && seconds.length == 1) {
                seconds = "0" + seconds;
            }

            if (yearMarker.length > 0) {
                formatter = formatter.replace(yearMarker, year);
            }
            if (monthMarker.length > 0) {
                formatter = formatter.replace(monthMarker, month);
            }

            if (dayMarker.length > 0) {
                formatter = formatter.replace(dayMarker, day);
            }

            if (hoursMarker.length > 0) {
                formatter = formatter.replace(hoursMarker, hours);
            }

            if (minutesMarker.length > 0) {
                formatter = formatter.replace(minutesMarker, minutes);
            }

            if (secondsMarker.length > 0) {
                formatter = formatter.replace(secondsMarker, seconds);
            }

            return formatter;
        },
        parseDate: function(dateString, pattern){
            var today = new Date();
            if (dateString == null) {
                return today;
            }

            if (pattern == null) {
                var formatter = "yyyy-MM-dd";
            }else{
                var formatter = pattern;
            }

            var yearMarker = formatter.replace(/[^y]/g, '');
            var monthMarker = formatter.replace(/[^M]/g, '');
            var dayMarker = formatter.replace(/[^d]/g, '');
            var hoursMarker = formatter.replace(/[^h]/g, '');
            var minutesMarker = formatter.replace(/[^m]/g, '');
            var secondsMarker = formatter.replace(/[^s]/g, '');
            var yearPosition = formatter.indexOf(yearMarker);
            var yearLength = yearMarker.length;
            var year = parseInt(dateString.substring(yearPosition, yearPosition
                + yearLength));
            if (isNaN(year)) {
                year = today.getYear();
            } else {
                if (yearLength == 2) {
                    if (year < 50) {
                        year += 2000;
                    } else {
                        year += 1900;
                    }
                }
            }

            var monthPosition = formatter.indexOf(monthMarker);
            var month = parseInt(dateString.substring(monthPosition, monthPosition
                + monthMarker.length));
            if (isNaN(month)) {
                month = today.getMonth();
            } else {
                month -= 1
            }

            var dayPosition = formatter.indexOf(dayMarker);
            var day = parseInt(dateString.substring(dayPosition, dayPosition
                + dayMarker.length));
            if (isNaN(day)) {
                day = today.getDate();
            }

            var hoursPosition = formatter.indexOf(hoursMarker);
            var hours = parseInt(dateString.substring(hoursPosition, hoursPosition
                + hoursMarker.length));
            if (isNaN(hours)) {
                hours = 0;
            }

            var minutesPosition = formatter.indexOf(minutesMarker);
            var minutes = parseInt(dateString.substring(minutesPosition,
                minutesPosition + minutesMarker.length));
            if (isNaN(minutes)) {
                minutes = 0;
            }

            var secondsPosition = formatter.indexOf(secondsMarker);
            var seconds = parseInt(dateString.substring(secondsPosition,
                secondsPosition + secondsMarker.length));
            if (isNaN(seconds)) {
                seconds = 0;
            }

            return new Date(year, month, day, hours, minutes, seconds);
        }
    });
        
        $.extend({
            dateFormat: function(date, pattern){
                if (date == null) {
                    return null;
                }

                if (pattern == null) {
                    var formatter = "yyyy-MM-dd";
                }else{
                    var formatter = pattern;
                }

                var year = date.getFullYear().toString();
                var month = (date.getMonth() + 1).toString();
                var day = date.getDate().toString();
                var hours = date.getHours().toString();
                var minutes = date.getMinutes().toString();
                var seconds = date.getSeconds().toString();
                var yearMarker = formatter.replace(/[^y]/g, '');
                var monthMarker = formatter.replace(/[^M]/g, '');
                var dayMarker = formatter.replace(/[^d]/g, '');
                var hoursMarker = formatter.replace(/[^h]/g, '');
                var minutesMarker = formatter.replace(/[^m]/g, '');
                var secondsMarker = formatter.replace(/[^s]/g, '');
                if (yearMarker.length == 2) {
                    year = year.substring(2, 4);
                }

                if (monthMarker.length > 1 && month.length == 1) {
                    month = "0" + month;
                }

                if (dayMarker.length > 1 && day.length == 1) {
                    day = "0" + day;
                }

                if (hoursMarker.length > 1 && hours.length == 1) {
                    hours = "0" + hours;
                }

                if (minutesMarker.length > 1 && minutes.length == 1) {
                    minutes = "0" + minutes;
                }

                if (secondsMarker.length > 1 && seconds.length == 1) {
                    seconds = "0" + seconds;
                }

                if (yearMarker.length > 0) {
                    formatter = formatter.replace(yearMarker, year);
                }
                if (monthMarker.length > 0) {
                    formatter = formatter.replace(monthMarker, month);
                }

                if (dayMarker.length > 0) {
                    formatter = formatter.replace(dayMarker, day);
                }

                if (hoursMarker.length > 0) {
                    formatter = formatter.replace(hoursMarker, hours);
                }

                if (minutesMarker.length > 0) {
                    formatter = formatter.replace(minutesMarker, minutes);
                }

                if (secondsMarker.length > 0) {
                    formatter = formatter.replace(secondsMarker, seconds);
                }

                return formatter;
            },
            parseDate: function(dateString, pattern){
                var today = new Date();
                if (dateString == null) {
                    return today;
                }

                if (pattern == null) {
                    var formatter = "yyyy-MM-dd";
                }else{
                    var formatter = pattern;
                }

                var yearMarker = formatter.replace(/[^y]/g, '');
                var monthMarker = formatter.replace(/[^M]/g, '');
                var dayMarker = formatter.replace(/[^d]/g, '');
                var hoursMarker = formatter.replace(/[^h]/g, '');
                var minutesMarker = formatter.replace(/[^m]/g, '');
                var secondsMarker = formatter.replace(/[^s]/g, '');
                var yearPosition = formatter.indexOf(yearMarker);
                var yearLength = yearMarker.length;
                var year = parseInt(dateString.substring(yearPosition, yearPosition
                    + yearLength));
                if (isNaN(year)) {
                    year = today.getYear();
                } else {
                    if (yearLength == 2) {
                        if (year < 50) {
                            year += 2000;
                        } else {
                            year += 1900;
                        }
                    }
                }

                var monthPosition = formatter.indexOf(monthMarker);
                var month = parseInt(dateString.substring(monthPosition, monthPosition
                    + monthMarker.length));
                if (isNaN(month)) {
                    month = today.getMonth();
                } else {
                    month -= 1
                }

                var dayPosition = formatter.indexOf(dayMarker);
                var day = parseInt(dateString.substring(dayPosition, dayPosition
                    + dayMarker.length));
                if (isNaN(day)) {
                    day = today.getDate();
                }

                var hoursPosition = formatter.indexOf(hoursMarker);
                var hours = parseInt(dateString.substring(hoursPosition, hoursPosition
                    + hoursMarker.length));
                if (isNaN(hours)) {
                    hours = 0;
                }

                var minutesPosition = formatter.indexOf(minutesMarker);
                var minutes = parseInt(dateString.substring(minutesPosition,
                    minutesPosition + minutesMarker.length));
                if (isNaN(minutes)) {
                    minutes = 0;
                }

                var secondsPosition = formatter.indexOf(secondsMarker);
                var seconds = parseInt(dateString.substring(secondsPosition,
                    secondsPosition + secondsMarker.length));
                if (isNaN(seconds)) {
                    seconds = 0;
                }

                return new Date(year, month, day, hours, minutes, seconds);
            }
        });
        
	//对象比较
	//https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
    window.equals = function( x, y ) {
    	if ( x === y ) return true;
    	//if both x and y are null or undefined and exactly the same
    	if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    	//if they are not strictly equal, they both need to be Objects
    	if ( x.constructor !== y.constructor ) return false;
    	//they must have the exact same prototype chain, the closest we can do is
    	//test there constructor.
    	for ( var p in x ) {
    		if ( ! x.hasOwnProperty( p ) ) continue;
    		//other properties were tested using x.constructor === y.constructor
    		if ( ! y.hasOwnProperty( p ) ) return false;
    		//allows to compare x[ p ] and y[ p ] when set to undefined
    		if ( x[ p ] === y[ p ] ) continue;
    		//if they have the same strict value or identity then they are equal
    		if ( typeof( x[ p ] ) !== "object" ) return false;
    		//Numbers, Strings, Functions, Booleans must be strictly equal
    		if ( ! equals( x[ p ], y[ p ] ) ) return false;
    		//Objects and Arrays must be tested recursively
    	}
    	for ( p in y ) {
    		if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
    		//allows x[ p ] to be set to undefined
    	}
    	return true;
    };
    
    //重新isEmptyObject方法
    jQuery.extend({
    	isEmptyObject1:function(obj){
    		if(typeof obj =="object"){
    			 for (var i in obj) { 
    				 return false; 
			     }
    			 return true;
    		}
    		return false;
    	}
    });
    		
})(jQuery);
