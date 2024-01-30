<script setup lang='ts'>
import { useStore } from '@/store'
import http from '@/http/http'
import dayjs from 'dayjs';
import SortTab from '@/components/SortTab.vue'
const loading = ref(true)
const state = useStore()

const data: any = ref({})
http("get", "/common/getAdminHomeData").then(res => {
  data.value = res.data
  loading.value = false
  state.loading = false
})
const classNames = ["one", "two", "three", "four", "five", "six"]

</script>

<template>
  <el-space direction="vertical" alignment="flex-start" class="" style="width: 100%;">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <section class="section">
          <div class="left-content">
            <div class="activities">
              <h1>热门内容</h1>
              <div class="activity-container">
                <div v-for="(item, index) in [1, 2, 3, 4, 5, 6]" :key="index" class="image-container"
                  :class="'img-' + classNames[index]">
                  <el-skeleton-item variant="image" style="height: 100%;" />
                  <div class="overlay">
                    <h3><el-skeleton-item variant="text" /></h3>
                  </div>
                </div>
              </div>
            </div>

            <div class="left-bottom">
              <div class="weekly-schedule">
                <h1>最新内容</h1>
                <div class="calendar">
                  <el-skeleton-item variant="text" class="day-and-activity" v-for="(item, index) in data.newArticle"
                    :key="index" style="width: 550px;height:54px" />
                </div>
              </div>
              <div class="personal-bests">
                <h1>系统详情</h1>
                <el-skeleton-item variant="image" style="width: 400px;height:350px;border-radius: 15px;" />
                <div class="overlay" style="align-items:center">
                  <el-skeleton-item variant="text" style="margin-bottom: 10px;width:90%;" />
                </div>
              </div>
            </div>
          </div>

          <div class=" right-content">
            <div class="user-info">
              <div class="icon-container">
                <lzyicon height="25px" name="material-symbols:circle-notifications-outline" />
                <lzyicon height="25px" name="material-symbols:notification-multiple-outline" />
              </div>
              <h4>欢迎访问</h4>
              <!-- <img src="/api/public/img/heard.jpg" alt="user" /> -->
            </div>

            <div class="active-calories">
              <div class="active-calories-container">
                <div class="box" style="--i: 85%">
                  <div class="circle">
                    <h2>85<small>%</small></h2>
                  </div>
                </div>
                <div class="calories-content">
                  <p><span>今日:</span> 400</p>
                  <p><span>本周:</span> 3500</p>
                  <p><span>本月:</span> 14000</p>
                </div>
              </div>
            </div>


            <div class="friends-activity">
              <h1>最新评论</h1>
              <div class="card-container">
                <div class="card">
                  <div class="card-user-info">
                    <img
                      src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/9290037d-a5b2-4f50-aea3-9f3f2b53b441"
                      alt="" />
                    <h2>Jane</h2>
                  </div>
                  <img class="card-img"
                    src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/bef54506-ea45-4e42-a1b6-23a48f61c5e8"
                    alt="" />
                  <p>We completed the 30-Day Running Streak Challenge!🏃‍♀️🎉</p>
                </div>

                <div class="card card-two">
                  <div class="card-user-info">
                    <img
                      src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/42616ef2-ba96-49c7-80ea-c3cf1e2ecc89"
                      alt="" />
                    <h2>Mike</h2>
                  </div>
                  <img class="card-img"
                    src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/2dcc1b94-06c5-4c62-b886-53b9e433fd44"
                    alt="" />
                  <p>I just set a new record in cycling: 30 miles!💪</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
      <template #default>
        <section class="section">
          <div class="left-content">
            <div class="activities">
              <h1>热门内容</h1>
              <div class="activity-container">
                <div v-for="(item, index) in data.hotArticle" :key="index" class="image-container"
                  :class="'img-' + classNames[index]">
                  <img :src="'/api/public' + item.cover_img" :alt="item.title" />
                  <div class="overlay">
                    <h3>{{ item.title }}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div class="left-bottom">
              <div class="weekly-schedule">
                <h1>最新内容</h1>
                <div class="calendar">
                  <div v-for="(item, index) in data.newArticle" :key="index" class="day-and-activity"
                    :class="'activity-' + classNames[index]">
                    <div class="day">
                      <h1>{{ dayjs(item.createTime).format('MM/DD') }}</h1>
                      <p>{{ dayjs(item.createTime).format('YYYY') }}</p>
                    </div>
                    <div class="activity">
                      <h2>{{ item.title }}</h2>
                      <div class="participants">

                      </div>
                    </div>
                    <button class="btn">查看</button>
                  </div>
                </div>
              </div>

              <div class="personal-bests">
                <h1>系统详情</h1>
                <SortTab :articleType="data.articleType"></SortTab>
              </div>
            </div>
          </div>

          <div class="right-content">
            <div class="user-info">
              <div class="icon-container">
                <lzyicon height="25px" name="material-symbols:circle-notifications-outline" />
                <lzyicon height="25px" name="material-symbols:notification-multiple-outline" />
              </div>
              <h4>欢迎访问</h4>
              <!-- <img src="/api/public/img/heard.jpg" alt="user" /> -->
            </div>

            <div class="active-calories">
              <div class="active-calories-container">
                <div class="box" style="--i: 85%">
                  <div class="circle">
                    <h2>85<small>%</small></h2>
                  </div>
                </div>
                <div class="calories-content">
                  <p><span>今日:</span> 400</p>
                  <p><span>本周:</span> 3500</p>
                  <p><span>本月:</span> 14000</p>
                </div>
              </div>
            </div>

            <div class="mobile-personal-bests">
              <h1>系统详情</h1>
              <div class="personal-bests-container">
                <div class="best-item box-one">
                  <p>Fastest 5K Run: 22min</p>
                  <img
                    src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/05dfc444-9ed3-44cc-96af-a9cf195f5820"
                    alt="" />
                </div>
                <div class="best-item box-two">
                  <p>Longest Distance Cycling: 4 miles</p>
                  <img
                    src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/9ca170e9-1252-4fa6-8677-36493540c1f2"
                    alt="" />
                </div>
                <div class="best-item box-three">
                  <p>Longest Roller-Skating: 2 hours</p>
                  <img
                    src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/262d1611-ed4c-4297-981c-480cf7f95714"
                    alt="" />
                </div>
              </div>
            </div>

            <div class="friends-activity">
              <h1>最新评论</h1>
              <div class="card-container">
                <div class="card">
                  <div class="card-user-info">
                    <img
                      src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/9290037d-a5b2-4f50-aea3-9f3f2b53b441"
                      alt="" />
                    <h2>Jane</h2>
                  </div>
                  <img class="card-img"
                    src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/bef54506-ea45-4e42-a1b6-23a48f61c5e8"
                    alt="" />
                  <p>We completed the 30-Day Running Streak Challenge!🏃‍♀️🎉</p>
                </div>

                <div class="card card-two">
                  <div class="card-user-info">
                    <img
                      src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/42616ef2-ba96-49c7-80ea-c3cf1e2ecc89"
                      alt="" />
                    <h2>Mike</h2>
                  </div>
                  <img class="card-img"
                    src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/2dcc1b94-06c5-4c62-b886-53b9e433fd44"
                    alt="" />
                  <p>I just set a new record in cycling: 30 miles!💪</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </el-skeleton>
  </el-space>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&family=Roboto:wght@300;400;500;700&display=swap");

