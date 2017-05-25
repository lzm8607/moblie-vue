<template>
    <div>
        <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
        <mu-list>
            <template v-for="item in list">
                <mu-list-item disableRipple :title="item"/>
                <mu-divider/>
            </template>
        </mu-list>
    </div>
</template>
<script>
    export default {
        components: {//组件

        },
        data: function () {//初始化数据
            const list = []
            for (let i = 0; i < 20; i++) {
                list.push('item' + (i + 1))
            }
            return {
                list,
                num: 10,
                refreshing: false,
                trigger: null,
                scroller: null,
                loading: false,
            }
        },
        mounted: function () {
            this.trigger = this.$el
        },
        methods: {//方法
            refresh: function () {
                this.refreshing = true
                setTimeout(() => {
                    const list = []
                    for (let i = this.num; i < this.num + 10; i++) {
                        list.push('item' + (i + 1))
                    }
                    this.list = list
                    this.num += 10
                    this.refreshing = false
                }, 2000)
            },
            loadMore:function() {
                alert(1)
                this.loading = true;
                setTimeout(() => {
                    for (let i = this.num; i < this.num + 10; i++) {
                        this.list.push('item' + (i + 1))
                    }
                    this.num += 10
                    this.loading = false
                }, 2000)
            }
        }
    }
</script>
<style>

</style>