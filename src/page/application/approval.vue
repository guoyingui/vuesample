<template>
	<div class="container">
		<x-header :left-options="{preventGoBack:true}" @on-click-back="goHome">审批报工
			<div slot="right" @click="displayView">
				<img width="25px" src="../../assets/images/screen.png" alt="">
			</div>
		</x-header>
		<div class="calendar-container">
			<div class="calendar-prev" @click="clickPerv">
				<img width="20px" src="../../assets/images/arrow-left.png" alt="">
			</div>
			<div class="calendar-main">
				<!-- 滑动 @onTransitionEnd="onTransitionEnd" -->
				<week-slide ref="weekSlide" @dateClick="dateClick" :error-dates="errorDates" :regular-dates="regularDates"></week-slide>
			</div>
			<div class="calendar-prev" @click="clickNext">
				<img width="20px" src="../../assets/images/arrow-right.png" alt="">
			</div>
		</div>
		<div class="cord_main" :style="{height:fullHeight,overflow:'auto'}">
			<scroller lock-x :style="{height:fullHeight}" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200">
				<div>
				<group class="card-container" v-for="(item , index) in items" :key="item.taskId">
					<div>
						<div slot="content" class="demo-content vux-1px-t">
							<cell :title="item.taskName" is-link :border-intent="true" :arrow-direction="item.showDetails ? 'up' : 'down'" @click.native="onToggle(index,item.taskId)">
							</cell>
							<div class="weui-cell vux-tap-active weui-cell_access">
								<div class="card-content">
									<div class="left">
										<span class="title">预期工时：{{item.manHour}}</span>
									</div>
									<div class="right">
										<span class="title">实报工时：{{item.actualWorkload}}</span>
									</div>
								</div>
							</div>
							<div class="weui-cell vux-tap-active weui-cell_access">
								<div class="card-content">
									<div class="left">
										<span class="title">所属项目</span>
									</div>
									<div class="right">
										<span class="title">{{item.projectName}}</span>
									</div>
								</div>
							</div>
							<cell class="vux-content-cell" title="完成进度：" primary="content">
								<range v-model="item.completePercent" :disabled="item.approveStatus=1 || 2 ? true : false" minHTML="&nbsp;" maxHTML="&nbsp;" :step="1" :rangeBarHeight="12"></range>
								<div class="vux-schedule">{{item.completePercent}}%</div>
							</cell>
							<x-switch :title="value.userName+'<span>工时:' + value.manHour +'</span>'" v-model="value.canEdit" v-for="value in item.timeSheetDetails" :disabled="value.approveStatus=1 || 2 ? true : false" :key="value.userId" @click.native="onSwitch(value.userId,value.canEdit,value.timeSheetId,value.timeSheetDate)">
							</x-switch>
						</div>
					</div>
					<div class="slide" :class="item.showDetails ? 'animate':''">
						<div class="details">
							<!-- <p>{{item.topTaskName}}</p> -->
							<div style="padding: 5px 20px">
								<ul>
									<li v-for="task in item.superiorTasks" :key="task.taskName">{{task.taskName}}</li>
									<!-- <li>文档解析及功能</li> -->
								</ul>
							</div>
							<div class="date-info">
								<div class="date-start">
									<p>预计开始日期</p>
									<p>{{lists.planStartDate}}</p>
								</div>
								<div class="date-end">
									<p>预计结束日期</p>
									<p>{{lists.planEndDate}}</p>
								</div>
							</div>
						</div>
					</div>
				</group>
				<load-more tip="loading"></load-more>
				</div>
			</scroller>
			<!-- <v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
				
			</v-scroll> -->
			<box class="cord_box_gap">
					<x-button style="background:#AA55A8;color:#fff" @click.native="submitfrom">提交</x-button>
				</box>
		</div>
		<div v-transfer-dom>
			<popup v-model="showMenus" position="right" style="background:#fff">
				<div class="cord_showMenus" :style="{height:fullHeightRight}">
					<ul>
						<li>
							<h3 class="cord_showMenus_h3">审批状态</h3>
							<div class="box">
								<checker v-model="itemList1" type="checkbox" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
									<checker-item :value="1">待审批</checker-item>
									<checker-item :value="3">已审批</checker-item>
									<checker-item :value="2">已拒绝</checker-item>
								</checker>
							</div>
						</li>
						<li>
							<h3 class="cord_showMenus_h3">报工日期</h3>
							<div class="box datetime_box">
								<checker v-model="itemList2" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
									<checker-item :value="0" style="width:30%">本周</checker-item>
									<checker-item :value="-1" style="width:30%">上周</checker-item>
								</checker>
							</div>
						</li>
						<li>
							<h3 class="cord_showMenus_h3">归属项目</h3>
							<div class="box project_box">
								<checker v-model="itemList3" type="checkbox" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
									<checker-item :value="i.projectId" v-for="i in projects" :key="i.projectId" @click.native="clickProject(i.projectId)">{{i.projectName}}</checker-item>
								</checker>
							</div>
							<div>{{itemList3}}</div>
						</li>
						<li>
							<h3 class="cord_showMenus_h3">选择人员</h3>
							<div class="box username_box">
								<checker v-model="itemList4" type="checkbox" style="flex-wrap: wrap;" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
									<checker-item :value="i.userId" v-for="i in users" :key="i.userId">{{i.userName}}</checker-item>
								</checker>
							</div>
							<div>{{itemList4}}</div>
						</li>
					</ul>
				</div>
				<footer class="cord_footer">
					<button class="cord_reset" @click="reset">重置</button>
					<button class="cord_confirm" @click="confirm">确定</button>
				</footer>
			</popup>
		</div>
		<div v-transfer-dom>
			<confirm v-model="switchStatus" show-input title="请输入拒绝意见" :input-attrs="{type: 'text'}" @on-cancel="onCancel" @on-confirm="onConfirm" @on-show="onShow" @on-hide="onHide">
			</confirm>
		</div>
		<div v-transfer-dom>
			<confirm v-model="confirmStatus" title="提交" @on-cancel="submitCancel" @on-confirm="submitConfirm" @on-show="onShow" @on-hide="onHide">
				<p style="text-align:center;">是否确定提交?</p>
			</confirm>
		</div>
	</div>
