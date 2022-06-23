<template>
    <div class="open-data-demo">
        
        <section class="tips-section">
            <div class="tips-line">
                <p>钉钉：localhost域名下可用模拟数据预览</p>
                <p>微信: SDK初始化对域名有校验，需要开启https服务, 修改hosts用域名 q-phx.yunxuetang.com.cn 访问</p>
            </div>
        </section>

        <h2>测试机构: {{mdata.orgName}}</h2>

        <div style="color: red;">注: 通常只用到 yxtbiz-user-name 和 yxtbiz-dept-name 组件, 
            它们会调用 yxtbiz-open-data 或 yxtbiz-dd-open-data</div>
        <div>
            <button @click="handleClick">刷新</button>
        </div>
        <div class="" :key="reflash">
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

            <!-- ------------------------- test code -------------- -->
            <hr/>
            <open />
        </div>
    </div>
</template>

<script>
import Open from '../vue2-xx-demo/open'
import mockData from '../mock-data'
import { sourceCodeEnum } from '../../src/utils'
import Hello from './hello'
import World from './world'

const isvType = 'xxCryptoAbook'

export default {
    name: 'App',
    components: {
        Open,
        Hello,
        World
    },
    data() {
        return {
            lib: 'open-data-lib',
            mdata: mockData[isvType],
            isvType,
            reflash: ''
        }
    },
    computed: {
        oneUser() {
            console.debug('this.mdata', this.mdata)
            return this.mdata.datas[0].fullname;
        },
        twoUsers() {
            const [userA, userB] = this.mdata.datas
            return [userA.fullname, userB.fullname].join(';')
        },
        oneDept() {
            return this.mdata.datas[0].deptName;
        },
        twoDepts() {
            const [userA, userB] = this.mdata.datas
            return [userA.deptName, userB.deptName].join('->')
        }
    },
    created() {
        localStorage.sourceCode = sourceCodeEnum[isvType]
        localStorage.orgId = this.mdata.orgId;
        localStorage.MOCK_DOMAIN = this.mdata.mock_domain || '';
    },
    async mounted() {
    },
    methods: {
        handleClick(e) {
            this.reflash = Math.random().toString()
        }
    },
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
    /* border-radius: 3px; */
    color: #888;
    line-height: 1.5;
}
.tips-section h5, .tips-section p {
    margin: 0;
}
</style>