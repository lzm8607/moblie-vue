/**
 * Created by Jimmy on 2018/3/7.
 */
import Vue from 'vue';
import app from '../../src/app.vue';

describe('test app.vue', () => {

    // 描述要测试的最小单元
    it('组件加载后，title应该是Holle World', () => {
        // 这里将app生成vue实例，并使用 $mount() 模拟挂载状态
        let vm = new Vue(app).$mount();
        // 断言组件的title是否变为了'Hello World'
        expect(vm.title).toEqual('Hello World');
    });
});