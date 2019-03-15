<template>
    <div class="">
        <div class="year_str" v-if="showYear">{{yearMonthStr}}</div>
        <div class="week-slider" v-if="reset">
            <!-- 日期滑动属性
                @touchstart="touchstartHandle"
                @touchmove="touchmoveHandle"
                @touchend="touchendHandle"
                 -->
            <div class="sliders" ref="sliders">
                <template v-for="(item, index) in dates">
                    <div :key="index" class="slider" :style="getTransform(index)" @webkit-transition-end="onTransitionEnd(index)" @transitionend="onTransitionEnd(index)">
                        <div class="day" v-for="(day, dayIndex) in getDaies(item.date)" :key="dayIndex">
                            <div @click.stop="dayClickHandle(day.date)" :class="{today: day.isToday, sameDay: day.isDay && day.isToday, isSelected: todaystate && day.isSelected, isError:day.isError, isRegular:day.isRegular, isWeek: day.isWeek}">{{day.week}}<br><strong>{{day.date.split('-')[2]}}</strong></div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue';
import { debug } from 'util';
export default {
    name: 'weekSlider',
    props: {
        defaultDate: {
            type: String,
            default: moment().format('YYYY-MM-DD')
        },
        showYear: {
            type: Boolean,
            default: false
        },
        errorDates: {
            type: Object,
            default: function () {
                return {}
            }
        },
        regularDates: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    data() {
        return {
            dates: [],
            daytime: '',
            direction: null,
            activeIndex: 1,
            isAnimation: false,
            yearMonthStr: '',
            start: {
                x: null,
                y: null
            },
            end: {
                x: null,
                y: null
            },
            distan: {
                x: 0,
                y: 0
            },
            sliderWidth: 0,
            reset: true,
            todaystate: false,
        }
    },
    computed: {},
    watch: {
        dates: {
            handler: function (newVal, oldVal) {
                this.yearMonthStr = moment(newVal[1].date).format('YYYY-MM')
            }
        },
        deep: true
    },
    mounted() {
        this.sliderWidth = this.$refs.sliders.offsetWidth
    },
    created() {
        let vm = this
        this.dates.push(
            {
                date: moment(vm.defaultDate).subtract(7, 'd').format('YYYY-MM-DD'),
            },
            {
                // date: vm.defaultDate,
            },
            {
                date: moment(vm.defaultDate).add(7, 'd').format('YYYY-MM-DD'),
            }
        )
    },
    methods: {
        /**
        *获取制定日期的当前周的日期数据
        */
        getDaies(date) {
            let vm = this,
                arr = []
            let weekOfDate = Number(moment(date).format('E')) - 1;
            let weeks = ['一', '二', '三', '四', '五', '六', '日']
            let today = moment()
            let defaultDay = moment(this.dates[1].date)
            for (var i = 0; i < 7; i++) {
                let _theDate = moment(date).subtract(weekOfDate - i, 'd')
                arr.push({
                    date: _theDate.format('YYYY-MM-DD'),
                    // date: _theDate,
                    week: weeks[i],
                    isToday: _theDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD'),
                    isRegular: (_theDate.valueOf() < today.valueOf()) && this.regularDates[_theDate.format('YYYY-MM-DD')] && _theDate.format('YYYY-MM-DD') !== today.format('YYYY-MM-DD') && i < 5,
                    isError: !!this.errorDates[_theDate.format('YYYY-MM-DD')],
                    isDay: _theDate.format('E') === defaultDay.format('E'),
                    isSelected: _theDate.format('YYYY-MM-DD') === this.dates[1].date,
                    isWeek: i > 4
                })
            }
            // console.log(arr)
            return arr
        },
        /**
        *根据索引计算出样式
        */
        getTransform(index) {
            let vm = this
            let style = {}
            if (index === vm.activeIndex) {
                style['transform'] = 'translateX(' + vm.distan.x + 'px)'
            }
            if (index < vm.activeIndex) {
                style['transform'] = 'translateX(-100%)'
            }
            if (index > vm.activeIndex) {
                style['transform'] = 'translateX(100%)'
            }
            style['transition'] = vm.isAnimation ? 'transform 0.5s ease-out' : 'none'
            return style
        },
        /**
         * touchstart handle
         */
        touchstartHandle(event) {
            let vm = this,
                touch = event.touches[0]
            vm.start.x = touch.pageX
            vm.start.y = touch.pageY
        },
        /**
         * touchmove handle
         */
        touchmoveHandle(event) {
            let vm = this,
                touch = event.touches[0]
            vm.isAnimation = true
            vm.end.x = touch.pageX
            vm.end.y = touch.pageY
            vm.distan.x = vm.end.x - vm.start.x
            vm.distan.y = vm.end.y - vm.start.y
            let dom = vm.distan.x < 0 ? this.$refs.sliders.children[2] : this.$refs.sliders.children[0]
            if (vm.distan.x < 0) {
                dom.style['transform'] = 'translateX(' + (vm.sliderWidth + vm.distan.x) + 'px)'
            } else {
                dom.style['transform'] = 'translateX(' + (-vm.sliderWidth + vm.distan.x) + 'px)'
            }
        },
        /**
         * touchend handle
         */
        touchendHandle(event) {
            let vm = this,
                touch = event.changedTouches[0]
            vm.isAnimation = true
            vm.end.x = touch.pageX
            vm.end.y = touch.pageY
            vm.distan.x = vm.end.x - vm.start.x
            vm.distan.y = vm.end.y - vm.start.y
            vm.getTouchDirection(vm.distan.x, vm.distan.y)
            if (vm.direction === 'left') {
                vm.activeIndex = 2
            } else if (vm.direction === 'right') {
                vm.activeIndex = 0
            } else {
                for (var i = 0; i < this.$refs.sliders.children.length; i++) {
                    this.$refs.sliders.children[i].style['transform'] = 'translateX(' + (i * 100 - 100) + '%)'
                }
            }
            vm.distan.x = 0
            vm.distan.y = 0
            vm.direction = null
        },
        onTransitionEnd(index) {
            let vm = this
            vm.isAnimation = false
            this.todaystate = false;
            if (index === 1 && this.activeIndex === 2) {
                // console.log(vm.dates)
                vm.dates.push({
                    date: moment(vm.dates[vm.activeIndex].date).add(7, 'd').format('YYYY-MM-DD')
                })
                vm.dates.shift()
                vm.activeIndex = 1
            } else if (index === 1 && this.activeIndex === 0) {
                // console.log(vm.dates)
                vm.dates.unshift({
                    date: moment(vm.dates[vm.activeIndex].date).subtract(7, 'd').format('YYYY-MM-DD')
                })
                vm.dates.pop()
                vm.activeIndex = 1
            }
        },
        /**
         * getAngle 计算角度
         */
        getAngle(x, y) {
            return Math.atan2(y, x) * 180 / Math.PI;
        },
        /**
         * getTouchDirection 获取滑动方向
         */
        getTouchDirection(x, y) {
            let vm = this
            if (Math.abs(x) > 20) {
                let angle = vm.getAngle(x, y)
                if (angle >= -45 && angle <= 45) {//向右
                    vm.direction = 'right'
                } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {//向左
                    vm.direction = 'left'
                }
            }
        },
        dayClickHandle(date) {
            if (this.todaystate && this.daytime == date) {
                this.todaystate = !this.todaystate;
            } else {
                this.daytime = date;
                this.todaystate = true;
            }
            Vue.set(this.dates, 0, { date: moment(date).subtract(7, 'd').format('YYYY-MM-DD') })
            Vue.set(this.dates, 1, { date })
            Vue.set(this.dates, 2, { date: moment(date).add(7, 'd').format('YYYY-MM-DD') })
            this.$emit('dateClick', date, this.todaystate)
        }
    }
}
</script>
<style lang="less" scoped>
.year_str {
  height: 36px;
  border-bottom: #ddd solid 1px;
  line-height: 36px;
  text-align: center;
}
.week-slider {
  width: 100%;
  height: 40px;
  overflow: hidden;
  padding: 10px 0;
  .sliders {
    position: relative;
    .slider {
      height: 40px;
      width: 100%;
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      .day {
        flex: 1;
        div {
          height: 28px;
          max-width: 40px;
          padding: 6px 0;
          margin: auto;
          text-align: center;
          line-height: 15px;
          font-size: 12px;
          &.today {
            border-radius: 50%;
          }
          &.isSelected {
            border-radius: 50%;
            background-color: #3399ff;
            color: #fff !important;
          }
          //    &.sameDay {
          //       border-radius: 50%;
          //         background-color: #3399ff;
          //         color: #FFF;
          //    }
          &.isWeek {
            color: #000 !important;
          }
          &.isError {
            color: #ff3831;
          }
          &.isRegular {
            color: #54d229;
          }
          strong {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
