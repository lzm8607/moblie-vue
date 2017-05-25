<template>
    <div>
        <div>
            <mu-appbar title="新车发布" :zDepth="0">
                <mu-icon-button icon="account_circle" slot="left" @click="open('left')"/>
                <mu-icon-menu icon="add" slot="right">
                    <mu-menu-item title="Preview" leftIcon="remove_red_eye"/>
                    <mu-menu-item title="Share" leftIcon="person_add"/>
                    <mu-menu-item title="Get Links" leftIcon="link"/>
                    <mu-divider/>
                    <mu-menu-item title="Make a copy" leftIcon="content_copy"/>
                    <mu-menu-item title="Download" leftIcon="file_download"/>
                    <mu-menu-item title="Remove" leftIcon="delete"/>
                </mu-icon-menu>
            </mu-appbar>
            <mu-tabs :value="activeTab" @change="handleTabChange">
                <mu-tab value="plist" title="找人"/>
                <mu-tab value="clist" title="找车"/>
                <mu-tab value="dlist" title="金融"/>
            </mu-tabs>
        </div>
        <router-view></router-view>
        <mu-paper style="position: fixed;bottom: 0;width: 100%">
            <mu-bottom-nav :value="bottomNav" shift @change="handleChange">
                <mu-bottom-nav-item value="movies" title="Movies" icon="train"/>
                <mu-bottom-nav-item value="music" title="Music" icon="music_note"/>
                <mu-bottom-nav-item value="books" title="Books" icon="books"/>
                <mu-bottom-nav-item value="my" title="我" icon="fingerprint"/>
            </mu-bottom-nav>
        </mu-paper>
        <mu-popup position="left" popupClass="demo-popup-left" :open="leftPopup" @close="close('left')">
            <mu-raised-button label="关闭弹框" @click="close('left')" primary fullWidth/>
        </mu-popup>
    </div>

</template>
<script>
    export default {
        data: function () {
            return {
                bottomNav: 'movies',
                bottomNavColor: 'movies',
                activeTab: 'dlist',
                leftPopup: false,
            }
        },
        methods: {
            handleChange: function (val) {
                this.bottomNav = val
            },
            handleTabChange: function (val) {
                this.activeTab = val
                this.$router.push({path: '/home/' + val, replace: true});
            },
            handleActive: function () {
                window.alert('tab active')
            },
            goTo: function (val) {
                this.$router.push({path: '/home/list', replace: true});
            },
            open: function (position) {
                this[position + 'Popup'] = true
            },
            close: function (position) {
                this[position + 'Popup'] = false
            }
        }
    }
</script>
<style lang="css">
    .demo-popup-left {
        display: flex;
        width: 80%;
        max-width: 300px;
        height: 100%;
        align-items: center;
        padding: 10px;
    }
</style>