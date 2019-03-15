<template>
    <div>
        <x-header :left-options="{preventGoBack: true,backText:'办公'}" onclick="MobileBackNative()">我的应用</x-header>
        <div class="title">欢迎你：{{userName}}</div>
        <grid class="applications">
            <grid-item :label="i.name" v-for="i in permission ? results : results1" :key="i.name" style="width: 33.3%" @click.native="handleClick(i)">
                <img slot="icon" :src="i.icon">
            </grid-item>
        </grid>
    </div>
</template>

<script type="text/javascript">
    import {
        XHeader,
        Search,
        Grid,
        GridItem
    } from "vux";
    export default {
        components: {
            XHeader,
            Search,
            Grid,
            GridItem
        },
        methods: {
            setFocus() {
                this.$refs.search.setFocus();
            },
            resultClick(item) {
                window.alert("you click the result item: " + JSON.stringify(item));
            },
            getResult(val) {
                this.results = val ? getResult(this.value) : [];
            },
            onSubmit() {
                this.$refs.search.setBlur();
                this.$vux.toast.show({
                    type: "text",
                    position: "top",
                    text: "on submit"
                });
            },
            onFocus() {
                console.log("on focus");
            },
            onCancel() {
                console.log("on cancel");
            },
            handleClick(item) {
                this.$router.push(item.router)
            }
    
        },
        created() {
            this.$http.get('/timesheet/getUserInfo.jsp').then(({
                data
            }) => {
                this.userName = data.userInfo.userName;
                this.permission = data.userInfo.permission;
            })
            this.permission = true;
    
        },
        data() {
            return {
                results: [{
                        name: "报工",
                        icon: './static/images/worker.png',
                        router: 'workItem'
                    },
                    {
                        name: "报工审批",
                        icon: './static/images/examination.png',
                        router: 'approval'
                    },
                    {
                        name: "流程",
                        icon: './static/images/processes.png',
                        router: 'processes'
                    }
                ],
                results1: [{
                    name: "报工",
                    icon: './static/images/worker.png',
                    router: 'workItem'
                }],
                value: "",
                permission: false,
                userName: ""
            };
        }
    };
</script>

<style type="text/css" scoped lang="less">
    .title {
        position: absolute;
        top: 44px;
        line-height: 26px;
        width: 95%;
        padding: 5px 10px;
        text-align: left;
        font-size: 12px;
    }
    
    .applications {
        position: absolute;
        top: 80px;
        width: 100%;
        background-color: #ffffff;
        .weui-grid {
            padding: 10px !important;
            .weui-grid__label span {
                font-size: 12px;
            }
        }
        &:before {
            border-top: 0 !important;
        }
        .weui-grid:after {
            border-bottom: 0 !important;
        }
    }
</style>
