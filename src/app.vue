<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                title: 'Hello World1'
            }
        },
        methods: {
            test:(a,b)=>{
               return a+b;
            }
        }
    }
</script>