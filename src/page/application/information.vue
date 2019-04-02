<template>
    <div class="container-form">
        <x-header :left-options="{preventGoBack: true,backText:'返回'}" @on-click-back="goHome">流程</x-header>
        <div :style="{height:fullHeight,overflow:'auto'}">
            <group>
                <div class="nav-warp" v-for="Itemlist in workItemlist" :key="Itemlist.sequencekey">
                    <cell class="group-cell" :title="Itemlist.nodeName" is-link :border-intent="false" :arrow-direction="Itemlist.showContent ? 'up' : 'down'" @click.native="Itemlist.showContent = !Itemlist.showContent"></cell>
                    <div class="slide" :class="Itemlist.showContent ? 'animate' : '' ">
                        <cell v-for="list in Itemlist.listFiled" :key="list.filedname" :title="list.labname">
                            <input slot v-if="list.datatype == 0" type="text" name="" :value="list.value" id="" placeholder="请输入内容">
                            <textarea slot v-if="list.datatype == 1" name="" id="" cols="40" rows="4" :value="list.value" placeholder="请输入内容"></textarea>
                            <datetime slot v-if="list.datatype == 8" @on-change="change" :title="value1" placeholder="请选择日期" format="YYYY-MM-DD HH:mm" @on-cancel="log('cancel')" @on-confirm="onConfirm" @on-hide="log('hide', $event)"></datetime>
                            <popup-picker slot v-if="list.datatype ==15" title="" :data="list1" v-model="value5" value-text-align="left"></popup-picker>
                            <selector slot v-if="list.datatype == 11" :value="list.value" :options="list.listVal" direction="rtl" placeholder="请选择省份"></selector>
                            <div class="slide-search" slot v-if="list.datatype == 91"><input class="search-result" type="text" name="" id="" :value="list.value"><button class="table-search"><img src="../../../static/images/search.png" alt=""></button></div>
                        </cell>
                    </div>
                </div>
                <div class="nav-warp">
                    <cell class="group-cell" title="步骤处理人" is-link :border-intent="false" :arrow-direction="showContent002 ? 'up' : 'down'" @click.native="showContent002 = !showContent002"></cell>
                    <div class="slide" :class="showContent002?'animate':''">
                        <div>
                            <x-table full-bordered style="background-color:#fff;">
                                <thead>
                                    <tr>
                                        <th>流程名称</th>
                                        <td colspan="3">测试流程</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="root in root2" :key="root.stepid">
                                        <td>{{root.stepname}}</td>
                                        <td v-if="root.initusertype === 0" colspan="3">
                                            <input class="table-name" type="text" name="" id="" :value="user" disabled>
                                            <button @click="searchUser" class="table-search"><img src="../../../static/images/search.png" alt=""></button>
                                        </td>
                                        <td v-else-if="root.initusertype === 4" colspan="3">
                                            <input class="table-name" type="text" name="" id="" :value="user" disabled>
                                        </td>
                                        <td v-else colspan="3">
                                            <input class="table-name" type="text" name="" id="" :value="user" disabled>
                                        </td>
                                    </tr>
                                </tbody>
                            </x-table>
                        </div>
                    </div>
                </div>
                <div class="nav-warp">
                    <cell class="group-cell" title="流程步骤信息" is-link :border-intent="false" :arrow-direction="showContent003 ? 'up' : 'down'" @click.native="showContent003 = !showContent003"></cell>
                    <div class="slide" :class="showContent003?'animate':''">
                        <div>
                            <x-table full-bordered style="background-color:#fff;">
                                <thead>
                                    <tr>
                                        <th>步骤名称</th>
                                        <th>操作人</th>
                                        <th>操作时间</th>
                                        <th>审批意见</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>开始</td>
                                        <td>潘素君</td>
                                        <td>2018-06-12 12:03:30</td>
                                        <td>同意</td>
                                    </tr>
                                    <tr>
                                        <td>开始</td>
                                        <td>潘素君</td>
                                        <td>2018-06-12 12:03:30</td>
                                        <td>同意</td>
                                    </tr>
                                    <tr>
                                        <td>开始</td>
                                        <td>潘素君</td>
                                        <td>2018-06-12 12:03:30</td>
                                        <td>同意看几家军军军军斤sdasdas沙发沙发上斤计较军</td>
                                    </tr>
                                </tbody>
                            </x-table>
                        </div>
                    </div>
                </div>
    
            </group>
        </div>
        <div class="footer-bar">
            <x-button v-for="tool in tools" :key="tool.toolid" :class="tools.length > 1 ? 'buttonEnter' : '' " type="primary" @click.native="onSubmit(tool.toolid)">{{tool.configdisname}}</x-button>
        </div>
    </div>
