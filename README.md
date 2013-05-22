<h2>组件说明</h2>
　　此日期功能组件，包括日期选择器和月份选择器两类，覆盖大部分的日期选择的交互和功能，特别适合基于日期或者月份所做的配置类或数据展示类的操作，组件基于jQuery1.7.2。

<h2>文件列表</h2>
+  jquery.min.js是官方jQuery1.7.2的压缩版。
+  gri.monthPicker.js是月份选择器的主JS库，其中包含各个组件源码，和工具支持库函数。
+  gri.controls.css 是月份选择器的样式列表。
+  Images/.. 是用到的图片，供其他系统离线使用。

<h2>组件列表</h2>
<h4>1、月份选择器</h4>
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
　　		returnDate : false
　　	});
</code></pre>
