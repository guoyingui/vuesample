<template>
    <div>
        <x-header title="归属项目"></x-header>
        <group>
            <ul>
                <li class="crad-list" v-for="item in items" :key="item.taskId" @click="addList(item)">
                    {{item.projectName}}
                </li>
            </ul>
        </group>
    </div>
</template>

<script>
    import {
        XHeader,
        XInput,
        Group
    } from 'vux'
    export default {
        components: {
            XHeader,
            XInput,
            Group
        },
        data() {
            return {
                items: {}
            }
        },
        methods: {
            addList(item) {
                console.log(item.messages);
                this.$router.push({
                    path: '/workItem',
                    query: {
                        messages: item.messages
                    }
                })
            }
        },
        created() {
            this.$http.get('/timesheet/getProjectList.jsp').then(({
                data
            }) => {
                console.log(data)
                this.items = data.list
            })
        }
    
    }
</script>

<style scoped>
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
</style>
