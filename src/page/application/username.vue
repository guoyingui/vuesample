<template>
    <div class="container">
        <x-header :left-options="{preventGoBack: true,backText:'返回'}" @on-click-back="goHome">
        </x-header>
        <search placeholder="请根据项目名称搜索" @on-change="getResult" @on-focus="onFocus" @on-cancel="onCancel" :results="results" v-model="value" :style="{position:state}" auto-scroll-to-top top="46px" ref="search"></search>
        <scroller lock-x height="-90" on-scroll="onScroll" @on-pullup-loading="selPullUp" ref="scroller" :bounce="isbounce" :scroll-bottom-offst="200" :pullup-config="upobj" use-pullup v-model="scrollerStatus">
            <div :style="{height:fullHeight,overflow:'auto'}">
                <checklist label-position="left" :options="commonList" v-model="checklist" @on-change="checked"></checklist>
            </div>
        </scroller>
        <x-button type="primary" @click.native="onSubmit">确定</x-button>
    </div>
</template>

<script>
let totalArr = [];
let count = 20;
let totalArrIndex = 1;

import {
    Search,
    Checklist,
    XButton,
    XHeader,
    Scroller
} from 'vux';
import { setTimeout } from 'timers';
var current = [];
export default {
    components: {
        Search,
        Checklist,
        XButton,
        XHeader,
        Scroller
    },
    data() {
        return {
            state: false,
            results: [],
            value: '',
            commonList: [],
            checklist: [],
            current: [],
            scrollTop: 0,
            fullHeight: '',
            onFetching: false,
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
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.scroller.reset({ top: 0 });
        })
    },
    methods: {
        goHome() {
            this.$router.push({
                name: 'information'
            })
        },
        getResult(val) {
            console.log('on-change', val)
            // this.results = val ? getResult(this.value) : []
            this.projectlist = [];
            this.$http.get('../../../static/json/username.json', { params: { quickSearchText: val } }).then((result) => {
                this.commonList = result.data.data;
            }).catch((err) => {
                alert(err);
            });
        },
        onSubmit() {
            this.$refs.search.setBlur()
            this.$vux.toast.show({
                type: 'middle',
                text: '提交成功'
            })
            // this.$router.push({
            //     name: 'information',
            //     params: {
            //         checklist: this.checklist
            //     }
            // })
        },
        onFocus() {
            this.state = 'static',
                console.log('on focus')
        },
        onCancel() {
            console.log('on cancel')
        },
        checked(value) {
            console.log(value, '22222');
        },
        selPullUp() {
            if (this.onFetching) {
                // do nothing
            } else {
                this.onFetching = true;
                setTimeout(() => {
                    console.log(this.commonList.length, totalArr.length);
                    if (this.commonList.length != totalArr.length) {
                        this.commonList.push(...totalArr[totalArrIndex++])
                    } else {
                        this.showToast = 'flex';
                    }
                    this.onFetching = false;
                    this.scrollerStatus.pullupStatus = 'default'
                    this.$nextTick(() => {
                        this.$refs.scroller.reset({ top: 0 })
                    })
                }, 2000)
            }
        },
        onScroll(pop) {
            this.scrollTop = pop.top;
        },
        personUser(userName) {
            this.$http.get('../../../static/json/username.json').then((result) => {
                for (let i = 0; i < result.data.data.length; i += count) {
                    totalArr.push(result.data.data.slice(i, i + count))
                }
                this.commonList = totalArr[0];
            }).catch((err) => {
                alert(err);
            });
        }
    },
    created() {
        var _this = this;
        totalArr = [];
        this.fullHeight = document.documentElement.clientHeight - 138 + "px";
        this.checklist = this.$route.params.user;
        this.personUser();
    },
}
</script>

<style lang="less" scoped>
.container {
    /deep/ #vux-scroller-ewpyd {
        height: 420px;
    }
    /deep/ button.weui-btn {
        position: fixed;
        bottom: .5rem;
        width: 96%;
        margin: 0 2%;
        background-color: #9A5EED;
    }
    /deep/ .weui-cell__bd {
        p {
            float: right;
            display: block;
            padding-right: 4rem;
            text-align: left;
            width: 100px;
            line-height: initial;
            font-size: 14px;
        }
    }
}
</style>

