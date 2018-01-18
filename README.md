<h2>组件说明</h2>
　　日期选择组件，覆盖大部分的日期选择的交互和功能，特别适合基于日期操作的配置类或数据展示类PC端系统或者应用，或者手机端的有日期点选操作的H5应用。

<h2>文件列表</h2>
PC_version（适用PC端的日期选择组件）
+  jquery.min.js是官方jQuery1.7.2的压缩版。
+  dateRange.js是日期选择器的主JS库。
+  dateRange.css 是日期选择器的样式列表。
+  ./images 是组件用到的图片资源。
+  sample.html 示例页面

Mobile_version（适用Mobile端的日期选择组件）
+  css 样式文件
+  images 图片文件
+  js 组件用到的移动端dom操作类库zepto.js（必选），还有解决click事件在移动端延迟300ms的fastclick.js（可选）
+  sample.html 示例页面


<h2>PC_Version使用说明（适用PC端的日期选择组件）</h2>

### 调用示例（最简单的调用示例）： ###
	var dateRange = new pickerDateRange('date_demo3', {
					isTodayValid : true,
					startDate : '2015-11-14',
					endDate : '2015-11-21',
					success : function(obj) {
						//TODO user define callback handler;
					}
				});

### 重点参数: ###
#### startDate ####
这是日期选择器初始化时候，必须传入的开始日期的参数，与endDate成对出现，格式如:'2015-10-10'。
#### calendars ####
这是定义日期选择面板的月份选择栏位有多少个，默认是两个，即默认展示本月和上一个月的自然日选择。
#### dayRangeMax ####
控制用户最大可选天数的范围，默认是0，即不限制，假如用户设置为30，那么日期选择器的开始日期和结束日期的最大天数跨度，不得超过30天
#### isTodayValid #####
控制今日是否可选的配置项，一般如果系统中提供实时或者今天的日期相关功能，则设置为true，默认是false
#### stopToday ####
控制日期选择器的可选粒度，如果此配置项配置为true，则表示今天之后的日期将不可选择。
#### isSingleDay ####
判断此日期选择器是日期复选还是单选，默然是复选，如设置为true，则此日期选择器是单选。
#### weekendDis ####
有些业务场景是周末不可选的情况，将此配置项设置为true，就可以达到这个效果。
#### disCertainDay ####
设置一周中周期性的某几天不可选择，如设置为[1,3]，则代表每周的周一、周三不可选择。
#### disCertainDate ####
设置每个月中周期性的某几天不可选择，如设置为[5,15,25]，则代表每月的5日、15日、25日不可选择。
#### shortOpr ####
区间选择一天，需要点选两次来确定，如果希望以此点击完成选择操作，则设置为true，默认是false，【确定】【取消】不会隐藏。
#### magicSelect ####
日期选择器默认切换月份和年份，只能通过向前和向后的按钮，如果希望自定义下拉选择，则可以设置为true，
就可以通过下来选择自定义一定范围的月份和年，默认是false。
#### autoCommit ####
日期选择器默认初始化后，并不会提交callback handler的事件，有一些场景希望在业务初始化完毕后就调用，
比如某些报表系统，希望默认页面完成加载就执行查询，则可以在初始化日期选择器的时候设置为true，默认是false。
#### autoSubmit ####
隐藏【确定】【取消】按钮，并且直接执行callback handler，默认是false。
#### success ####
这个是日期选择器最重要的参数之一，绑定日期切换后的回调函数，比如执行查询操作等操作。回调参数会传递当前选择的日期实体。
###### --- 更多调用示例和参数组合，可参见sample.html --- ######
<h2>返回值说明</h2>
在回调函数中会讲选择的日期实体回传，供在回调内部访问操作

        retObj = {
            startDate:'2015-10-10',
            endDate:'2015-10-17',
            needCompare:true,
            startCompareDate:'2015-10-01',
            endCompareDate:'2015-10-08'
        }

<h2>Mobile_Version使用说明（适用Mobile端的日期选择组件）</h2>
<h3>调用示例（最简单的调用示例）:  </h3>

		new atomuDatePicker({
                    'containerId': 'date_container',
                    'triggerId' : 'date_trigger',
                    'isSingleDay' : true,
                    'stopToday' : false,
                    'clickSubmit':true, //点选立即提交
                    'defaultDate' : '2015-12-31',
                    'callback':function(dateObj){
                    	//todo callback
                    }
                });

### 重点参数:
#### containerId ####
容器id，用于放日期选择html面板的占位元素ID。
#### defaultDate ####
默认选中的日期，接受字符串，格式为“2015-12-31”。
#### stopToday ####
用于控制可选粒度，今天之后的日期是否可选，默认不可选，如需要可选，设置为false。
#### clickSubmit ####
点击即可提交，不需要【确定】【取消】按钮，设置为true。
#### stopToday ####
控制日期选择器的可选粒度，如果此配置项配置为true，则表示今天之后的日期将不可选择。
#### ctnCss、wrapCss、selectCss等 ####
组件预设了一些支持调用方自定义样式的key，来覆盖日期选择器预设的样式。
#### autoSubmit ####
日期选择器默认初始化后，并不会提交callback handler的事件，有一些场景希望在业务初始化完毕后就调用，
比如某些报表系统，希望默认页面完成加载就执行查询，则可以在初始化日期选择器的时候设置为true，默认是false。
###### --- 更多调用示例和参数组合，可参见sample.html --- ######
<h2>返回值说明</h2>
在回调函数中会讲选择的日期实体回传，供在回调内部访问操作
<pre><code>retObj = ‘2015-12-31’</code></pre>

<h2>欢迎捐赠</h2>
<img src="http://imgcache.xg.qq.com/weight/wx4johnny.jpg" alt="捐赠码"/>
