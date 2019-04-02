<template>
    <div class="container">
        <x-header :left-options="{preventGoBack:true}" @on-click-back="goHome">报工
            <div slot="right" @click="displayView">
                <img width="25px" src="../../assets/images/remind.png" alt="">
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
        <group class="work_group" title="">
            <cell title="归属项目" :value="value" @click.native="projectClick"></cell>
            <img width="20px" style="position: absolute;top:11px;right:5px" src="../../assets/images/arrow-right.png" alt="">
        </group>
        <!-- 卡片 -->
        <div class="cord_main" :style="{height:fullHeight,overflow:'auto'}">
            <group class="card-container" v-for="(item, index) in items" :key="item.taskId">
                <div>
                    <div slot="content" class="demo-content vux-1px-t">
                        <cell :title="item.topTaskName" is-link :border-intent="true" :arrow-direction="item.showDetails ? 'up' : 'down'" @click.native="onToggle(index)"></cell>
                        <div class="weui-cell vux-tap-active weui-cell_access">
                            <div class="card-content">
                                <div class="left">
                                    <!-- <checklist :title="33" :label-position="labelPosition" required :options="commonList" v-model="checklist001" @on-change="change"></checklist> -->
                                    <input type="checkbox" :disabled="item.disabledStart" v-model="submitData[item.taskId]" @click="onclick_list(item.taskId,item.manHour)" />&nbsp;&nbsp;
                                    <span class="title">{{item.taskName}}</span>
                                </div>
                                <div class="right">
                                    <span class="title">工时：</span><input :class="{cord_input:true,dark_green:item.refuse,red:item.adopt}" :disabled="item.disabledStart" placeholder="请输入" v-model="item.manHour" @input="handleInput(item, index)" @keyup.13="change_list(item.taskId,item.manHour,$event)"
                                        type="text" />
                                </div>
                            </div>
                        </div>
                        <div style="margin:0 15px;border-top:1px solid #f1f1f1">
                            <div style="margin-left: -50px; padding-right: 20px; position: relative;">
                                <div style="height: 20px;padding: 16px 0px 10px">
                                    <range v-model="item.completePercent" :disabled="item.disabledStart" minHTML="&nbsp;" maxHTML="&nbsp;" :range-bar-height="12" @on-touchstart="slide_bar(item)"></range>
                                </div>
                                <div style="position: absolute; right: 10px; top: 13px;">{{item.completePercent}}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="slide" :class="item.showDetails?'animate':''">
                    <div class="details">
                        <p>{{item.topTaskName}}</p>
                        <div style="padding: 5px 20px">
                            <ul>
                                <li v-for="task in item.superiorTask" :key="task.taskName">{{task.taskName}}</li>
                                <!-- <li>文档解析及功能</li> -->
                            </ul>
                        </div>
                        <div class="date-info">
                            <div class="date-start">
                                <p>预计开始日期</p>
                                <p>{{item.planStartDate}}</p>
                            </div>
                            <div class="date-end">
                                <p>预计结束日期</p>
                                <p>{{item.planEndDate}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="details" :style="{display:item.viewHide ? 'block' : 'none'}">
                        <p>拒绝意见：</p>
                        <div style="padding: 5px 20px">
                            <ul style="list-style: none">
                                <li v-for="arr in rejectDesc" :key="arr">{{arr}}</li>
                                <!-- <li>
                                        <span>1111：</span>
                                        <span>阶段奶粉的女司机打算明年房价等你尽快</span><br>
                                        <span>2018-11-2</span>
                                    </li>
                                    <li>
                                        <span>1111：</span>
                                        <span>反反复复付对方是否水电费第三方是</span><br>
                                        <span>2018-11-2</span>
                                    </li>
                                    <li>
                                        <span>1111：</span>
                                        <span>考试的客服那肯定是你可能付款的说法洛克时代付款了都是逆风 </span><br>
                                        <span>2018-11-2</span>
                                    </li> -->
                            </ul>
                        </div>
                    </div>
                </div>
            </group>
        </div>
        <!-- 报工概览 -->
        <div class="overview-Container" :style="{display: showView}">
            <div class="mask" @click="hideView"></div>
            <div class="content">
                <cell title="上周工时" :border-intent="false">
                    <div class="cell-contant">
                        <div class="cell-one">
                            <span class="purple">{{datalist.mustWorkHoursOfWeek}}</span>
                            <span>应报</span>
                        </div>
                        <div class="cell-one">
                            <span class="bule">{{datalist.reportedWorkHoursOfWeek}}</span>
                            <span>已报</span>
                        </div>
                        <div class="cell-one">
                            <span class="red">{{datalist.missingWorkHoursOfWeek}}</span>
                            <span>未报</span>
                        </div>
                    </div>
                </cell>
                <cell title="当天工时" :border-intent="false">
                    <div class="cell-contant">
                        <div class="cell-one">
                            <span class="purple">{{datalist.mustWorkHoursOfDay}}</span>
                            <span>应报</span>
                        </div>
                        <div class="cell-one">
                            <span class="bule">{{datalist.reportedWorkHoursOfDay}}</span>
                            <span>已报</span>
                        </div>
                        <div class="cell-one">
                            <span class="red">{{datalist.missingWorkHoursOfDay}}</span>
                            <span>未报</span>
                        </div>
                    </div>
                </cell>
            </div>
        </div>
        <box class="cord_buttom">
            <x-button type="primary" :style="{background:canSubmit ? '#a9acb1' : '#AA55A8'}" @click.native="submit">提交</x-button>
        </box>
        <div v-transfer-dom>
            <confirm v-model="show" :title="Toggle" @on-cancel="onCancel" @on-confirm="onConfirm" @on-show="onShow" @on-hide="onHide">
                <p style="text-align:center;">是否确定提交?</p>
            </confirm>
        </div>
        <div class="projectlist" :style="{display: state}">
            <x-header title="归属项目" :left-options="{preventGoBack:true}" @on-click-back="goworker"></x-header>
            <group>
                <ul>
                    <li class="li1" v-for="item in itemless" :key="item.taskId" @click="addList(item)">
                        {{item.projectName}}
                    </li>
                </ul>
            </group>
        </div>
    </div>
</template>

<script type="text/javascript">
    import {
        XHeader,
        InlineCalendar,
        Group,
        Cell,
        Range,
        XButton,
        Box,
        Confirm,
        XSwitch,
        TransferDom,
        XInput,
        Loading,
        Divider,
        Swipeout,
        Checklist,
        SwipeoutItem,
        SwipeoutButton
    } from "vux";
    import moment from "moment";
    import weekSlide from "../../components/weekSlide/todaySlide";
    import {
        parse
    } from "semver";
    import {
        setTimeout,
        clearTimeout
    } from 'timers';
    let date = moment().format("YYYY-MM-DD");
    export default {
        directives: {
            TransferDom
        },
        components: {
            XHeader,
            InlineCalendar,
            weekSlide,
            Group,
            Cell,
            Range,
            XButton,
            Box,
            Confirm,
            XSwitch,
            XInput,
            Loading,
            Divider,
            Swipeout,
            Checklist,
            SwipeoutItem,
            SwipeoutButton
        },
        data() {
            return {
                datalist: {},
                items: [],
                itemless: {},
                errorDates: {},
                regularDates: {},
                showView: "none",
                show: false,
                state: "none",
                readonly: false,
                iconType: "",
                value: "",
                fullHeight: "",
                Toggle: "提交",
                projectId: "",
                show1: true,
                text1: "Loading",
                // viewHide: 'none',
                dividerload: "none",
                dividertable: "none",
                submitData: {},
                canSubmit: false,
                disabled: false,
                manHour: "",
                rejectDesc: ['121', '3333', '4444', '55555']
            };
        },
        methods: {
            slide_bar(val) {
                this.submitData[val.taskId] = true;
            },
            handleInput(item, index) {
                this.items[index].manHour = item.manHour;
                this.watchVal();
            },
            watchVal() {
                const arrs = this.items;
                const reg = /^\d+\.?\d{0,1}$/;
                if (arrs.length > 0) {
                    arrs.map((item, index) => {
                        let manHour = parseFloat(item.manHour).toFixed(1);
                        if (!reg.test(item.manHour)) {
                            this.$set(this.items[index], "manHour");
                        }
                    });
                }
            },
            onTransitionEnd(dates) {
                console.log(dates);
            },
            goworker() {
                this.state = "none";
            },
            goHome() {
                this.$router.push({
                    path: "/"
                });
            },
            handleView() {
                console.log("overview");
            },
            onToggle(index) {
                this.$http.get("../../../static/json/list.json").then(({
                    data
                }) => {
                    this.items[index].showDetails = !this.items[index].showDetails;
                    data.list.map((item , i) => {
                         if(item.superiorTask.length > 0 , i == index){
                            this.items[index].viewHide = false;
                        }else{
                            this.items[index].viewHide = true
                        }
                    })
                   
                    // this.viewHide = 'block'
                    console.log(this.items)
                })
            },
            dateClick(date) {
                this.getWeekData(date);
                this.gettastList(this.projectId, date);
            },
            // 提交取消
            onCancel() {
                console.log("on cancel");
            },
            // 提交确定
            onConfirm() {
                let newItem = [];
                this.items.map(item => {
                    console.log(item)
                    if (this.submitData[item.taskId]) {
                        debugger;
                        if (item.manHour == "") {
                            item.manHour = 0;
                        }
                        newItem.push(item);
                    }
                });
                // this.$http.post("/timesheet/saveListData.jsp", {
                this.$http.post("../../../static/json/moreData.json", {
                    list: JSON.stringify(newItem),
                    newdate: this.$refs.weekSlide.dates[1].date
                }).then(({
                    data
                }) => {
                    this.$vux.toast.text("提交成功", "content");
                    this.gettastList(this.projectId, this.$refs.weekSlide.dates[1].date);
                });
                this.$vux.toast.text("提交成功", "content");
            },
            onHide() {
                console.log("on hide");
            },
            onShow() {
                console.log("on show");
            },
            clickNext() {
                this.getWeekData(this.$refs.weekSlide.dates[2].date);
                this.gettastList(this.projectId, this.$refs.weekSlide.dates[2].date);
                this.$refs.weekSlide.activeIndex = 2;
                for (var i = 0; i < this.$refs.weekSlide.$refs.sliders.children.length; i++) {
                    this.$refs.weekSlide.onTransitionEnd(i);
                }
            },
            clickPerv() {
                this.getWeekData(this.$refs.weekSlide.dates[0].date);
                this.gettastList(this.projectId, this.$refs.weekSlide.dates[0].date);
                this.$refs.weekSlide.activeIndex = 0;
                for (var i = 0; i < this.$refs.weekSlide.$refs.sliders.children.length; i++) {
                    this.$refs.weekSlide.onTransitionEnd(i);
                }
            },
            getWeekData(e) {
                // this.$http.get("/timesheet/getListOfWeek.jsp", {
                this.$http.get("../../../static/json/weekData.json", {
                        params: {
                            dateStr: e ? e : date
                        }
                    })
                    .then(({
                        data
                    }) => {
                        data.list.map(item => {
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
            gettastList(e, date) {
                let Date = moment().format("YYYY-MM-DD");
                this.$http.get("../../../static/json/list.json", {
                    // this.$http.get("/timesheet/getListData.jsp", {
                    params: {
                        dateStr: date ? date : Date,
                        projectId: e ? e : this.projectId
                    }
                }).then(({
                    data
                }) => {
                    let completePercent;
                    this.submitData = {};
                    data.list.map(item => {
                        item.completePercent = parseFloat(item.completePercent) * 100;
                        if (item.manHour) {
                            item.manHour = parseFloat(item.manHour).toFixed(1);
                        }
                        if (item.approvalStart == "0") {
                            item.disabledStart = false
                        } else if (item.approvalStart == "2") {
                            item.disabledStart = false;
                            item.refuse = true;
                        } else if (item.approvalStart == "3") {
                            item.disabledStart = true;
                            item.adopt = true;
                        }
                        item.showDetails = false;
                        item.checked = false;
                    });
                    this.items = data.list;
                    console.log(this.items)
                    this.canSubmit = data.canSubmit == "1" ? false : true;
                    if (!this.projectId) {
                        this.value = "";
                        this.projectId = data.projectId;
                    }
                });
            },
            hideView() {
                this.showView = "none";
            },
            displayView() {
                // this.$http.get("/timesheet/getMore.jsp", {
                this.$http.get("../../../static/json/moreData.json", {
                        // params: {
                        // 	dateStr: this.$refs.weekSlide.dates[1].date
                        // }
                    })
                    .then(({
                        data
                    }) => {
                        console.log(data)
                        for (let key in data) {
                            if (typeof data[key] === "number" && data[key] != 0) {
                                data[key] = parseFloat(data[key]).toFixed(1);
                            } else {
                                data[key] = data[key];
                            }
                        }
                        this.datalist = data;
                        this.showView = "block";
                    });
            },
            onclick_list(val, manHour) {
                var time;
                if (!manHour) {
                    this.$vux.toast.text('请输入工时', 'middle')
                    // this.submitData[val] = false;
                    setTimeout(() => {
                        //   this.$vux.toast.hide();
                        this.submitData[val] = false;
                    }, 1500)
                }
                clearTimeout(time)
                console.log(val, manHour);
            },
            change_list(id, manHour, e) {
                this.submitData[id] = true;
            },
            changeCount(id) {
                console.log(id)
                this.submitData[id] = true;
            },
            submit() {
                this.show = true;
            },
            addList(item) {
                this.state = "none";
                this.value = item.projectName;
                this.projectId = item.projectId;
                this.getWeekData();
                this.gettastList(item.projectId, this.$refs.weekSlide.dates[1].date);
            },
            projectClick() {
                this.state = "block";
                this.addproject();
            },
            addproject() {
                this.$http.get('/project/getProjectList.jsp').then(({
                // this.$http.get("../../../static/json/projectData.json").then(({
                    data
                }) => {
                    this.itemless = data.list;
                });
            }
        },
        created() {
            this.$vux.toast.text('hello', 'middle')
            this.getWeekData();
            this.gettastList();
            this.addproject();
            this.fullHeight = document.documentElement.clientHeight - 240 + "px";
        }
    };
</script>

<style type="text/css" scoped lang="less">
    .purple {
        color: #d549fd;
        text-align: center;
    }
    .bule {
        color: #55a8fe;
        text-align: center;
    }
    .red {
        color: #ff3831;
        text-align: center;
    }
    .green {
        color: #54d229;
    }
    .dark_green {
        color: #289c00;
    }
    .container {
        position: relative;
        height: 100%;
        .cord_buttom {
            position: fixed;
            bottom: 0;
            width: 95%;
            background: #fff;
            padding: 10px;
        }
        .projectlist {
            position: fixed;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 99;
            background-color: #eee;
            .vux-header {
                background-color: #aa55a8;
            }
            .li1 {
                height: 45px;
                line-height: 45px;
                font-size: 14px;
                padding: 0 15px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                border-bottom: 1px solid #eee;
            }
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
        font-size: 15px !important;
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
                width: 80px;
                text-align: center;
                border: 1px dotted #ccc;
                line-height: 44px;
                height: 44px;
                font-size: 15px;
                -moz-user-select: text !important;
                -webkit-user-select: text !important;
            }
            .cord_input:focus {
                outline: none;
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
        }
        .date-info {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
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
    .overview-Container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        .mask {
            position: fixed;
            height: 100%;
            width: 100%;
            opacity: 0.7;
            z-index: 9;
            background-color: #858585;
        }
        .content {
            position: fixed;
            width: 100%;
            z-index: 10;
            background-color: #fff;
            .cell-contant {
                width: 200px;
                display: flex;
                justify-content: space-around;
                .cell-one {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 50px;
                    color: #000;
                }
            }
        }
    }
    .weui-cells .weui-cell {
        height: 46px;
        padding: 0 15px;
    }
    .weui-cells .cord-swipeout {
        display: inline-grid;
        .vux-swipeout-button {
            width: 80px !important;
        }
    }
</style>

