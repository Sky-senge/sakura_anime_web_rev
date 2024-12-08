<template>
  <Navbar />
  <div class="filter-container">
    <div class="tab">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === tab.name }"
        @click="activeTab = tab.name"
      >{{ tab.label }}</button>
    </div>
    <div v-for="(tab, index) in tabs" :key="index" :class="{ tabcontent: true, active: activeTab === tab.name }">
      <div v-if="tab.name === 'anime'">
        <div class="filter-wrapper">
          <div class="filter-section">
            <span class="filter-label">类型</span>
            <span
              v-for="(type, typeIndex) in types"
              :key="typeIndex"
              :class="{ 'filter-option': true, active: selectedType === type }"
              @click="selectedType = type"
            >{{ type }}</span>
          </div>
          <div class="filter-section">
            <span class="filter-label">地区</span>
            <span
              v-for="(region, regionIndex) in regions"
              :key="regionIndex"
              :class="{ 'filter-option': true, active: selectedRegion === region }"
              @click="selectedRegion = region"
            >{{ region }}</span>
          </div>
          <div class="filter-section">
            <span class="filter-label">年份</span>
            <span
              v-for="(year, yearIndex) in years"
              :key="yearIndex"
              :class="{ 'filter-option': true, active: selectedYear === year }"
              @click="selectedYear = year"
            >{{ year }}</span>
          </div>
          <div class="filter-section">
            <span class="filter-label">语言</span>
            <span
              v-for="(language, languageIndex) in languages"
              :key="languageIndex"
              :class="{ 'filter-option': true, active: selectedLanguage === language }"
              @click="selectedLanguage = language"
            >{{ language }}</span>
          </div>
          <div class="filter-section">
            <span class="filter-label">字母</span>
            <span
              v-for="(letter, letterIndex) in letters"
              :key="letterIndex"
              :class="{ 'filter-option': true, active: selectedLetter === letter }"
              @click="selectedLetter = letter"
            >{{ letter }}</span>
          </div>
          <button class="reset-button" @click="resetFilters">重新筛选</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navbar from '/src/components/navbar-component.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    Navbar
  },
  setup() {
    // 选项卡数据
    const tabs = [
      // { name: 'selected', label: '已选' },
      { name: 'anime', label: '番剧' }
    ];
    const activeTab = ref('anime');

    // 类型数据
    const types = [
      '全部', '热血', '奇幻', '动作', '科幻', '喜剧', '治愈', '冒险', '后宫', '百合', '校园',
      '青春', '恋爱', '爱情', '日常', '耽美', '推理', '悬疑', '机战', '运动', '战争', '战斗',
      '励志', '职场', '泡面番', '其他'
    ];
    const selectedType = ref('全部');

    // 地区数据
    const regions = ['全部', '日本', '大陆', '香港', '台湾', '韩国', '美国', '其它'];
    const selectedRegion = ref('全部');

    // 年份数据
    const years = [
      '全部', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015',
      '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2006', '2005', '2004'
    ];
    const selectedYear = ref('全部');

    // 语言数据
    const languages = ['全部', '日语', '国语', '英语', '粤语', '韩语', '其它'];
    const selectedLanguage = ref('全部');

    // 字母数据
    const letters = [
      '全部', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0-9'
    ];
    const selectedLetter = ref('全部');

    // 重置筛选方法
    const resetFilters = () => {
      selectedType.value = '全部';
      selectedRegion.value = '全部';
      selectedYear.value = '全部';
      selectedLanguage.value = '全部';
      selectedLetter.value = '全部';
    };

    return {
      tabs,
      activeTab,
      types,
      selectedType,
      regions,
      selectedRegion,
      years,
      selectedYear,
      languages,
      selectedLanguage,
      letters,
      selectedLetter,
      resetFilters
    };
  }
});
</script>

<style scoped>
/* 整体容器样式 */
.filter-container {
  background-color: #181818;
  color: white;
  padding: 20px;
  width: 100%;
  height: 300px;
  margin: 0 auto;
}

/* 选项卡样式 */
.tab {
  overflow: hidden;
  border-bottom: 1px solid #444;
  margin-bottom: 20px;
}

.tab button {
  background-color: inherit;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  color: white;
}

.tab button.active {
  border-bottom: 2px solid orange;
}

.tabcontent {
  display: none;
  padding: 6px 12px;
}

.tabcontent.active {
  display: block;
}

/* 新增筛选容器样式 */
.filter-wrapper {
  border: 1px solid #444;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
}

/* 筛选区域样式 */
.filter-section {
  margin-bottom: 10px;
}

.filter-label {
  margin-right: 10px;
}

.filter-option {
  cursor: pointer;
  margin-right: 10px;
}

.filter-option.active {
  color: orange;
}

/* 重新筛选按钮样式 */
.reset-button {
  background-color: orange;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
}
</style>