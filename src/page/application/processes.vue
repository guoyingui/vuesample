<template>
    <div class="container">
        <x-header :left-options="{preventGoBack: true,backText:'返回'}" @on-click-back="goHome">流程
            <div slot="right" @click="screening">
                <img width="25px" src="../../assets/images/screen.png" alt="">
            </div>
        </x-header>
        <search placeholder="请根据项目名称搜索" @result-click="resultClick" @on-change="getResult" @on-focus="onFocus" @on-cancel="onCancel" :results="results" v-model="value" :style="{position:state}" auto-scroll-to-top top="46px" ref="search"></search>
        <scroller lock-x height="-90" @on-scroll="onScroll" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" :pulldown-config="{downContent: '下拉刷新', upContent: '释放后更新'}" :pullup-config="{upContent:'上拉加载更多', downContent:'释放后加载',loadingContent:'加载中···'}" use-pullup>
            <div :style="{height:fullHeight,overflow:'auto'}">
                <group v-for="i in projectlist" :key="i.projectid" @click.native="listMonad(i.projectid)">
                    <cell primary="content">
                        <img slot="title" src="../../../static/images/icon.png" alt="">
                        <div slot>
                            <h4>{{i.projectname}}</h4>
                            <span>流程名称：{{i.statname}}</span>
                            <div class="list-flex">
                                <label>审批人：{{i.username}}</label>
                                <span>2019-02-11 10:03</span>
                            </div>
                        </div>
                    </cell>
                </group>
            </div>
            <div v-transfer-dom>
                <popup v-model="showMenus" position="right">
                    <div style="width:200px;">
                        <div class="slide-tab">审批类型</div>
                        <checker v-model="demo22" type="checkbox" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item :value="item" v-for="(item, index) in items" :key="index">{{item.value}}</checker-item>
                        </checker>
                        <span>{{demo22}}</span>
                    </div>
                </popup>
            </div>
        </scroller>
    </div>
</template>

<script type="text/javascript">
    import {
        TransferDom,
        CheckerItem,
        Scroller,
        Checker,
        Search,
        XHeader,
        Popup,
        Group,
        Cell
    } from 'vux';
    import {
        isNull
    } from 'util';
    export default {
        directives: {
            TransferDom
        },
        components: {
            CheckerItem,
            Scroller,
            Checker,
            Search,
            XHeader,
            Popup,
            Group,
            Cell
        },
        data() {
            return {
                showMenus: false,
                fullHeight: '',
                projectlist: [],
                demo22: [{
                    key: '1',
                    value: '待审批'
                }],
                items: [{
                    "key": "1",
                    "value": "待审批"
                }, {
                    "key": "2",
                    "value": "已审批"
                }],
                results: [],
                value: '',
                state:'static',
                scrollTop: 0,
                onFetching:false,
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.scrollerBottom.reset({top: 0})
            })
        },
        methods: {
            listMonad(id) {
                this.$router.push({
                    name: 'information',
                    params: {
                        projectid: id
                    }
                })
            },
            goHome() {
                this.$router.push({
                    path: '/'
                })
            },
            screening() {
                this.showMenus = true;
            },
    
            setFocus() {
                this.$refs.search.setFocus()
            },
            resultClick(item) {
                window.alert('you click the result item: ' + JSON.stringify(item))
            },
            getResult(val) {
                console.log('on-change', val)
                // this.results = val ? getResult(this.value) : []
                this.projectlist = [];
            },
            onSubmit() {
                this.$refs.search.setBlur()
                this.$vux.toast.show({
                    type: 'text',
                    position: 'top',
                    text: 'on submit'
                })
            },
            onFocus() {
                this.state = 'static',
                console.log('on focus')
            },
            onCancel() {
                console.log('on cancel')
            },
            onScrollBottom () {
                if (this.onFetching) {
                    console.log('ajax请求');
                } else {
                    this.onFetching = true
                    setTimeout(() => {
                        this.$nextTick(() => {
                            this.$refs.scrollerBottom.reset({top:0})
                        })
                        this.onFetching = false
                    }, 2000)
                }
            },
            onScroll(pop){
                this.scrollTop = pop.top;
            },
            onPulldownLoading(){

            },
            projectList(current,pageSize){
                this.$http.get('../../../static/json/projectList.json',{current:current,pageSize:pageSize}).then(({
                    data
                }) => {
                    this.projectlist = data.data;
                })
            }
        },
        created() {
            this.fullHeight = document.documentElement.clientHeight - 90 + "px";
            this.projectList(1,20)
        },
    }
</script>
<style lang="less" scoped>
    .container {
        .vux-label img {
            width: 3rem;
        }
        /deep/ .vux-no-group-title {
            margin-top: 0;
            .vux-cell-primary {
                width: calc(100% - 80px);
                padding-left: 3rem;
                text-align: left;
            }
            .weui-cell {
                padding: .9375rem;
            }
            .vux-cell-primary {
                font-size: .875rem;
                h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    height: 1.875rem;
                    line-height: 1.875rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        .list-flex {
            display: flex;
            justify-content: space-between;
        }
    }
    
    /deep/ .vux-popup-dialog {
        background-color: #ffffff;
        .slide-tab {
            height: 3.125rem;
            line-height: 3.125rem;
            padding: 0 .625rem;
            background-color: #f2f2f2;
        }
        .demo1-item {
            width: 6.5rem;
            margin: .3rem .625rem;
            height: 2.5rem;
            line-height: 2.5rem;
            text-align: center;
            border: 1px solid #ececec;
            border-radius: .3125rem;
        }
        .demo1-item-selected {
            border: 1px solid #9A5EED;
        }
    }
</style>