</template>

<script>
import {
    PopupPicker,
    Datetime,
    XHeader,
    XButton,
    XTable,
    Selector,
    Group,
    Cell
} from 'vux';
export default {
    components: {
        PopupPicker,
        Datetime,
        XHeader,
        XButton,
        XTable,
        Selector,
        Group,
        Cell
    },
    data() {
        return {
            fullHeight: '',
            showContent002: true,
            showContent003: false,
            wrapable: '',
            projectname: '2',
            username: '3',
            workItemlist: [],
            value1: '',
            value5: ['A'],
            Birthday: '3333',
            list1: [
                ['A', 'B', 'C']
            ],
            user: [],
            tools: [],
            root2: [],
            projectid: ''
        }
    },
    methods: {
        goHome() {
            this.$router.push({
                path: '/processes'
            })
        },
        searchUser() {
            this.$router.push({
                name: 'username',
                params: {
                    user: this.user
                }
            })
        },
        log(i, j) {
            console.log(i, j)
        },
        change(value) {
            console.log('change', value)
        },
        onConfirm(val) {
            console.log('on-confirm arg', val)
            console.log('current value', this.value1)
        },
        onSubmit(val) {
            console.log(val)
            // this.$http.post('wwww.baidu.com', {
            //     list: this.fieldList
            // }).then((response) => {

            // }).catch((error) => {

            // })
        }
    },
    created() {
        console.log(this.$route.params);
        this.user = this.$route.params.checklist;
        this.projectid = this.$route.params.projectid;
        this.fullHeight = document.documentElement.clientHeight - 100 + "px";
        this.$http.get('../../../static/json/fieldList.json').then(({
            data
        }) => {
            data.workItemlist.map((item, index) => {
                if (item.viewable == '1') {
                    item.showContent = true;
                } else {
                    item.showContent = true;
                }
            })
            this.workItemlist = data.workItemlist;
            this.wrapable = data.workItemlist;
        })
        this.$http.get('../../../static/json/cfgFormAction.json').then(({
            data
        }) => {
            console.log(data);
            this.tools = data.tool;
            this.root2 = data.root2;
        })
    },
}
</script>

<style lang="less" scoped>
.container-form {
    /deep/ .weui-cells {
        margin-top: .625rem;
        font-size: .875rem;
        .nav-warp:not(:last-child) {
            border-bottom: 10px solid #f2f2f2;
            border-top: 1px solid #f2f2f2;
        }
        .slide>.weui-cell {
            padding: 5px 10px;
            .weui-cell__ft {
                width: 60%;
            }
            input,
            a {
                width: 100%;
                height: 33px;
                line-height: 33px;
                text-align: right;
                padding-right: 10px;
            }
            .weui-cell_select::before {
                display: none;
            }
            .weui-cell__bd .weui-select {
                height: 3rem;
            }
        }
        .weui-cell:before {
            left: 5px;
            ;
            right: 5px;
        }
    }
}

.weui-cell /deep/ .weui-cell_access {
    padding: 0;
}

.slide {
    overflow: hidden;
    max-height: 0;
    transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
    /deep/ .weui-cell:first-child:before {
        display: inline;
    }
    /deep/ .weui-cell .vux-datetime:before {
        display: none;
    }
    .table-name {
        display: inline-block;
        width: 82%;
        height: 3.2rem;
        line-height: 3.2rem;
        padding: 0 15% 0 3%;
        border: none;
        text-align: center;
    }
    .table-search {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 999;
        width: 3rem;
        height: 2.8rem;
        margin: 0.2rem;
        border: none;
        border-radius: 5px;
        background-color: #f2f2f2;
        img {
            width: 1.875rem;
            height: 1.875rem;
            margin-top: 3px;
        }
    }
    .slide-search {
        position: relative;
        .search-result {
            width: 70% !important;
            margin-right: 40px;
        }
    }
    .vux-table th {
        min-width: 80px;
    }
    .vux-table tbody td {
        line-height: 20px;
    }
}

.animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
}

.footer-bar {
    height: 53px;
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #f2f2f2;
    background-color: #ffffff;
    /deep/ button.weui-btn {
        width: 96%;
        height: 40px;
        line-height: 40px;
        margin-top: 7px;
        font-size: 16px;
        background-color: #9A5EED;
    }
    .buttonEnter {
        width: 40% !important;
    }
}
</style>
