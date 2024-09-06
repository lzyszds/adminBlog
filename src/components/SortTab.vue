<script setup lang="ts">
import * as echarts from "echarts";
import { useEventListener } from "@vueuse/core";
// let { articleType } = defineProps<{ articleType: any }>()
onMounted(() => {
  try {
    var chartDom = document.getElementById("main") as HTMLDivElement;
    let myChart = echarts.init(chartDom);
    let option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Evaporation"],
      },
      grid: {
        top: 30,
        left: 30,
        height: 290,
      },
      xAxis: [
        {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "在线时长",
          min: 0,
          max: 360,
          interval: 60,
          axisLabel: {
            formatter: (value) => {
              if (value < 60) return value + " min";
              else return Math.floor(value / 60) + " h";
            },
          },
        },
      ],
      series: [
        {
          name: "在线时长",
          type: "bar",
          tooltip: {
            valueFormatter: (value) => {
              if (value < 60) {
                return value + " min";
              } else {
                return Number(value / 60).toFixed(2) + " h";
              }
            },
          },
          data: [165, 84, 0, 149.2, 25.6, 76.7, 135.6],
        },
      ],
    };
    option && myChart.setOption(option);
  } catch (e) {
    console.log(e);
  }
});

useEventListener("resize", () => {
  let myChart = echarts.getInstanceByDom(
    document.getElementById("main") as HTMLDivElement
  );
  console.log("🚀 ~ useEventListener ~ myChart:", myChart)
  myChart!.resize();
});
</script>

<template>
  <div class="main" id="main"></div>
</template>

<style lang="scss" scoped>
.main {
  overflow: hidden;
  width: auto;
  height: calc(100% - 35px);
  margin-top: 10px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
