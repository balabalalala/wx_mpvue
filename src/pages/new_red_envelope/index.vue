<template>
    <form @click="onclick" report-submit="true" @submit="formSubmit">
        <button formType="submit" class="form-button" hover-class="none">
            <div class="main">
                <header>
                    <img
                        class="header-img"
                        src="https://img-ali.xiaohongchun.com.cn/admin/155140938794412bf656a.png"
                    >
                </header>
                <div class="channel-container ovh">
                    <header>
                        <h2>全网精选</h2>
                        <p>各大电商精选好价，购物更聪明</p>
                        <div class="channels-box">
                            <ul class="channels">
                                <li
                                    @click="changeChannel(index)"
                                    :class="{current: current==index}"
                                    v-for="(channel, index) in channels"
                                    :key="index"
                                >
                                    <img :src="channel.icon">
                                </li>
                            </ul>
                        </div>
                    </header>
                    <ul v-if="disclosures.length">
                        <li v-for="(item, index) in disclosures" :key="index">
                            <goods
                                :buyStatus="item.buyable"
                                :goodsType="item.type"
                                :title="item.title"
                                :price="item.v_detail"
                                :imageUrl="item.image_url"
                                :mall="item.mall"
                                :editorDesc="item.editor_rec_desc"
                                :goodsId="item.id"
                                :icon="item.icon_sign"
                                :publishTime="item.release_time"
                                :commentCount="item.comment_count"
                                :valuePercentage="item.value_percentage"
                            />
                        </li>
                    </ul>
                </div>
                <navigator class="more" open-type="switchTab" url="/pages/index/main">更多精选</navigator>
            </div>
            <auth />
            <toast/>
            <to-index/>
            <float-window/>
        </button>
    </form>
</template>

<script>
import qs from "qs";
import util from "@/lib/util";
import fly from "@/lib/http";
import utils from "@/lib/util";
import mixin from "@/mixin/mixin";
import user from "@/lib/user";
import embed from "@/lib/data_embedding";
import goods from "@/components/index/goods";

import ToIndex from "@/components/common/to_index";
import FloatWindow from "@/components/common/floating_window";
import Toast from "@/components/common/toast";
import Auth from "@/components/common/auth";

import channels from "./channels";

import { mapMutations } from "vuex";

export default {
  data() {
    return {
      disclosures: [],
      channels,
      current: 0,
      status: 0
      // showModal: false,
    };
  },
  mixins: [mixin],
  components: {
    ToIndex,
    FloatWindow,
    goods,
    Toast,
    Auth
  },
  methods: {
    ...mapMutations(["toggleAuth"]),
    changeChannel(index) {
      if (this.current == index) {
        return;
      }

      this.current = index;
      this.fetchHots();
    },
    fetchHots() {
      fly
        .get(
          "/lsj/v3/new_people_area/choice?page_size=50&mall=" +
            this.channel.name
        )
        .then(resp => resp.data)
        .then(resp => (this.disclosures = resp));
    },
    fetchNews() {
      fly
        .get("/lsj/v3/new_people_area/list")
        .then(resp => resp.data)
        .then(resp => {
          //   this.newExclusives = resp.disclosures;
          this.status = resp.coupon_status;
        });
    }
  },
  computed: {
    channel() {
      return this.channels[this.current];
    }
  },
  onLoad() {
    this.fetchNews();
    this.fetchHots();
  },
  onShareAppMessage(res) {
    const shareCode = utils.uuid();
    const params = {
      share_code: shareCode
    };

    embed.reportShareIncrement({
      type: "newRedEnvelope",
      share_code: shareCode
    });

    return {
      title: "聪明小姐姐都在用的薅羊毛神器，快去看看吧~",
      path: "pages/new_red_envelope/main?" + qs.stringify(params)
    };
  }
};
</script>

<style scoped>
@keyframes inout {
  50% {
    transform: scale3d(0.95, 0.95, 1);
  }

  to {
    transform: scale3d(1);
  }
}
.main {
  position: relative;
  z-index: 1;
}

.header-img {
  display: block;
  width: 100%;
}
.channel-container header {
  overflow: hidden;
  background: #f5f5f5;
  padding-left: 30rpx;
}

.channel-container h2 {
  color: #191919;
  font-size: 34rpx;
  font-weight: 500;
  margin-top: 40rpx;
}

.channel-container header > p {
  font-size: 24rpx;
  color: #4c4c4c;
}

.channels-box {
  overflow-x: auto;
  margin-top: 32rpx;
}

.channels {
  white-space: nowrap;
  height: 134rpx;
}

.channels::before {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: bottom;
}

.channels img {
  width: 100rpx;
  height: 100rpx;
  display: block;
  transition: width 0.2s, height 0.2s;
}

.channels .current {
  position: relative;
}

.channels .current img {
  width: 115rpx;
  height: 115rpx;
}

.channels .current::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  content: "";
  border-left: 15rpx solid transparent;
  border-right: 15rpx solid transparent;
  border-bottom: 15rpx solid white;
}

.channels li {
  display: inline-block;
  margin-right: 12rpx;
  padding-bottom: 20rpx;
  vertical-align: bottom;
}

.more {
  color: #1a1a1a;
  font-size: 28rpx;
  text-align: center;
  line-height: 98rpx;
}
.more::after {
  content: "";
  display: inline-block;
  border-top: 10rpx solid transparent;
  border-bottom: 10rpx solid transparent;
  border-left: 10rpx solid;
  margin-left: 0.5em;
}
</style>
<style src="@/style/form.css"></style>
<style src="@/common/style/common.css"></style>