</template>

<script>
	import {
		Box,
		Cell,
		Popup,
		Group,
		Range,
		XSwitch,
		Confirm,
		Checker,
		Datetime,
		XHeader,
		XButton,
		Flexbox,
		Swipeout,
		FlexboxItem,
		CheckerItem,
		Actionsheet,
		SwipeoutItem,
		TransferDom,
		InlineCalendar,
		SwipeoutButton,
		Scroller,
		LoadMore
	} from "vux";
	import moment from "moment";
	import weekSlide from "../../components/weekSlide/weekSlide";
	import Scroll from "../../components/refresh/refresh"
	import {
		parse
	} from "semver";
	import {
		setTimeout
	} from 'timers';
	export default {
		directives: {
			TransferDom
		},
		components: {
			Box,
			Cell,
			Popup,
			Group,
			Range,
			Scroll,
			XSwitch,
			Confirm,
			XHeader,
			XButton,
			Flexbox,
			Datetime,
			Checker,
			Swipeout,
			weekSlide,
			CheckerItem,
			FlexboxItem,
			Actionsheet,
			SwipeoutItem,
			InlineCalendar,
			SwipeoutButton,
			Scroller,
			LoadMore
			// 'v-scroll': Scroll
		},
		data() {
			return {
				fullHeightL: "",
				userId: "",
				items: [],
				users: [],
				lists: [],
				projects: [],
				Configuration: [],
				errorDates: {},
				regularDates: {},
				sidesHide: 'none',
				switchStatus: false,
				confirmStatus: false,
				showMenus: false,
				value1: true,
				itemList1: '',
				itemList2: '',
				itemList3: '',
				itemList4: '',
				visibility: false,
				timeSheetId: '',
				timeSheetDate: '',
				startTime: '',
				endTime: '',
				perv: -1,
				next: 1,
				counter: 5, //默认已经显示出15条数据 count等于一是让从16条开始加载
				num: 3, // 一次显示多少条
				pageStart: 0, // 开始页数
				pageEnd: 0, // 结束页数
				listdata: [], // 下拉更新数据存放数组
				downdata: [], // 上拉更多的数据存放数组
				onFetching: false,
				bottomCount: 5
			};
		},
		mounted: function() {
			this.getList();
			this.$nextTick(() => {
				this.$refs.scrollerEvent.reset({top: 0})
			})
			this.$nextTick(() => {
				this.$refs.scrollerBottom.reset({top: 0})
			})
		},
		methods: {
			onScrollBottom () {
				if (this.onFetching) {
				console.log('object');
					// do nothing
				} else {
					this.onFetching = true
					setTimeout(() => {
						this.bottomCount += 1
						this.$nextTick(() => {
							this.$refs.scrollerBottom.reset()
						})
						this.onFetching = false
					}, 2000)
				}
			},
			// 搜索重置
			reset() {
				this.itemList1 = '',
				this.itemList2 = '';
				this.itemList3 = '';
				this.itemList4 = '';
			},
			// 搜索确定
			confirm() {
				this.$http.post("/getAuditTimeSheet.jsp", {
					approveStates: this.itemList1,
					weekType: this.itemList2,
					projectIds: this.itemList3,
					userIds: this.itemList4
				}).then(({
					data
				}) => {
					this.items = data.tasks;
					this.showMenus = false;
				})
			},
			// 弹框意见取消
			onCancel() {
				this.items.map((item, index) => {
					if (item.timeSheetDetails) {
						item.timeSheetDetails.map((list, index) => {
							if (list.userId == this.userId) {
								list.canEdit = true
							}
						})
					}
				})
			},
			// 弹框意见确定
			onConfirm(msg) {
				if (msg) {
					this.$http.post('/tmpSaveTimeSheetApproval.jsp', {
						timeSheetId: this.timeSheetId,
						timeSheetDate: this.timeSheetDate,
						tmpApprovalState: 3,
						tmpApprovalDesc: msg
					}).then(({
						data
					}) => {})
				}
			},
			onHide() {
				console.log('on hide')
			},
			onShow() {
				console.log('on show')
			},
			goHome() {
				this.$router.push({
					path: "/"
				});
			},
			submitfrom() {
				this.confirmStatus = true
			},
			submitCancel() {
				console.log('on hide')
			},
			submitConfirm() {
				this.items.map((item, index) => {
					item.timeSheetDetails.map((val, index) => {
						if (val.canEdit) {
							val.approvalState = 3
						} else {
							val.approvalState = 2
						}
					})
				})
				this.$http.post('/saveTimeSheetApproval.jsp', {
					tasks: JSON.stringify(this.items)
				}).then(({
					data
				}) => {
					this.$vux.toast.text("提交成功", "content");
					this.gettastlist(null, this.startTime, 0, 1);
				})
				this.$vux.toast.text("提交成功", "content");
			},
			onToggle(index, taskId) {
				if (!this.items[index].superiorTasks) {
					this.$http.get("/getTaskDetailData.jsp", {
						params: {
							taskId: taskId
						}
					}).then(({
						data
					}) => {
						this.items[index].superiorTasks = data.superiorTasks;
						this.lists = data;
						this.items[index].showDetails = !this.items[index].showDetails;
					})
				}
			},
			// 按钮切换
			onSwitch(id, status, timeSheetId, timeSheetDate) {
				this.userId = id;
				this.timeSheetId = timeSheetId;
				this.timeSheetDate = timeSheetDate;
				if (status) {
					this.switchStatus = true;
				} else {
					this.$http.post('/tmpSaveTimeSheetApproval.jsp', {
						timeSheetId: this.timeSheetId,
						timeSheetDate: this.timeSheetDate,
						tmpApprovalState: 3,
						tmpApprovalDesc: ""
					}).then(({
						data
					}) => {})
				}
			},
			displayView() {
				this.$http.get('../../../static/json/getCanAuditProjects.json').then(({
					data
				}) => {
					this.projects = data.projects
					this.showMenus = true
				})
				this.$http.get('../../../static/json/getUsersByProjectId.json').then(({
					data
				}) => {
					this.users = data.users
				})
			},
			onButtonClick(type) {
				alert("on button click " + type);
			},
			handleEvents(type) {
				console.log("event: ", type);
			},
			onTransitionEnd(dates) {
				console.log(dates);
			},
			clickProject(i) {
				setTimeout(() => {
					this.$http.get('/getUsersByProjectId.jsp', {
						params: {
							projectIds: this.itemList3.join(',')
						}
					}).then(({
						data
					}) => {
						this.users = data.users
					})
				}, 200)
			},
			clickNext() {
				this.getWeekData(this.startTime, 1);
				this.gettastList(null, this.startTime, this.next, 1);
				this.$refs.weekSlide.activeIndex = 2;
				for (var i = 0; i < this.$refs.weekSlide.$refs.sliders.children.length; i++) {
					this.$refs.weekSlide.onTransitionEnd(i);
				}
			},
			clickPerv() {
				this.getWeekData(this.startTime, -1);
				this.gettastList(null, this.startTime, this.perv, 1);
				this.$refs.weekSlide.activeIndex = 0;
				for (var i = 0; i < this.$refs.weekSlide.$refs.sliders.children.length; i++) {
					this.$refs.weekSlide.onTransitionEnd(i);
				}
			},
			dateClick(date, state) {
				if (state) {
					this.gettastList(date, null, null, 1);
				} else {
					this.gettastList(date, week, type, 1);
				}
			},
			getWeekData(e, type) {
				this.$http.get("/getAuditListOfWeek.jsp", {
					params: {
						currDisplayMonday: e,
						type: type
					}
				}).then(({
					data
				}) => {
					this.startTime = data.days[0].date;
					this.endTime = data.days[6].date;
					data.days.map((item, index) => {
						if (item.normal === "0") {
							this.$set(this.errorDates, item.date, true);
							this.$set(this.regularDates, item.date, false);
						} else {
							this.$set(this.regularDates, item.date, true);
							this.$set(this.errorDates, item.date, false);
						}
					});
				});
			},
			// date 当前时间   week: 当前周一日期  type：周几  arr：待审批
			gettastList(date, week, type, arr) {
				this.$http.get("/getAuditTimeSheet.jsp", {
					params: {
						dateStr: date,
						currDisplayMonday: week,
						type: type,
						approveStates: arr
					}
				}).then(({
					data
				}) => {
					data.tasks.map((item) => {
						item.showDetails = false;
					})
					this.items = data.tasks;
				});
			},
			getList() {
				let vm = this;
				vm.$http.get('https://api.github.com/repos/typecho-fans/plugins/contents/').then((response) => {
					vm.listdata = response.data.slice(0, 15);
				}, (response) => {
					console.log('error');
				});
			},
			onRefresh(done) {
				this.getList();
				done() // call done
			},
			onInfinite(done) {
				let vm = this;
				vm.$http.get('"../../../static/json/list.json').then((response) => {
					vm.counter++;
					vm.pageEnd = vm.num * vm.counter;
					vm.pageStart = vm.pageEnd - vm.num;
					let arr = response.list;
					let i = vm.pageStart;
					let end = vm.pageEnd;
					for (i ; i < end; i++) {
						let obj = {};
						obj["name"] = arr[i].name;
						vm.downdata.push(obj);
						if ((i + 1) >= response.data.length) {
							this.$el.querySelector('.load-more').style.display = 'none';
							return;
						}
					}
					done() // call done
				}, (response) => {
					console.log('444444');
				});
			}
		},
		created() {
			this.fullHeight = document.documentElement.clientHeight - 170 + "px";
			this.fullHeightRight = document.documentElement.clientHeight - 50 + "px";
			this.$http.get("../../../static/json/getAuditListOfWeek.json", {
				params: {
					weekType: 0,
					approveStatus: 1
				}
			}).then(({
				data
			}) => {
				this.startTime = data.days[0].date;
				this.endTime = data.days[6].date;
				data.days.map((item, index) => {
					if (item.normal === 0) {
						this.$set(this.errorDates, item.date, true);
						this.$set(this.regularDates, item.date, false);
					} else {
						this.$set(this.regularDates, item.date, true);
						this.$set(this.errorDates, item.date, false);
					}
				});
			});
			// this.$http.get("/getAuditTimeSheet.jsp", { params: { weekType: 0, approveStatus: 1 } }).then(({ data }) => {
			this.$http.get("../../../static/json/list.json", {
				params: {
					weekType: 0,
					approveStatus: 1
				}
			}).then(({
				data
			}) => {
				data.list.map((item) => {
					item.showDetails = false;
				})
				this.items = data.list;
			});
		},
	};
