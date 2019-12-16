<template>
  <div class="dashboard-container">
    <div class="div1">
      <div class="dashboard-text">Welcome:&nbsp;&nbsp;{{ username }}</div>
      <div class="dashboard-text" />
      <div class="dashboard-text" />
    </div>

    <div class="card">
      <div>
        <el-card class="box-card">
          <div class="tianqi">
            <!-- 获取的当前的天气信息 -->

            <!-- <div class="sunny" />

            <div class="cloudy" />
            <div class="rainy" />
            <div class="snowy" />
            <div class="rainbow" />
            <div class="starry" />
            <div class="stormy" /> -->

            <div v-if="today.weather==='晴'" class="sunny" />

            <div v-if="today.weather==='多云'" class="cloudy" />
            <div v-if="today.weather==='阴'" class="overcast" />
            <div v-if="today.weather==='雨'||today.weather==='小雨'||today.weather==='小到中雨'" class="rainy" />
            <div v-if="today.weather==='暴雨'" class="rainstorm" />
            <div v-if="today.weather==='雪'" class="snowy" />
            <div v-if="today.weather==='彩虹'" class="rainbow" />
            <div v-if="today.weather==='星星'" class="starry" />
            <div v-if="today.weather==='冰雹'" class="stormy" />

          </div>
          <div class="address"> 当前位置： {{ today.city }}</div>
          <div class="temperature">{{ today.temperature }} <span class="sheshidu">&nbsp;℃</span><span class="type">{{ today.weather }}</span>
          </div>
          <div class="info">相对湿度：{{ today.humidity }} %</div>
          <div class="info">风力级别：{{ today.windpower }}</div>
          <div class="info">风向描述：{{ today.winddirection }}</div>
          <div class="info">当前时间：{{ today.reporttime }}</div>
          <div class="info">省份：{{ today.province }}</div>

        </el-card>
      </div>
      <div>
        <!-- <el-card class="box-card">
        <div/>
      </el-card> -->
      </div>
      <div>
        <!-- <el-card class="box-card">
        <div/>
      </el-card> -->
      </div>
    </div>
    <!-- <remote-js src="http://pv.sohu.com/cityjson?ie=utf-8" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { menuList } from '../../api/modeList'
export default {
  name: 'Dashboard',
  components: {
    // 'remote-js': {
    //   render(createElement) {
    //     return createElement('script', { attrs: { type: 'text/javascript', src: this.src }})
    //   },
    //   props: {
    //     src: { type: String, required: true }
    //   }
    // }
  },
  data() {
    return {
      username: '',
      address: '',
      weather: {
        temperature: ''
      },
      today: {
        adcode: '',
        city: '',
        humidity: '',
        province: '',
        reporttime: '',
        temperature: '',
        weather: '',
        winddirection: '',
        windpower: ''

      }
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    this.getHeight()
    this.getWeather()
    this.getMenuList()
  },
  methods: {
    getHeight() {
      // const dom = document.querySelector('.dashboard-container');
      // console.log(window.innerHeight);
      // console.log(window.screen.height);
      // console.log(window.screen.availHeight);
      // dom.style.height = window.screen.availHeight - 150 + 'px';
      // console.log('localStorage');
      this.username = localStorage.getItem('author')
    },
    getWeather() {
      console.log('returnCitySN')
      var cip = returnCitySN['cip']
      var cid = returnCitySN['cid']
      console.log('获取外网IP', cip)
      console.log('获取当前位置id', cid)
      // 高德天气
      this.$axios.get(`https://restapi.amap.com/v3/weather/weatherInfo?city=${cid}&key=f871fa70e8481c992f69b54b1fc7bca4`).then(val => {
        if (val.status === 200) {
          console.log('获取高德天气')
          console.log(val)
          this.today = val.data.lives[0]
        }
      })
    },
    getMenuList() {
      // menuList().then((res) => {
      //     console.log(res,22222333)
      // });
    },
    getCode() {
      // 所有的城市代码

    }
  }
}
</script>
<style scoped>
  @import './index.scss';
</style>
<style lang="scss" scoped>

  .dashboard-container {
   min-height: calc(100vh - 50px); // 当前窗口的高度-50px
    height: 100%;
    background-image: url("../../assets/image/bacB.jpg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
  }

  .dashboard {
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 380px;
    height: 430px;
    background-color: rgba(245, 244, 244, 0.329);
    border: none;

    .tianqi {
      position: relative;
      display: flex;
      flex-direction: row;

    }

  }

  .tianqi > div {
    left: 80px
  }

  .card {
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .temperature {
    font-size: 70px;
    color: #0000009c;
    margin-top: 75px;
    padding-left: 150px;

  }

  .sheshidu {
    font-size: 18px;
    color: #0000009c;
  }

  .type {
    position: relative;
    display: block;
    right: -106px;
    top: -65px;
    font-size: 18px;
  }

  .info {
    line-height: 2rem;
  }

  .div1 {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding-top: 1rem;
    color: #fff;
  }

</style>
