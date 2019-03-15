<template>
    <div class="container">
        <search placeholder="请根据项目名称搜索" @result-click="resultClick" @on-change="getResult" @on-focus="onFocus" @on-cancel="onCancel" :results="results" v-model="value" :style="{position:state}" auto-scroll-to-top top="46px" ref="search"></search>
        <div style="padding:10px 0;">
            <checklist label-position="left" :options="commonList" v-model="checklist" @on-change="change"></checklist>
        </div>
        <x-button type="primary" @click.native="onSubmit">确定</x-button>
    </div>
</template>

<script>
    import {
        Search,
        Checklist,
        XButton
    } from 'vux';
    export default {
        components: {
            Search,
            Checklist,
            XButton
        },
        data() {
            return {
                state: false,
                results: [],
                value: '',
                commonList: ['admin', '潘素君', '高星星'],
                checklist: [],
            }
        },
        methods: {
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
            change(value) {
                console.log(value);
            },
            onSubmit() {
                this.$router.push({
                    name:'information',
                    params: {
                        checklist:this.checklist
                    }
                })
            }
        },
        created() {
            this.checklist = this.$route.params.user;
            console.log('object :', this.checklist);
        },
    }
</script>

<style lang="less" scoped>
    .container {
        /deep/ button.weui-btn {
            position: fixed;
            bottom: .5rem;
            width: 96%;
            margin: 0 2%;
            background-color: #9A5EED;
        }
    }
</style>

