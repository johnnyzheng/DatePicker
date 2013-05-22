/**
 * ========================================
 * 月份选择器
 * @author johnnyzheng(johnnyzheng@tencent.com)
 * @version 2013-03-27
 * @modification 第一次抽取到框架中的月份选择器
 *  2013-05-03 解决bug:IE9下向前向后重复出发
 * ========================================
 */

/**
 * @description GRI 全局对象，负责前端的交互组织
 * @namespace 全局的命名空间
 */
GRI = window.GRI || {};
GRI.monthPicker = {
	_conf : {
		//月份选择器的开始年
		startYear : 1970,
		//默认是今年
		endYear : new Date().getFullYear(),
		//月份选择器的选择面板的月份排布的列数
		cols : 4,
		//月份选择器的选择面板的月份排布的行数
		rows : 3,
		//容器ID
		container : 'gri_monthPicker_wrapper',
		//选择框的id
		calendar : 'gri_monthPicker_panel',
		//日期框体 id
		dataTable : 'gri_monthPicker_table',
		// 日期表格的CSS类
		containerCss : 'ta_calendar cf',
		// 时间选择的样式
		selectCss : 'current',
		//内容样式
		contentCss : 'ta_calendar_cont cf',
		//表格样式
		tableCss : 'calendar-month',
		//不可选样式
		disabledCss : 'ta_dateRangeGray',
		//输入控件
		input : {},
		//ID
		id : 'month_picker',
		//trigger 额外触发器
		trigger : 'month_trigger',
		//回调函数
		callback : function(obj){return true},
		//是否加载即回调
		autoCommit : false,
		//返回的是月份，还是日期，默认是月份
		returnDate : false,
		//默认选中的时间月份
		defaultMonth : '',
		//默认选中上个月
		lastMonth : false
	},

	//最终的返回值，初始值是当前年月
	assemble : {
		'year' : new Date().getFullYear(),
		'month' :new Date().getMonth() + 1
	},

	/**
	* @description 外部调用接口
	* @param {String} id, element id
	* @param {Object} 外源配置
	*/
	create : function(id, conf){
		var that = this;
		that._conf.id = id ;
		that._conf = $.extend(true, that._conf, conf);
		$('#' + id).length > 0 && function(){
			$('#'+id).bind('click', function(){
				that.show(that.util.$(id));
			});
		}();
		$('#' + that._conf.trigger).length > 0 && function(){
			$('#'+that._conf.trigger).bind('click', function(){
				that.show(that.util.$(id));
			});
		}();
		//默认填充最近一个月, 如果设置了默认选中上一个月，则选中上一个月， 如果默认设置了月份，则显示。后者覆盖前者
		this._conf.lastMonth && (this.assemble.month = new Date().getMonth()); 
		''!==this._conf.defaultMonth && (this.assemble = {'year':this._conf.defaultMonth.substr(0,4), 'month':this._conf.defaultMonth.substr(4)*1});
		var def = this.util.format(this.assemble);
		$('#'+id).html(def.year + '-' + def.month);
		that._conf.autoCommit && that._conf.callback(that.convertToDate(this.util.format(this.assemble)));
		 //让用户点击页面即可关闭弹窗
	    $(document).bind('click', function (evt) {
	       that.cancel(evt);
	    });
	},
	
	/**
	 * @description 获得当前选择器的日期
	 * @return {Object} 年 月 对象
	 */
	getCurrentShowDate : function(){
		var that = this, str = '';
		if($('#' + that._conf.id).length > 0){
			str = $('#' + that._conf.id).html();
			return {'year' : str.split('-')[0], 'month' : str.split('-')[1]};
		}
	},
	
	/**
	 * @description 月份转换为日期
	 * @param {Object} 月份对象
	 * @return {Object} 开始结束时间对象
	 */
	convertToDate : function(obj){
		if(this._conf.returnDate){
			return {
					'start_date' : obj.year + '-' + obj.month + '-01', 
					'end_date' : obj.year + '-' + obj.month + '-31'
					};
		}
		else{
			return obj.year + '-' + obj.month;		
		}
	},
	
	//展示框体
	show : function(ref) {
		this._conf.input = ref;
		//如果已经存在div，则不重复创建
		if(this.util.$(this._conf.container)) {
			var pos = $('#' + this._conf.id).offset();
			var offsetHeight = $('#' + this._conf.id).attr('offsetHeight');
			this.util.$(this._conf.container).style.display = 'block';
			//调整位置
			this.util.$(this._conf.container).style.top = pos.top + (offsetHeight ? offsetHeight -1 : 32)+ 'px';
			this.util.$(this._conf.container).style.left = pos.left + 'px';
			return false;
		}
		//创建面板
		var div = this.util.creatEle('div');
		div.setAttribute('id', this._conf.container);
		$(div).addClass(this._conf.containerCss);
		div.style.zIndex = '9999';
		//调整位置
		var pos = $('#' + this._conf.id).offset();
		var offsetHeight = $('#' + this._conf.id).attr('offsetHeight');
		div.style.top = pos.top + (offsetHeight ? offsetHeight -1 : 32)+ 'px';
		div.style.left = pos.left + 'px';
		document.body.appendChild(div);
		var contentDiv = this.util.creatEle('div');
		contentDiv.id = this._conf.calendar;
		$(contentDiv).addClass(this._conf.contentCss);
		var ctrl = [];
		ctrl.push('<i class="i_pre" id="gri_preYear"></i>');
		ctrl.push('<i class="i_next" id="gri_nextYear"></i>');
		$(contentDiv).append(ctrl.join(''));
		div.appendChild(contentDiv);
		div.style.display = 'block';
		this.init();
	},
	//初始化
	init : function() {
		var that = this;
		//点击输入框的时候，初始化的月份选择器的面板
		var ctrl = panel = [];
		var table = this.util.creatEle('table');
		$(table).addClass(this._conf.tableCss);
		var cap = document.createElement('caption');
		var sp = document.createElement('span');
		sp.id = 'gri_year';
		$(sp).append(this._conf.endYear + '年');
		$(cap).append(sp);
		$(table).append(cap);
		
		var tbody = this.util.creatEle('tbody');
		var tr = this.util.creatEle('tr');
		var td = this.util.creatEle('td');
		tbody.setAttribute('id', this._conf.dataTable);
		table.appendChild(tbody);

		this._conf.calendar ? this.util.$(this._conf.calendar).appendChild(table) : document.body.appendChild(table);

		//构造月份等面板
		this.construct();

		//增加确定 和 取消按钮
		ctrl = [];

		//为上一年增加点击事件
		// this.util.addEvt(this.util.$('gri_preYear'), 'click', function(evt, target) {
			// that.preYear(that.reset);
		// });
		$('#gri_preYear').click(function(){
			that.preYear(that.reset);
		});
		$('#gri_nextYear').click(function(){
			that.nextYear(that.reset);
		});
		//为下一年增加点击事件
		// this.util.addEvt(this.util.$('gri_nextYear'), 'click', function(evt, target) {
			// that.nextYear(that.reset);
		// });
		this.reset(this);
		return table;

	},
	//构造月份
	construct : function() {
		that = this;
		$('#'+this._conf.dataTable).html('');
		//months 容器，预留后面扩展的参数接口
		var months = {
			data : {
				1 : [1, 2, 3, 4],
				2 : [5, 6, 7, 8],
				3 : [9, 10, 11, 12]
			},
			typical : {
				1:'一', 2: '二' , 3:'三', 4:'四', 5:'五', 6:'六', 7:'七', 8:'八', 9:'九', 10:'十', 11:'十一', 12:'十二'
			},
			special : {}
		};
		//遍历月份接口
		for(var p in months.data) {
			var tr = this.util.creatEle('tr');
			for(var i = 0; i < months.data[p].length; i++) {
				var td = this.util.creatEle('td');
				td.innerHTML = months.typical[months.data[p][i]] + '月';
				td.setAttribute('id', 'gri_month' + months.data[p][i]);
				//判断是否超过今年
				if(this.assemble.year == this.util.getCurrentDate().year &&  months.data[p][i] > this.util.getCurrentDate().month){
					$(td).addClass(this._conf.disabledCss);
				}
				else{
					window.addEventListener && td.addEventListener('click', this.addCss, false) || window.attachEvent && td.attachEvent('onclick', this.addCss);
				}
				tr.appendChild(td);
			}
			//this.util.$(this._conf.dataTable).appendChild(tr);
			$('#'+this._conf.dataTable).append(tr);
		}

	},
	//上一年
	preYear : function(fn) {
		this.assemble.year = this.assemble.year*1 - 1;
		this.util.$('gri_year').innerHTML = this.assemble.year + '年';
		fn && fn(this);
	},
	//下一年
	nextYear : function(fn) {
		this.assemble.year = this.assemble.year*1 + 1;
		this.util.$('gri_year').innerHTML = this.assemble.year + '年';
		fn && fn(this);
	},
	//增加样式
	addCss : function(evt) {
		that.removeCss();
		var evt = window.event || evt, target = evt.srcElement || evt.target;
		//target.setAttribute(that.util.getCla(), that._conf.selectCss);
		$(target).addClass(that._conf.selectCss);
		//赋值
		that.assemble.month = (/^gri_month(\d+)/).test(target.getAttribute('id')) && (/^gri_month(\d+)/).exec(target.getAttribute('id'))[1];
		//提交
		that.submit();

	},
	//去除样式
	removeCss : function() {
		//正则模糊匹配
		var reg = /^gri_month(\d+)/;
		var cells = $('#gri_monthPicker_table').find('td');
		for(var o in cells) {
			if(cells[o].id && reg.test(cells[o].id)) {
				// cells[o].removeAttribute(this.util.getCla());
				$(cells[o]).removeClass(this._conf.selectCsss).removeClass(this._conf.disabledCss);
				if(this.assemble.year == this.util.getCurrentDate().year && cells[o].id.match(reg)[1] > this.util.getCurrentDate().month){
					$(cells[o]).addClass(this._conf.disabledCss);
				}
			}
		}
	},
	//取消
	cancel : function(evt) {
		var evt = window.event || evt, target = evt.srcElement || evt.target;
		!(target.id && (target.id == this._conf.id || target.id == this._conf.trigger) || target.className && (target.className == 'i_pre'|| target.className == 'i_next')) && $('#'+this._conf.container).length > 0 && $('#'+this._conf.container).hide();
	},
	//确定
	submit : function() {
		var result = [];
		fd = this.util.format(this.assemble);
		for(var p in fd) {
			result.push(fd[p]);
		}
		this.util.$(this._conf.container).style.display = 'none';
		//赋回原值
		this._conf.input.innerHTML = result.join('-');
		
		this._conf.callback(this.convertToDate(this.util.format(this.assemble)));

	},
	//reset 样式
	reset : function(obj) {
		//obj.removeCss();
		obj.construct();
		obj.util.$('gri_nextYear').style.display = (obj.assemble.year >= obj._conf.endYear ) ? 'none' : 'block';
		obj.util.$('gri_preYear').style.display = (obj.assemble.year <= obj._conf.startYear ) ? 'none' : 'block';

		//如果是当前年月，增加样式
		var c = obj.getCurrentShowDate();
		if(obj.util.format(obj.assemble).year == c.year && obj.util.format(obj.assemble).month == c.month ) {
			$('#gri_month' + obj.assemble.month).addClass(obj._conf.selectCss);
		}
	},
	//工具函数库
	util : {
		//取页面元素的的工具方法
		$ : function(id) {
			return document.getElementById(id);
		},
		//创建元素
		creatEle : function(ele) {
			return document.createElement(ele);
		},
		//增加事件
		addEvt : function(elem, type, hdl) {
			var callback = function(evt) {
				var evt = window.event || evt, target = evt.srcElement || evt.target;
				hdl(evt, target);
			};
			window.addEventListener && elem.addEventListener(type, callback, false) || window.attachEvent && elem.attachEvent('on' + type, callback);
		},
		//获得当前月份
		getCurrentDate : function() {
			return {
				'year' : new Date().getFullYear(),
				'month' : new Date().getMonth() + 1
			};
		},
		
		getCla: function(){
			return !!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1)?'class':'class';
		},
		
		//格式化，增加前导零
		format : function(obj) {
			return {
				'year' : obj.year,
				'month' : (obj.month < 10 ? '0' : '') + obj.month
			};
		}
	}
};
