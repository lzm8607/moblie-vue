<template>
    <div class="swiper"
         :class="['horizontal', {'dragging': dragging}]"
         @touchstart="_onTouchStart"
         @wheel="_onWheel">
        <div class="swiper-wrap"
             ref="swiper-wrap"
             :style="{'transform' : 'translate3d(' + translateX + 'px,0, 0)'}"
             @transitionend="_onTransitionEnd">
            <slot></slot>
        </div>
        <div @click="setPage($event)" class="swiper-pagination"
             v-show="paginationVisible">
            <span class="swiper-pagination-bullet"
                  :class="{'active': (index+1)==currentPage}"
                  v-for="(slide,index) in slides"
                  :key="index"
                  :id="index+1"></span>
        </div>
    </div>
</template>
<script type="text/babel">
    export default {
        props: {
            mousewheelControl: {
                type: Boolean,
                default: true
            },
            performanceMode: {
                type: Boolean,
                default: false
            },
            paginationVisible: {
                type: Boolean,
                default: false
            },
            repeating: {
                type: Boolean,
                default: false
            },
            slides: {
                type: Array,
                default: []
            },
            auto: {
                type: Number,
                default: 0 //0 to not auto
            }
        },
        data:function() {
            return {
                currentPage: 1,
                intervalId: 0,
                lastPage: 1,
                translateX: 0,
                startTranslateX: 0,
                delta: 0,
                dragging: false,
                startPos: null,
                transitioning: false,
                slideEls:[]
            };
        },
        watch:{
            slides:function(){
                this.slideEls = this.$refs['swiper-wrap'].children;
            }
        },
        mounted:function(){
            this.$nextTick(function () {
                this._onTouchMove = this._onTouchMove.bind(this);
                this._onTouchEnd = this._onTouchEnd.bind(this);
                this.slideEls = this.$refs['swiper-wrap'].children;
                this.autoBegin();
            })
        },
        methods: {
            next:function() {
                var page = this.currentPage;
                if (page < this.slideEls.length) {
                    page++;
                    this.setPage(page);
                } else {
                    if (this.repeating) this.setPage(1);
                    else this._revert();
                }
            },
            autoBegin:function() {
                if (!this.auto) return;
                this.intervalId=setInterval(()=>{
                    this.next();
                }, this.auto);
            },
            autoStop:function() {
                clearInterval(this.intervalId)
            },
            prev:function() {
                var page = this.currentPage;
                if (page > 1) {
                    page--;
                    this.setPage(page);
                } else {
                    if (this.repeating) this.setPage(this.slideEls.length);
                    else this._revert();
                }
            },
            setPage:function(page) {
                if (typeof page!="number") //event
                    page=page.target?page.target.id:1;

                this.autoStop();
                var propName= 'clientWidth',
                    translateName= 'translateX';
                this.lastPage = this.currentPage;
                this.currentPage = page;
                //偏移的大小
                this[translateName] = -[].reduce.call(this.slideEls, function (total, el, i) {
                    //previousValue,currentValue,currentIndex
                    return i > page - 2 ? total : total + el[propName];
                }, 0);
                this._onTransitionStart();
                this.autoBegin();
            },
            _onTouchStart:function(e) {
                this.autoStop()
                this.startPos = this._getTouchPos(e);
                this.delta = 0;
                this.startTranslateX = this.translateX;
                this.startTime = new Date().getTime();
                this.dragging = true;
                e.stopPropagation();
                document.addEventListener('touchmove', this._onTouchMove, false);
                document.addEventListener('touchend', this._onTouchEnd, false);
                document.addEventListener('mousemove', this._onTouchMove, false);
                document.addEventListener('mouseup', this._onTouchEnd, false);
            },
            _onTouchMove:function(e) {
                this.delta = this._getTouchPos(e) - this.startPos;
                if (!this.performanceMode) {//bad android
                    this.translateX = this.startTranslateX + this.delta;
                    this.$emit('slider-move', this.translateX);
                }
                if (Math.abs(this.delta) > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            },
            _onTouchEnd:function(e) {
                this.autoBegin()
                this.dragging = false;
                var isQuickAction = new Date().getTime() - this.startTime < 1000;
                if (this.delta < -100 || (isQuickAction && this.delta < -15)) {
                    this.next();
                } else if (this.delta > 100 || (isQuickAction && this.delta > 15)) {
                    this.prev();
                } else {
                    this._revert();
                }
                document.removeEventListener('touchmove', this._onTouchMove);
                document.removeEventListener('touchend', this._onTouchEnd);
                document.removeEventListener('mousemove', this._onTouchMove);
                document.removeEventListener('mouseup', this._onTouchEnd);
            },
            _onWheel:function(e) {
                if (this.mousewheelControl) {
                    // TODO Support apple magic mouse and trackpad.
                    if (!this.transitioning) {
                        if (e.deltaY > 0) {
                            this.next();
                        } else {
                            this.prev();
                        }
                    }
                    if (this._isPageChanged()) e.preventDefault();
                }
            },
            _revert:function() {
                this.setPage(this.currentPage);
            },
            _getTouchPos:function(e) {
                var key ='pageX'
                return e.changedTouches ? e.changedTouches[0][key] : e[key];
            },
            _onTransitionStart:function() {
                this.transitioning = true;
                if (this._isPageChanged()) {
                    this.$emit('slide-change-start', this.currentPage);
                } else {
                    this.$emit('slide-revert-start', this.currentPage);
                }
            },
            _onTransitionEnd:function(e) {
                this.transitioning = false;
                if (this._isPageChanged()) {
                    this.$emit('slide-change-end', this.currentPage);
                } else {
                    this.$emit('slide-revert-end', this.currentPage);
                }
                e.stopPropagation()
            },
            _isPageChanged:function() {
                return this.lastPage !== this.currentPage;
            }
        }
    };
</script>


<style lang="less">
    .swiper {
        position: relative;
        overflow: hidden;
        .swiper-wrap {
            display: -webkit-box;
            display: -moz-box;
            display: -o-box;
            display: -ms-flexbox;
            display: flex;
            width: 100%;
            height: 100%;
            transition: all 0.4s ease;
            > div {
                  overflow: hidden;
                  flex-shrink: 0;
                  width: 100%;
                  height: 100%;
              }
        }
        &.horizontal .swiper-wrap {
             flex-direction: row;
         }
        &.dragging .swiper-wrap {
             transition: none;
         }
        .swiper-pagination {
            position: absolute;
            .swiper-pagination-bullet {
                width: 14px;
                height: 4px;
                border-radius: 0%;
                background-color: #FFF;
                opacity: .5;
                cursor:pointer
            }
            .swiper-pagination-bullet.active {
                background: #FFF;
                opacity: 0.8;
            }
        }
        &.horizontal .swiper-pagination {
             bottom: 10px;
             width: 100%;
             /*text-align: center;*/
             text-align:right;
            .swiper-pagination-bullet {
                display: inline-block;
                margin: 0 3px;
            }
        }
    }
</style>