#content::after {
  opacity: 0;
  width: 0
}
</style>
<style lang='less' scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/* CONTENT */
.section {
  display: grid;
  grid-template-columns: 75% 25%;
  height: 100%;
  width: 100%;
}

/* LEFT CONTENT */

.left-content {
  display: grid;
  grid-template-rows: 50% 50%;
  background: #EEF7FF;
  margin: 15px;
  padding: 20px;
  border-radius: 15px;
}

/* ACTIVITIES */

.activities h1 {
  margin: 0 0 20px;
  font-size: 1.4rem;
  font-weight: 700;
}

.activity-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 175px);
  column-gap: 10px;
}

.img-one {
  grid-area: 1 / 1 / 2 / 2;
}

.img-two {
  grid-area: 2 / 1 / 3 / 2;
}

.img-three {
  display: block;
  grid-area: 1 / 2 / 3 / 4;
}

.img-four {
  grid-area: 1 / 4 / 2 / 5;
}

.img-five {
  grid-area: 1 / 5 / 2 / 6;
}

.img-six {
  display: block;
  grid-area: 2 / 4 / 3 / 6;
}

.image-container {
  position: relative;
  margin-bottom: 10px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px;
  border-radius: 10px;
}

.image-container img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.overlay {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg,
      transparent,
      transparent,
      rgba(3, 3, 185, 0.5));
  border-radius: 10px;
  transition: all 0.6s linear;
}

