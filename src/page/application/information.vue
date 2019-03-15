<template>
    <div class="container-form">
        <x-header :left-options="{preventGoBack: true,backText:'返回'}" @on-click-back="goHome">流程</x-header>
        <div :style="{height:fullHeight,overflow:'auto'}">
            <group>
                <cell class="group-cell" title="基本信息" is-link :border-intent="false" :arrow-direction="showContent001 ? 'up' : 'down'" @click.native="showContent001 = !showContent001"></cell>
                <div class="slide" :class="showContent001?'animate':''">
                    <cell v-for="list in fieldList" :key="list.fieldID" :title="list.fieldText">
                        <input slot v-if="list.fieldType == 0" type="text" name="" :value="list.fieldValue" id="">
                        <datetime slot v-if="list.fieldType ==8" @on-change="change" :title="value1" format="YYYY-MM-DD HH:mm" @on-cancel="log('cancel')" @on-confirm="onConfirm" @on-hide="log('hide', $event)"></datetime>
                        <popup-picker slot v-if="list.fieldType ==15" title="" :data="list1" v-model="value5" value-text-align="left"></popup-picker>
                    </cell>
                </div>
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
                                <tr>
                                    <td>处理人</td>
                                    <td colspan="3">
                                        <input class="table-name" type="text" name="" id="" :value="user" disabled>
                                        <button @click="searchUser" class="table-search"><img src="../../../static/images/search.png" alt=""></button>
                                    </td>
                                </tr>
                            </tbody>
                        </x-table>
                    </div>
                </div>
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
            </group>
        </div>
        <x-button type="primary" @click.native="onSubmit">提交</x-button>
    </div>
</template>

<script>
    import {
        PopupPicker,
        Datetime,
        XHeader,
        XButton,
        XTable,
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
            Group,
            Cell
        },
        data() {
            return {
                fullHeight: '',
                showContent001: false,
                showContent002: true,
                showContent003: false,
                wrapable: '基本信息',
                projectname: '2',
                username: '3',
                fieldList: [],
                value1: '',
                value5: ['A'],
                Birthday: '3333',
                list1: [
                    ['A', 'B', 'C']
                ],
                user:[],
                projectid:''
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
                    params:{
                        user:this.user
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
            onSubmit() {
                console.log(this.fieldList)
                this.$http.post('wwww.baidu.com',{
                    list:this.fieldList
                }).then((response)=> {

                }).catch((error)=> {

                })
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
                this.fieldList = data.fieldList;
            })
        },
    }
</script>

<style lang="less" scoped>
    .container-form {
        /deep/ .weui-cells {
            margin-top: .625rem;
            font-size: .875rem;
        }
        /deep/ button.weui-btn {
            position: fixed;
            bottom: .5rem;
            width: 96%;
            margin: 0 2%;
            background-color: #9A5EED;
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
        /deep/ .vux-table td, .vux-table th{
            min-width: 60px;
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
            z-index: 99999;
            width: 3.5rem;
            height: 2.8rem;
            margin: 0.2rem;
            border: none;
            border-radius: 5px;
            background-color: #9A5EED;
            img{
                width: 1.875rem;
                height: 1.875rem;
                margin-top: 3px;
            }
        }
    }
    
    .animate {
        max-height: 9999px;
        transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
        transition-delay: 0s;
    }
</style>
