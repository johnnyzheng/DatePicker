/**
* 手机端日期选择器，基于zepto
* @author johnnyzheng(johnnyzheng@tencent.com)
* @date 2015-12-31
* @version  v2.0.1
* 			2014-12-04 增加历史7天的选择，选中向前七天
* 			2014-12-08 支持全局setting.isSingleDay设置，支持随时对页面日期对象设置，reload即可生效
* 			2014-12-11 增加下拉和收折的动画效果
* 			2015-07-31 增加没有日期展示栏的模式支持，支持没有确定、取消按钮的快速点击提交
*			2015-08-13 增加初始化传递默认选中日期的功能
*			2015-12-31 多多记账积累的样式和逻辑控制，新版本
*/

;(function(global){
	global.atomuDatePicker = function(options){
		
		this.globalSetting = {
			isSingleDay : true
		};
		//传入的日期容器的配置
		this._defaults = {
			'mod' : 'default', //支持的模式，default:有日期展示span的，fastclick:无日期展示span和确定取消按钮
			'containerId':'',
			'defaultDate' : '', //初始化默认选中的日期
			'isSingleDay':true,
			'stopToday':true, // 今天之后的日期是否可选，默认为true不可选，如果让全面板的日期均可选，请将此参数设置为false
			'disableCss':'disabled',
			'singleSelectedCss' : 'single-selected',
			'firstCss':'first',
			'lastCss':'last',
			'selectCss':'selected',
			'ctnCss':'atomu-calendar',
			'wrapCss':'atomu-calendar-wrap',
			'autoSubmit':true,
			'clickSubmit':false,//支持没有提交按钮，点击日期即提交
			'triggerId':'atomuDatePicker_popup_btn',//支持自定义呼出元素
			'callback':function(dateObj){return true;}
		};

		this.opts = $.extend(this._defaults, options);
		
		this.globalSetting.isSingleDay = $.extend(this.globalSetting.isSingleDay, this.opts.isSingleDay);

		//单天的年、月、日
			var dt = this.opts.defaultDate === '' ? new Date() : new Date(this.opts.defaultDate);
			this.year = dt.getFullYear();
			this.month = dt.getMonth() + 1;
			this.date = dt.getDate();


		var _before = new Date(new Date().getTime() - 6*24*60*60*1000);; // 区间日期选择的时候的开始日期
		this.startDate = this.formatDate([_before.getFullYear(), _before.getMonth()+1, _before.getDate()].join('-'));
		//切换月份的游标
		this.cursorMonth = this.month - 1;
		this.cursorYear = this.year;

		this.maskTmpl = '<div class="atomu-mask"></div>';
		//TODO html 代码 模板化
		var htmlTmpl = {
			'default' : [
							'<div id="atomuDatePicker_popup_wrap" class="'+this.opts.wrapCss+'">',
								'<div class="'+this.opts.ctnCss+'" id="atomuDatePicker_popup_ctn" style="display:none;">',
									'<div class="hd">',
										'<a id="atomuDatePicker_prev" href="javascript:;" class="trigger prev"></a>',
										'<h3 id="atomuDatePicker_current_month"></h3>',
										'<a id="atomuDatePicker_next" href="javascript:;" class="trigger next"></a>',
									'</div>',
									'<table>',
										'<thead>',
											'<tr>',
												'<th>SUN</th>',
												'<th>MON</th>',
												'<th>TUE</th>',
												'<th>WED</th>',
												'<th>THU</th>',
												'<th>FRI</th>',
												'<th>SAT</th>',
											'</tr>',
										'</thead>',
										'<tbody id="atomuDatePicker_panel">',
										'</tbody>',
									'</table>',									
								'</div>',
							'</div>'
						].join('')
		}
		

		//构造日期面板
		if($('#'+this.opts.containerId).length > 0 && $('#atomuDatePicker_popup_wrap').length == 0)
			$('#'+this.opts.containerId).append(htmlTmpl[this.opts.mod]);

		//如果有默认选中时间

		//this.fillDate(new Date().getFullYear(), new Date().getMonth());
		this.fillDate(this.year, this.month-1);
		
				$('#atomuDatePicker_current_date').length > 0 && $('#atomuDatePicker_current_date').html(this.getCurrentDate(true)); //--当前日期
		$('#atomuDatePicker_current_month').html(this.formatDate([this.year, this.month].join('-'), true));//--当前月份

		this.init();

		//页面加载完毕，则提交callback事件、或者切换7天和今天的时候提交回调函数事件
		if(this.opts.autoSubmit){
			this.submit();
		}
	
	
	}

	global.atomuDatePicker.prototype.reload = function(){
		this.init();
		$('#atomuDatePicker_current_date').length>0 && $('#atomuDatePicker_current_date').html(this.getCurrentDate(true)); //--当前日期
	}
	/**
	* 初始化日期面板的切换月份的操作、气泡弹出的控制
	*/
	global.atomuDatePicker.prototype.init = function(){
		var that = this;
		var $panel = $('.'+that.opts.ctnCss), $mask = $('.atomu-mask');
		var util = {
			popup : function(btn, ctn, wrap, css) {
				css = css || 'open';
				var ITEMS_TIMEOUT = null, time_out = 500;

				function hidePop() {
					//$panel.addClass('slideup');
					$(ctn).addClass('slideup');
					setTimeout(function(){
						//$panel.removeClass('slideup');
						$('#' + wrap).removeClass(css);
						$('#' + ctn).removeClass('slideup').hide();
						$mask.remove();
					},350);
				}
		
				function showPop() {
					$('#' + wrap).addClass(css);
					$('#' + ctn).show().addClass('slidedown');

					//$panel.addClass('slidedown');
					$('body').append($(that.maskTmpl));
					//给遮罩层，绑定hidePanel事件
					$('.atomu-mask').unbind('click').click(function(){
						util.hidePanel();
					});
					setTimeout(function(){
						//$panel.removeClass('slidedown');
						$('#' + ctn).removeClass('slidedown');
					}, 350);

				}
		
				function isPopShow() {
					return $('#' + wrap).hasClass(css);
				}
		
				$("#" + btn).unbind('click').click(function() {
					isPopShow() ? hidePop() : showPop();
				});

		
			},

			hidePanel: function(){
				$panel.addClass('slideup');
				setTimeout(function(){
					$panel.removeClass('slideup');
					$('#atomuDatePicker_popup_wrap').removeClass('open');
					$('#atomuDatePicker_popup_ctn').hide();
					$('.atomu-mask').remove();
				},350);
			}
		};
		//popup
		//util.popup('atomuDatePicker_popup_btn', 'atomuDatePicker_popup_ctn', 'atomuDatePicker_popup_wrap');
		util.popup(that.opts.triggerId, 'atomuDatePicker_popup_ctn', 'atomuDatePicker_popup_wrap');
		//绑定向前翻月
		$('#atomuDatePicker_prev').unbind('click').bind('click', function(){
			if(that.cursorMonth <= 0){
				that.cursorYear--;
				that.cursorMonth = 11;
			}
			else{
				that.cursorMonth--;
			}

			var tDate = new Date(new Date(that.cursorYear, that.cursorMonth, that.date).setMonth(that.cursorMonth))

			
			that.fillDate(tDate.getFullYear(), tDate.getMonth());
			$('#atomuDatePicker_current_month').html(that.formatDate([tDate.getFullYear(), tDate.getMonth()+1].join('-'), true));
			that.init(); 
		});

		//绑定向后翻月
		$('#atomuDatePicker_next').unbind('click').bind('click', function(){
			
			if(that.cursorMonth >= 11){
				that.cursorYear++;
				that.cursorMonth = 0;
			}

			else{
				that.cursorMonth++;
			}
			var tDate = new Date(new Date(that.cursorYear, that.cursorMonth, that.date).setMonth(that.cursorMonth))

			that.fillDate(tDate.getFullYear(), tDate.getMonth());
			$('#atomuDatePicker_current_month').html(that.formatDate([tDate.getFullYear(), tDate.getMonth()+1].join('-'), true));
			that.init();
		});

		//取消 和 确定 的按钮事件binding
		$('#atomuDatePicker_cancel').unbind('click').bind('click', function(){
			util.hidePanel();
		});

		$('#atomuDatePicker_submit').unbind('click').bind('click', function(){
			util.hidePanel();
			that.submit();
		});

		this.initCss(); //初始化选中样式

	}

	/**
	* 成功提交日期选择
	*/
	global.atomuDatePicker.prototype.submit = function(){
		$('#atomuDatePicker_current_date').length > 0 && $('#atomuDatePicker_current_date').html(this.getCurrentDate(true));
		this.opts.callback(this.getCurrentDate());
	}

	/**
	* 构造日期选择面板，根据选择的日期
	* @param year 年份
	* @param month 月份
	* @param day 日 //用户传入默认选中日期的
	*/
	global.atomuDatePicker.prototype.fillDate = function(year, month, day){
		$('#atomuDatePicker_panel').empty();
		var that = this;
		//当月第一天
		var firstDayOfMonth = new Date(year, month, 1), dateBegin = new Date(year, month, 1);
		var w = dateBegin.getDay(); //获得星期几
		dateBegin.setDate(1 - w);

		//单月最后一天
		var lastDayOfMonth = new Date(year, month+1, 0), dateEnd = new Date(year, month+1, 0);
		w = dateEnd.getDay();
		dateEnd.setDate(dateEnd.getDate() + 6 - w);

		var tr = document.createElement('tr');
		// 构造日期面板
		for(var d=dateBegin; d.getTime()<=dateEnd.getTime();d.setDate(d.getDate() + 1)){
			if(0 == d.getDay()){
				//如果是周日，则新起一行
				tr = document.createElement('tr');
			}
			//初始化日期格，并绑定点击事件
			td = document.createElement('td');
			ymd = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
			$(td).attr('id', 'atomuDatePicker_'+ymd);


			//本周内的其他时间不可选
			if(d.getTime() < firstDayOfMonth.getTime() || d.getTime() > lastDayOfMonth.getTime()){
				$(td).attr('class', this.opts.disableCss);
			}
			else if(this.opts.stopToday && d.getTime() > new Date().getTime()){
				$(td).attr('class', this.opts.disableCss);
			}
			else{
				//如果是单天则选中单天，如果是7天，则向前7天
				if(this.globalSetting.isSingleDay){
					//给选中的单天增加选中样式
					if(this.opts.defaultDate !== ''){
						if(d.getDate() == day && d.getMonth() == month && d.getFullYear() == year){
							$(td).attr('class', that.opts.singleSelectedCss);
						}
					}
					else{
						if(d.getDate() == that.date && d.getMonth()+1 == that.month && d.getFullYear() == that.year){
							$(td).attr('class', that.opts.singleSelectedCss);
						}
					}
					
				}

				//给日期格子绑定点击事件
				(function(ymd){
					$(td).bind('click', function(){
						that.selectDate(ymd);
						return true;
					});
				})(ymd);
			}
			

			//组织页面panel元素
			div = document.createElement('div');
			$(div).attr('class', 'num').html(d.getDate());
			$(td).append(div);
			$(tr).append(td);
			//周六，这一行已经完成
			if(6 == d.getDay()){
				$('#atomuDatePicker_panel').append(tr);
			}

		}

	}


	/**
	*  样式初始化
	*/
	global.atomuDatePicker.prototype.initCss = function(){
		var that = this;
		if(!this.globalSetting.isSingleDay){
			$('.'+ that.opts.ctnCss +' table tr td').removeClass(that.opts.singleSelectedCss);
			var arr = that.startDate.split('-');
			var dtt = new Date(arr[0], arr[1]*1 - 1, arr[2]);
			$('#atomuDatePicker_'+[that.year, that.month, that.date].join('-')).addClass(that.opts.lastCss);
			$('#atomuDatePicker_'+[dtt.getFullYear(), dtt.getMonth()+1, dtt.getDate()].join('-')).addClass(that.opts.firstCss);
						//中间的5天增加样式
			i=5;
			do{
				var tmpDate = new Date(new Date(that.year, that.month-1, that.date).getTime() - i*24*60*60*1000);
				$('#atomuDatePicker_'+[tmpDate.getFullYear(), tmpDate.getMonth()+1, tmpDate.getDate()].join('-')).addClass(that.opts.selectCss);
				i--;
			}while(i>0);
		}
		else{
			$('.'+ that.opts.ctnCss +' table tr td').removeClass(this.opts.selectCss).removeClass(this.opts.firstCss).removeClass(this.opts.lastCss);
			$('#atomuDatePicker_'+[that.year, that.month, that.date].join('-')).addClass(that.opts.singleSelectedCss);
		}
		
	}

	/**
	*选中日期后的操作集合，包括增加样式，调用回调函数等
	* @param ymd 日期串 如: 2014-12-04
	*/
	global.atomuDatePicker.prototype.selectDate = function(ymd){
		
		var that = this;

		var ar = ymd.split('-');
		var dt = new Date(ar[0], ar[1] - 1, ar[2]);


		this.year = dt.getFullYear();
		this.month = dt.getMonth()+1;
		this.date = dt.getDate();

		var startDate = new Date(dt.getTime() - 6*24*60*60*1000);//默认向前推7天
		this.startDate = this.formatDate([startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate()].join('-'));

		if(this.globalSetting.isSingleDay){
			//如果是单天
			$('.'+ that.opts.ctnCss +' table tr td').removeClass(this.opts.singleSelectedCss);
			$('#atomuDatePicker_'+ymd).addClass(this.opts.singleSelectedCss);
		}
		else{
			//否则为7天
			$('.' + that.opts.ctnCss + ' table tr td').removeClass(this.opts.selectCss).removeClass(this.opts.firstCss).removeClass(this.opts.lastCss);
			$('#atomuDatePicker_'+ymd).addClass(this.opts.lastCss);
			$('#atomuDatePicker_'+[startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate()].join('-')).addClass(this.opts.firstCss);
			//中间的5天增加样式
			i=5;
			do{
				var tmpDate = new Date(dt.getTime() - i*24*60*60*1000);
				$('#atomuDatePicker_'+[tmpDate.getFullYear(), tmpDate.getMonth()+1, tmpDate.getDate()].join('-')).addClass(this.opts.selectCss);
				i--;
			}while(i>0);

		}
		
		// $('#atomuDatePicker_current_date').html(this.getCurrentDate(true));

		// this.opts.callback && this.opts.callback(that.getCurrentDate());
		if(this.opts.clickSubmit) {
			(function(){
				$('.'+that.opts.ctnCss).addClass('slideup');
				setTimeout(function(){
					$('.'+that.opts.ctnCss).removeClass('slideup');
					$('#atomuDatePicker_popup_wrap').removeClass('open');
					$('#atomuDatePicker_popup_ctn').hide();
					$('.atomu-mask').remove();
				},350);
			})();
			that.submit();
		}

	}



	/*
	*格式化日期，增加前导0，入值：2014-12-2, 返回值：2014-12-02
	* @param ymd 时间串 
	* @param isMonth 是否是月份的部分
	*/
	global.atomuDatePicker.prototype.formatDate = function(ymd, isMonth){
		if(isMonth){
			return ymd.replace(/(\d{4})\-(\d{1,2})/g, function(ym, y, m){
				if(m<10){
					m = '0'+m;
				}
				return y+'-'+m;
			});
		}
		return ymd.replace(/(\d{4})\-(\d{1,2})\-(\d{1,2})/g, function(ymdFormatDate, y, m, d){
	        if(m < 10){
	            m = '0' + m;
	        }
	        if(d < 10){
	            d = '0' + d;
	        }
	        return y + '-' + m + '-' + d;
	    });
			
	}


	/**
	*  获取当前日期
	* @param isShow 是否是用来展示用的
	*/
	global.atomuDatePicker.prototype.getCurrentDate = function(isShow){
		var that = this;
		var selectedDate = this.formatDate([this.year, this.month, this.date].join('-'));

		return this.globalSetting.isSingleDay ? selectedDate : function(){
			return isShow ? that.startDate+' 至 '+selectedDate  : {startDate:that.startDate, endDate:selectedDate};
		}();

	}


})(this);