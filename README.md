<h2>组件说明</h2>
　　此日期功能组件，包括日期选择器和月份选择器两类，覆盖大部分的日期选择的交互和功能，特别适合基于日期或者月份所做的配置类或数据展示类的操作，组件基于jQuery1.7.2。

<h2>文件列表</h2>
+  jquery.min.js是官方jQuery1.7.2的压缩版。
+  dateRange.js是日期选择器的主JS库。
+  dateRange.css 是日期选择器的样式列表。
+  ./images 是组件用到的图片资源。
+  sample.html 示例代码

<h2>组件列表</h2>
<h4>1、日期选择器</h4>
a、调用示例：
<pre>
	<code>
		var dateRange = new pickerDateRange('date_demo3', {
					isTodayValid : true,
					startDate : '2013-04-14',
					endDate : '2013-04-21',
					defaultText : ' 至 ',
					inputTrigger : 'input_trigger_demo3',
					theme : 'ta',
					success : function(obj) {
						//自定义的回调函数 callback();
					}
				});

	</code>
</pre>
b、接口参数说明:
<pre><code>
 var defaults = {
		aToday : 'aToday', //今天
		aYesterday : 'aYesterday', //昨天
		aRecent7Days : 'aRecent7Days', //最近7天
		aRecent14Days : 'aRecent14Days',//最近14天
		aRecent30Days : 'aRecent30Days', //最近30天
		aRecent90Days : 'aRecent90Days', //最近90天
        	startDate : '', // 开始日期
        	endDate : '', // 结束日期
        	startCompareDate : '', // 对比开始日期
        	endCompareDate : '', // 对比结束日期
	    	minValidDate : '315507600', //最小可用时间，控制日期选择器的可选力度
        	maxValidDate : '', // 最大可用时间，与stopToday 配置互斥
        	success : function(obj) {return true;}, //回调函数，选择日期之后执行何种操作
        	startDateId : 'startDate', // 开始日期输入框ID
        	startCompareDateId : 'startCompareDate', // 对比开始日期输入框ID
        	endDateId : 'endDate', // 结束日期输入框ID
        	endCompareDateId : 'endCompareDate', // 对比结束日期输入框ID
	 	target : '', // 日期选择框的目标，一般为 <form> 的ID值
        	needCompare : false, // 是否需要进行日期对比
		suffix : '', //相应控件的后缀
		inputTrigger : 'input_trigger',//页面可以出发日期panel的html元素
		compareTrigger : 'compare_trigger',//同上，这里是触发对比的
        	compareCheckboxId : 'needCompare', // 比较选择框
	        calendars : 2, // 展示的月份数，最大是2
	        dayRangeMax : 0, // 日期最大范围(以天计算)
	        monthRangeMax : 12, // 日期最大范围(以月计算)
	        dateTable : 'dateRangeDateTable', // 日期表格的CSS类
	        selectCss : 'dateRangeSelected', // 时间选择的样式
	        compareCss : 'dateRangeCompare', // 比较时间选择的样式
	        coincideCss : 'dateRangeCoincide', // 重合部分的样式
		firstCss : 'first', //起始样式
		lastCss : 'last', //结束样式
		clickCss : 'today', //点击样式
	        disableGray : 'dateRangeGray', // 非当前月的日期样式
	        isToday : 'dateRangeToday', // 今天日期的样式
	        joinLineId : 'joinLine',
	        isSingleDay : false,//单天选择设置
	        defaultText : ' 至 ', //一段时间的文字注解
	        singleCompare : false,//单天对比
	        isTodayValid : false, //今天是否可选
		weekendDis : false, //灰掉周末不可选。
		disCertainDay : [], //不可用的周日期设置数组，如：[1,3]是要周一， 周三 两天不可选，每个周的周一，周三都不可选择。
        	disCertainDate : [],//不可用的日期设置数组，如:[1,3]是要1号，3号 两天不可选，特别的，[true,1,3]则反之，只有1，3可选，其余不可选。
		shortOpr : false, //结合单天日期选择的短操作，不需要确定和取消的操作按钮。
		noCalendar : false, //日期输入框是否展示
		theme : 'gri', //日期选择器的主题，目前支持 'gri' / 'ta'
		magicSelect : false, //用户通过下来选择器，选择自定义的年和月份，配合monthRangeMax 配合使用，且必须在theme:ta , calendars:2 的情况下才会生效。
		autoCommit : false, //加载后立马自动提交
		autoSubmit : false, //没有确定，取消按钮，直接提交 
		replaceBtn : 'btn_compare'
};

</code></pre>

---------------------------------------

<h4>2、月份选择器</h4>
a、调用示例：
<pre><code>GRI.monthPicker.create('month_picker', 
				  {trigger : 'month_trigger',
				   autoCommit : true,
				   callback : function(obj){
				   		//callback
				   		}
				   }
				   );
</code></pre>
b、接口参数说明:
<pre><code>
GRI.monthPicker.create(‘id’, // input控件id，在页面显示的月份
　　{
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
                //默认选中的时间月份 字符串形如：'201302'
		defaultMonth : '', 
		//默认选中上个月
		lastMonth : false
　　	});
</code></pre>
