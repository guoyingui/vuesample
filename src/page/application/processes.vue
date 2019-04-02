<template>
    <div class="container">
        <x-header :left-options="{preventGoBack: true,backText:'返回'}" @on-click-back="goHome">流程
            <div slot="right" @click="screening">
                <img width="25px" src="../../assets/images/screen.png" alt="">
            </div>
        </x-header>
        <search placeholder="请根据项目名称搜索" @on-result-click="resultClick" @on-blur="onBlur" @on-change="getResult" @on-focus="onFocus" @on-cancel="onCancel" :results="results" v-model="value" :style="{position:state}" auto-scroll-to-top top="46px" ref="search"></search>
        <scroller lock-x height="-90" on-scroll="onScroll" @on-pullup-loading="selPullUp" ref="scroller" :bounce="isbounce" :scroll-bottom-offst="200" :pullup-config="upobj" use-pullup v-model="scrollerStatus">
            <div class="box2-wrap" :style="{height:fullHeight}">
                <group v-for="i in projectlist" :key="i.objectid" @click.native="listMonad(i.objectid)">
                    <cell primary="content">
                        <img slot="title" src="../../../static/images/icon.png" alt="">
                        <div slot>
                            <h4>对象名称：{{i.objectname}}</h4>
                            <span>流程名称：{{i.flowname}}</span>
                            <h6>步骤名称：{{i.stepname}}</h6>
                            <div class="list-flex">
                                <label>审批人：{{i.user}}</label>
                                <span>{{i.startdate}}</span>
                            </div>
                        </div>
                    </cell>
                </group>
                <load-more :style="{display:showToast}" :show-loading="false" tip="已加载全部数据" background-color="#fbf9fe"></load-more>
            </div>
        </scroller>
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
    </div>
</template>

<script type="text/javascript">
let totalArr = [];
let count = 3;
let totalArrIndex = 1;

import {
    TransferDom,
    CheckerItem,
    LoadMore,
    Scroller,
    Checker,
    Search,
    XHeader,
    Popup,
    Group,
    Cell,
    base64
} from 'vux';
export default {
    directives: {
        TransferDom
    },
    components: {
        CheckerItem,
        Scroller,
        LoadMore,
        Checker,
        Search,
        XHeader,
        Popup,
        Group,
        Cell,
    },
    data() {
        return {
            showMenus: false,
            fullHeight: '',
            projectlist: [],
            list: [],
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
            } ,{
                "key": "3",
                "value": "我审批的"
            }],
            results: [],
            value: '',
            state: 'static',
            scrollTop: 0,
            onFetching: false,
            result: true,
            upobj: {
                content: '上拉刷新数据',
                pullUpHeight: 60,
                height: 50,
                autoRefresh: true,
                downContent: '上拉刷新数据',
                upContent: '上拉刷新数据',
                loadingContent: '加载中...',
                clsPrefix: 'xs-plugin-pullup-'
            },
            scrollerStatus: {
                pullupStatus: 'default'
            },
            isbounce: false,
            showToast: 'none'
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.scroller.reset();
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
            console.log(base64.encode(val));
            this.projectlistNative('',base64.encode(val));
            // this.results = val ? getResult(this.value) : []
        },
        onBlur() {
            console.log('on blur');
        },
        onFocus() {
            this.state = 'static',
                console.log('on focus')
        },
        onCancel() {
            console.log('on cancel')
            this.projectlistNative('','');
        },
        selPullUp() {
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true;
                setTimeout(() => {
                    console.log(this.projectlist.length, totalArr.length);
                    if (this.projectlist.length != totalArr.length) {
                        this.projectlist.push(...totalArr[totalArrIndex++])
                    }else{
                        this.showToast = 'flex';
                    }
                    this.onFetching = false;
                    this.scrollerStatus.pullupStatus = 'default'
                    this.$nextTick(() => {
                        this.$refs.scroller.reset({ top: 0 })
                    })
                }, 1000)
            }
        },
        onScroll(pop) {
            this.scrollTop = pop.top;
        },
        projectlistNative(TypeName,quickSearchText) {
            totalArr = [];
            // this.$http.get('/app/mobileFlowAction.do?submitFlag=getFlowList').then(({
            this.$http.get('../../../static/json/projectlist.json').then(({
                data
            }) => {
                for (let i = 0; i < data.listData.length; i += count) {
                    totalArr.push(data.listData.slice(i, i + count))
                }
                this.projectlist = totalArr[0];
            })

        }
    },
    created() {
        this.fullHeight = document.documentElement.clientHeight - 90 + "px";
        this.projectlistNative();
    },
    // 不能滚动，解决方法：因为启用keep-alive缓存，需要设置
    activated() {
        this.$refs.scroller.reset()
    }
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

.box2-wrap {
    overflow: auto;
}
</style>
