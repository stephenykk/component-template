<template>
    <div class="open-data-demo">
        <open />
        <Hello msg="world" />

        <h2 style="color: red;">注: 通常用 yxtbiz-user-name 和 yxtbiz-dept-name 组件, 
            不直接使用 yxtbiz-open-data 或 yxtbiz-dd-open-data</h2>


        <h2 style="color: blue;">TESTING: {{isvType}}</h2>

        <section class="tips-section">
            <div class="tips-line">
                微信open-data/钉钉open-data验证
                <p>需要启https服务，页面: https://q-phx.yunxuetang.com.cn/example.html?dingding=1</p>
                <p>q-phx.yunxuetang.com.cn 修改hosts指向本地ip</p>
            </div>
        </section>

        <h3>yxtbiz-user-name</h3>
        <hr>
        <yxtbiz-user-name :name="oneUser" />
        <hr>
        <yxtbiz-user-name :name="twoUsers" />

        <h3>yxtbiz-dept-name</h3>
        <hr>
        <yxtbiz-dept-name :name="oneDept" />
        <hr>
        <yxtbiz-dept-name :name="twoDepts" />


        <h3>yxtbiz-position-name 岗位没有模拟数据</h3>
        <hr>
        <yxtbiz-position-name name="manager" />
        <hr>
        <yxtbiz-position-name name="manager;sales" />

    </div>
</template>

<script>
import mockData from '../mock-data'
import { getQuery } from '../../src/utils'

const query = getQuery();

const isTestDingding = query.dingding;
const isvType = isTestDingding ? 'dingding' : 'weixin';

// console.log('%c 需要改host 用域名 https://q-phx.yunxuetang.com.cn/  https://d-phx.yunxuetang.com.cn/ 测试', 'color: green;')
// console.log('%c 通过url参数 dingding 切换钉钉或企微', 'color: green;');
// console.log('%c js demo https://q-phx.yunxuetang.com.cn/example2.html?dingding=1', 'color: green;')

export default {
    name: 'App',
    data() {
        return {
            lib: 'open-data-lib',
            mdata: mockData[isvType],
            isvType
        }
    },
    computed: {
        // oneUser() {
        //     return this.mdata.datas[0].fullname;
        // },
        // twoUsers() {
        //     const [userA, userB] = this.mdata.datas
        //     return [userA.fullname, userB.fullname].join(';')
        // },
        // oneDept() {
        //     return this.mdata.datas[0].deptName;
        // },
        // twoDepts() {
        //     const [userA, userB] = this.mdata.datas
        //     return [userA.deptName, userB.deptName].join('->')
        // }
    },
    created() {
        // localStorage.sourceCode = utils.sourceCodeEnum[isvType]
        // localStorage.orgId = this.mdata.orgId;
        // localStorage.MOCK_DOMAIN = this.mdata.mock_domain || '';
    }
}
</script>

<style scoped>
hr {
    border: 0;
    border-bottom: 1px solid #ccc;
    margin: 20px 0;
}
h3 {
    margin-top: 50px;
}
.tips-section {
    padding: 20px;
    background: #eee;
    border-radius: 3px;
    color: #888;
    line-height: 1.2;
}

.tips-line {
    margin-top: 30px;
}
</style>