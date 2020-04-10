import _ from 'underscore'
import Comment from "@/components/common/comment"
import mixin from "@/mixin/mixin"

export default {
    mixins: [mixin],
    data () {
        return {
            eid: 0,
            eType:0,
            isShowComment: false
        }
    },
    components: {Comment},

    methods: {
        
    },
    onReachBottom() {
        this.$refs.commentComponent.fetch()
    },
    onLoad() {
        this.isShowComment = true
        const query = this.$root.$mp.query
        this.eType=query.eType
        this.eid=query.id
    },
    onUnload() {
        this.isShowComment = false
        Object.assign(this.$data, this.$options.data())
        // this.$refs.commentComponent.clearContent()
    }
    

}