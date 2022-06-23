import Hello from './hello'

export default {
    name: 'World',
    components: { Hello },
    render(h) {
        return h('div', {class: 'world-cmp'}, [h('span', 'below is Hello:'), h( Hello, {attrs: {msg: 'today'}})])
    }
}