</script>

<style lang="less" scoped>
	.cord_main{
		.yo-scroll{
			top: 8.5rem;
			bottom: 5rem;
		}
	}
	.cord_footer {
		bottom: 0;
		width: 100%;
		height: 45px;
		line-height: 45px;
		display: flex;
		position: absolute;
		.cord_reset {
			width: 50%;
			height: 45px;
			border: none;
			font-size: 17px;
			color: #fff;
			background: #cccccc;
		}
		.cord_confirm {
			width: 50%;
			height: 45px;
			border: none;
			font-size: 17px;
			color: #fff;
			background: #1d9ad5;
		}
	}
	.cord_showMenus {
		width: 260px;
		overflow: auto;
		.cord_showMenus_h3 {
			height: 40px;
			line-height: 40px;
			padding-left: 10px;
			background: #f2f2f2;
		}
		.project_box>.vux-checker-box,
		.username_box>.vux-checker-box {
			flex-wrap: wrap;
			justify-content: flex-start;
			.vux-checker-item {
				margin: 5px 4px;
			}
		}
		.vux-checker-box {
			margin: 10px;
			display: flex;
			justify-content: space-around;
			.vux-checker-item {
				width: 25%;
				margin: 5px 0;
				padding: 5px;
				text-align: center;
				border-radius: 5px;
				font-size: 14px;
				border: 1px solid #cccccc;
			}
			.demo1-item-selected {
				color: #55a8fe;
				border: 1px solid #55a8fe;
			}
		}
	}
	.container /deep/ .cord_box_gap {
		position: fixed;
		bottom: 0;
		width: 95%;
		padding: 10px;
		background: #fff;
	}
	.container .sidebar {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		background-color: #f2f2f2;
		opacity: 0.7;
		.sidebar-box {
			width: 70%;
			background: #f2f2f2;
			height: 100%;
			position: absolute;
			right: 0;
		}
	}
	.calendar-container {
		height: 60px;
		background: #fff;
		.calendar-prev,
		.calendar-next {
			float: left;
			width: 10%;
			height: 40px;
			line-height: 50px;
			padding: 10px 0;
			text-align: center;
		}
		.calendar-main {
			float: left;
			width: 80%;
			.weui-grid__label {
				font-size: 12px;
			}
			.weui-grid {
				padding: 0 !important;
			}
			.weui-grids:after {
				border-left: 0 !important;
			}
			.weui-grid:before {
				border-right: 0 !important;
			}
			.weui-grids:before {
				border-top: 0 !important;
			}
			.weui-grid:after {
				border-bottom: 0 !important;
			}
			.calendar-wrapper {
				position: relative;
				overflow: hidden;
				height: 28px;
			}
		}
	}
	.card-container /deep/ .vux-no-group-title {
		font-size: 15px !important;
		margin: 10px 10px 0;
		border-radius: 8px;
		.range-bar {
			.range-handle {
				width: 20px;
				height: 20px;
				top: -5px !important;
				background-color: #55a8fe;
			}
			.range-quantity {
				// background-color: #55a8fe !important;
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}
		}
		.weui-switch[disabled] {
			opacity: 0.3;
		}
		.weui-cell {
			height: 46px;
			padding: 0 18px;
		}
		.weui-cell:before {
			right: 15px;
		}
		.vux-content-cell>.vux-cell-primary {
			position: relative;
			left: -20px;
			.vux-schedule {
				position: absolute;
				top: -3px;
				right: -16px;
			}
			.vux-range-input-box {
				margin-left: 30px !important;
			}
		}
		.weui-cell__bd>.weui-label>span {
			position: absolute;
			left: 43%;
		}
	}
	.card-container /deep/ .vux-no-group-title::before,
	.card-container /deep/ .vux-no-group-title::after {
		border: none;
	}
	.card-container /deep/ .weui-cell_access::before {
		right: 15px;
	}
	.work_group /deep/ .weui-cell .weui-cell__ft {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		width: 65%;
		margin-right: 5%;
		font-size: 14px !important;
		color: inherit;
	}
	.card-container {
		.card-content {
			display: flex;
			justify-content: space-between;
			align-content: center;
			width: 100%;
			input[type="checkbox"] {
				width: 23px;
				height: 23px;
			}
			.right,
			.left {
				display: flex; //   align-content: center;
				align-items: center;
				line-height: 20px;
			}
			.left {
				flex: 0.95;
			}
			.cord_input {
				width: 50px;
				text-align: center;
				border: 1px dotted #ccc;
				line-height: 30px;
				height: 30px;
			}
		}
		& /deep/ .range-quantity {
			background-color: #55a8fe;
		}
	}
	.slide {
		padding: 0 20px;
		overflow: hidden;
		max-height: 0;
		transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
		.details {
			border: 1px solid #eee;
			border-radius: 8px;
			padding: 5px;
			margin-bottom: 10px;
			ul {
				list-style: none;
			}
		}
		.date-info {
			display: flex;
			justify-content: space-between;
			font-size: 12px;
			color: #bbb;
			padding: 5px 20px;
			text-align: center;
			.date-start,
			.date-end {
				display: flex;
				flex-direction: column;
			}
		}
	}
	.animate {
		max-height: 9999px;
		transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
		transition-delay: 0s;
	}
</style>