.image-container:hover {
  overflow: hidden;

  img {
    transform: scale(1.1);
    transition: all 0.2s linear;

  }

  .overlay {
    background: linear-gradient(180deg,
        transparent,
        transparent,
        rgba(59, 59, 116, 0.8));
    transition: all 0.6s linear;
    cursor: pointer;

    h3 {
      transition: all 0.2s linear;
      transform: translateX(-20px);
      max-width: clamp(0px, 60%, 60%);
    }
  }
}

.overlay h3 {
  margin-bottom: 8px;
  margin-right: 10px;
  color: #fff;
  overflow: hidden;
  max-width: 83px;
  text-wrap: nowrap;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* LEFT BOTTOM */

.left-bottom {
  display: grid;
  grid-template-columns: 55% 40%;
  gap: 20px;
}

/* WEEKLY SCHEDULE */

.weekly-schedule {
  display: flex;
  flex-direction: column;
}

.weekly-schedule h1 {
  margin-top: 20px;
  font-size: 1.3rem;
  font-weight: 700;
}

.calendar {
  margin-top: 10px;
}

.day-and-activity {
  display: grid;
  grid-template-columns: 15% 70% 15%;
  align-items: center;
  border-radius: 14px;
  margin-bottom: 5px;
  color: #484d53;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px;

  &:last-child {
    margin-bottom: 0;
  }
}

.activity-one {
  background-color: rgb(124, 136, 224, 0.5);
  background-image: linear-gradient(240deg,
      rgb(124, 136, 224) 0%,
      #c3f4fc 100%);
}

.activity-two {
  background-color: #aee2a4a1;
  background-image: linear-gradient(240deg, #e5a243ab 0%, #f7f7aa 90%);
}

.activity-three {
  background-color: #ecfcc376;
  background-image: linear-gradient(240deg, #97e7d1 0%, #ecfcc3 100%);
}

.activity-four {
  background-color: #e6a7c3b5;
  background-image: linear-gradient(240deg, #fc8ebe 0%, #fce5c3 100%);
}

.activity-five {
  background-color: #e6a7c3b5;
  background-image: linear-gradient(240deg, #9795f0 0%, #fbc8d4 100%);
}

.activity-six {
  background-color: #e6a7c3b5;
  background-image: linear-gradient(240deg, #feada6 0%, #f5efef 100%);
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(-10px);
  font-family: 'dindin';
}

.day h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.day p {
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  transform: translateY(-3px);
}

.activity {
  border-left: 3px solid #484d53;
}

.participants {
  display: flex;
  margin-left: 20px;
}

.participants img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  z-index: calc(2 * var(--i));
  margin-left: -10px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px;
}

.activity h2 {
  margin-left: 10px;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn {
  display: block;
  padding: 3px 10px;
  margin: 10px auto;
  font-size: 1.3rem;
  font-weight: 600;
  outline: none;
  text-decoration: none;
  color: #484b57;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 6px 30px rgb(255 0 0 / 10%);
  border-radius: 5px;
  cursor: pointer;
  font-family: 'almama';

}

.btn:hover,
.btn:focus,
.btn:active,
.btn:visited {
  transition-timing-function: cubic-bezier(0.6, 4, 0.3, 0.8);
  animation: gelatine 0.5s 1;
}

@keyframes gelatine {

  0%,
  100% {
    transform: scale(1, 1);
  }

  25% {
    transform: scale(0.9, 1.1);
  }

  50% {
    transform: scale(1.1, 0.9);
  }

  75% {
    transform: scale(0.95, 1.05);
  }
}

/* PERSONAL BESTS */

.personal-bests {
  position: relative;
  display: block;
}

.personal-bests h1 {
  margin-top: 20px;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
}


.best-item {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px;
}

.box-one {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  grid-area: 1 / 1 / 2 / 3;
  background-color: rgba(185, 159, 237, 0.6);
  padding: 15px;
  font-size: 1rem;
  font-weight: 700;
}

.box-one img {
  max-width: 100px;
  aspect-ratio: 4/3;
}

.box-two {
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 10px;
  grid-area: 2 / 1 / 3 / 2;
  background-color: rgba(238, 184, 114, 0.6);
}

.box-two img {
  max-width: 90px;
  aspect-ratio: 3/2;
  align-self: flex-end;
}

.box-three {
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 10px;
  grid-area: 2 / 2 / 3 / 3;
  background-color: rgba(184, 224, 192, 0.6);
}

.box-three img {
  max-width: 70px;
  aspect-ratio: 1/1;
  align-self: flex-end;
}

/* RIGHT CONTENT */

.right-content {
  display: grid;
  grid-template-rows: 5% 20% 75%;
  background: #EEF7FF;
  margin: 15px 15px 15px 0;
  padding: 10px 0;
  border-radius: 15px;
  font-size: 16px;
  font-family: 'dindin';
}

/* USER INFO */

.user-info {
  display: grid;
  grid-template-columns: 30% 55% 15%;
  align-items: center;
  padding: 0 10px;
}

.icon-container {
  display: flex;
  gap: 15px;
}

.user-info h4 {
  margin-left: 40px;
}

.user-info img {
  width: 40px;
  aspect-ratio: 1/1;
  border-radius: 50%;
}

/* ACTIVE CALORIES  */

.active-calories {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(214, 227, 248);
  padding: 0 10px;
  margin: 15px 10px 0;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px;
}

.active-calories-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
}

.calories-content p {
  font-size: 12px;
}

.calories-content p span {
  font-weight: 700;
  font-size: 1.3rem;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  padding: 10px 0;
  /* width: 200px; */
}

.box h2 {
  position: relative;
  text-align: center;
  font-size: 1.35rem;
  color: rgb(91, 95, 111);
  font-weight: 600;
}

.box h2 small {
  font-size: 0.8rem;
  font-weight: 600;
}

.circle {
  position: relative;
  width: 80px;
  aspect-ratio: 1/1;
  background: conic-gradient(from 0deg,
      #590b94 0%,
      #590b94 0% var(--i),
      #b3b2b2 var(--i),
      #b3b2b2 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle::before {
  content: "";
  position: absolute;
  inset: 10px;
  background-color: rgb(214, 227, 248);
  border-radius: 50%;
}

/* MOBILE PERSONAL BESTS  */

.mobile-personal-bests {
  display: none;
}

/* FRIEND ACTIVITIES  */

.friends-activity {
  display: flex;
  flex-direction: column;
}

.friends-activity h1 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 15px 0 10px 15px;
}

.card-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  background-color: #fff;
  margin: 0 10px;
  padding: 5px 7px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px;
}

.card-two {
  display: block;
}

.card-user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 5px;
}

.card-user-info img {
  width: 25px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
}

.card-user-info h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-left: 5px;
}

.card-img {
  display: block;
  width: 100%;
  aspect-ratio: 7/4;
  margin-bottom: 10px;
  object-fit: cover;
  border-radius: 10px;
  object-position: 50% 30%;
}

.card p {
  font-size: 0.9rem;
  padding: 0 5px 5px;
}

.el-space {
  width: 100%;
  height: 100%;

  & :deep(.el-space__item) {
    width: 100%;
    height: 100%;
  }
}

@media (max-width: 1500px) {
  main {
    grid-template-columns: 6% 94%;
  }

  .main-menu h1 {
    display: none;
  }

  .logo {
    display: block;
    width: 30px;
    margin: 20px auto;
  }

  .nav-text {
    display: none;
  }

  .content {
    grid-template-columns: 70% 30%;
  }
}

@media (max-width: 1310px) {
  main {
    grid-template-columns: 8% 92%;
    margin: 30px;
  }

  .content {
    grid-template-columns: 65% 35%;
  }

  .day-and-activity {
    margin-bottom: 10px;
  }

  .btn {
    padding: 8px 16px;
    margin: 10px 0;
    margin-right: 10px;
    font-size: 1rem;
  }

  .personal-bests-container {
    grid-template-rows: repeat(3, 98px);
    gap: 15px;
  }

  .box-one {
    flex-direction: row;
    justify-content: space-between;
    grid-area: 1 / 1 / 2 / 3;
    padding: 10px;
    font-size: 0.9rem;
  }

  .box-one img {
    max-width: 80px;
  }

  .box-two {
    flex-direction: row;
    justify-content: space-between;
    grid-area: 2 / 1 / 3 / 3;
  }

  .box-two img {
    max-width: 70px;
    align-self: center;
  }

  .box-three {
    flex-direction: row;
    justify-content: space-between;
    grid-area: 3 / 1 / 4 / 3;
  }

  .box-three img {
    max-width: 60px;
    align-self: center;
  }

  .right-content {
    grid-template-rows: 4% 20% 76%;
    margin: 15px 15px 15px 0;
  }
}

@media (max-width: 1150px) {
  .content {
    grid-template-columns: 60% 40%;
  }

  .left-content {
    grid-template-rows: 50% 50%;
    margin: 15px;
    padding: 20px;
  }

  .btn {
    padding: 8px 8px;
    font-size: 0.9rem;
  }

  .personal-bests-container {
    grid-template-rows: repeat(3, 70px);
    gap: 10px;
  }

  .activity-container {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 150px);
  }

  .img-one {
    grid-area: 1 / 1 / 2 / 2;
  }

  .img-two {
    grid-area: 2 / 1 / 3 / 2;
  }

  .img-three {
    display: none;
  }

  .img-four {
    grid-area: 1 / 2 / 2 / 3;
  }

  .img-five {
    grid-area: 1 / 3 / 2 / 4;
  }

  .img-six {
    grid-area: 2 / 2 / 3 / 4;
  }

  .left-bottom {
    grid-template-columns: 100%;
    gap: 0;
  }

  .right-content {
    grid-template-rows: 4% 19% 36% 41%;
  }

  .personal-bests {
    display: none;
  }

  .mobile-personal-bests {
    display: block;
    margin: 0 10px;
  }

  .mobile-personal-bests h1 {
    margin-top: 20px;
    font-size: 1.2rem;
  }

  .card-two {
    display: none;
  }

  .card-img {
    aspect-ratio: 16/9;
  }
}

@media (max-width: 1050px) {
  .right-content {
    grid-template-rows: 5% 19% 36% 40%;
  }
}

@media (max-width: 910px) {
  main {
    grid-template-columns: 10% 90%;
    margin: 20px;
  }

  .content {
    grid-template-columns: 55% 45%;
  }

  .left-content {
    grid-template-rows: 50% 50%;
    padding: 30px 20px 20px;
  }

  .activity-container {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 150px);
  }

  .img-one {
    grid-area: 1 / 1 / 2 / 2;
  }

  .img-two {
    grid-area: 2 / 1 / 3 / 2;
  }

  .img-three {
    display: none;
  }

  .img-four {
    grid-area: 1 / 2 / 2 / 3;
  }

  .img-five {
    grid-area: 2 / 2 / 3 / 3;
  }

  .img-six {
    display: none;
  }
}

@media (max-width: 800px) {
  .content {
    grid-template-columns: 52% 48%;
  }
}

@media (max-width: 700px) {
  main {
    grid-template-columns: 15% 85%;
  }

  .content {
    grid-template-columns: 100%;
    grid-template-rows: 45% 55%;
    grid-template-areas:
      "rightContent"
      "leftContent";
  }

  .left-content {
    grid-area: leftContent;
    grid-template-rows: 45% 55%;
    padding: 10px 20px 10px;
  }

  .right-content {
    grid-area: rightContent;
    grid-template-rows: 5% 40% 50%;
    margin: 15px 15px 0 15px;
    padding: 10px 0 0;
    gap: 15px;
  }

  .activities,
  .weekly-schedule {
    margin-top: 10px;
  }

  .active-calories-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .friends-activity {
    display: none;
  }
}
</style>
