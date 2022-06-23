
import { getOpenDataJSX } from '../../src/utils'

export default {
    name: 'OpenDemo',
    render(h) {
        return getOpenDataJSX(h, 'yxt', 'userName', ',' )
    }
}