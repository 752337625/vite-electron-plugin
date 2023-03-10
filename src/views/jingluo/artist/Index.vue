<template>
  <div class="artist">
    <div class="artist-container">
      <div class="artist-main">
        <div
          v-infinite-scroll="loadMore"
          class="list-container"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="100">
          <template v-for="item in list" :key="item.id">
            <ArtistItem :item="item" />
          </template>
          <template v-if="isLoading">
            <Loading />
          </template>
        </div>
      </div>
      <div class="aside-box">
        <el-affix :offset="140">
          <div class="aside-menu">
            <div class="filter">
              <div class="filter-item">
                <span
                  v-for="(item, index) in initial"
                  :key="index"
                  :class="index === initialIndex ? 'active' : ''"
                  @click="selectType('initial', index)"
                  >{{ item.label }}</span
                >
              </div>
              <div class="filter-item">
                <span
                  v-for="(item, index) in area"
                  :key="index"
                  :class="index === areaIndex ? 'active' : ''"
                  @click="selectType('area', index)"
                  >{{ item.label }}</span
                >
              </div>
              <div class="filter-item">
                <span
                  v-for="(item, index) in type"
                  :key="index"
                  :class="index === typeIndex ? 'active' : ''"
                  @click="selectType('type', index)"
                  >{{ item.label }}</span
                >
              </div>
            </div>
          </div>
        </el-affix>
      </div>
    </div>
  </div>
</template>

<script>
  import { getArtistList } from '/@/api/main';
  import Loading from '/@/components/IconLoading.vue';
  import ArtistItem from '/@/components/ArtistItem.vue';
  import { onMounted, watchEffect, reactive, toRefs } from 'vue';
  export default {
    name: 'Artist',
    components: {
      Loading,
      ArtistItem,
    },
    setup() {
      const info = reactive({
        type: [
          { label: '??????', val: -1 },
          { label: '?????????', val: 1 },
          { label: '?????????', val: 2 },
          { label: '??????', val: 3 },
        ],
        area: [
          { label: '??????', val: -1 },
          { label: '??????', val: 7 },
          { label: '??????', val: 96 },
          { label: '??????', val: 8 },
          { label: '??????', val: 16 },
          { label: '??????', val: 0 },
        ],
        initial: [
          { label: '??????', val: -1 },
          { label: '#', val: 0 },
        ],
        typeIndex: 0,
        areaIndex: 0,
        initialIndex: 0,
        params: {
          area: '',
          type: '',
          initial: '',
          limit: 30,
          offset: 0,
        },
        list: [],
        isLoading: true,
        busy: true,
      });

      const renderInitial = () => {
        const alphabet = [];
        for (let i = 0; i < 26; i++) {
          alphabet.push({
            label: String.fromCharCode(65 + i),
            val: String.fromCharCode(97 + i),
          });
        }
        info.initial = [info.initial[0], ...alphabet, info.initial[1]];
      };

      const selectType = (type, index) => {
        info[type + 'Index'] = index;
        info.list = [];
        info.params.offset = 0;
        info.params[type] = info[type][index].val;
      };

      const getArtist = async params => {
        const { code, artists, more } = await getArtistList(params);
        if (code !== 200) return ElMessage.error('??????????????????');
        info.list = info.params.offset !== 0 ? [...info.list, ...artists] : artists;
        info.busy = !more;
        info.isLoading = more;
      };

      const loadMore = () => {
        info.busy = true;
        info.params.offset = info.list.length;
      };

      onMounted(() => {
        info.params.area = info.area[info.areaIndex].val;
        info.params.type = info.type[info.typeIndex].val;
        info.params.initial = info.initial[info.initialIndex].val;
        renderInitial();
      });

      watchEffect(() => {
        getArtist(info.params);
      });

      return {
        ...toRefs(info),
        selectType,
        getArtist,
        loadMore,
      };
    },
  };
</script>
<style scoped lang="less">
  .artist-container {
    display: flex;
    padding-top: 40px;

    .artist-main {
      flex: 1;
    }
  }
  .aside-menu {
    padding: 20px 20px 1px;
    margin-bottom: 25px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  }

  .filter-item {
    font-size: 0;
    padding-bottom: 20px;

    span {
      display: inline-block;
      padding: 0 12px;
      font-size: 14px;
      line-height: 30px;
      margin-right: 6px;
      vertical-align: top;
      cursor: pointer;
      border-radius: 3px;

      &.active {
        color: #fff;
        background: #ff641e;
      }
    }
  }

  .list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 40px;
    margin-right: -40px;

    .item {
      position: relative;
      display: flex;
      width: calc(100% / 3 - 80px);
      padding: 10px 0;
      margin: 0 40px 20px;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
      transition: all 0.3s ease-in-out;

      &:hover {
        margin-left: 0;
        width: calc(100% / 3 - 40px);
        border-radius: 60px 12px 12px 60px;
        transition: all 0.3s ease-in-out;
        background: linear-gradient(135deg, #ffffff 20%, #ffb08e 100%);
        .faceImg {
          margin-left: 10px;
          border-radius: 100%;
          transition: all 0.3s ease-in-out;
        }
      }

      .circle {
        position: absolute;
        right: 10px;
        display: inline-block;
        padding: 10px;
        border-radius: 100%;
        border: 1px solid transparent;
        background: #fafafa;
        box-shadow: 0 2px 7px rgb(0 0 0 / 10%) inset;

        &::before {
          position: absolute;
          top: 6px;
          left: 6px;
          display: inline-block;
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background: #ddd;
          box-shadow: 0 2px 7px rgb(0 0 0 / 10%);
        }
      }
    }

    .faceImg {
      display: block;
      width: 100px;
      margin-left: -40px;
      font-size: 0;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
      transition: all 0.3s ease-in-out;
    }

    .info {
      flex: 1;
      padding: 0 20px;

      .name {
        display: inline-block;
        white-space: nowrap;
        max-width: 80%;
        margin-right: 10px;
        line-height: 40px;
        font-size: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
      }

      .info-num {
        display: flex;
        padding-top: 10px;
        color: @--color-text;

        span {
          flex: 1;
          display: inline-block;
          font-weight: 600;
          color: @--color-text-main;

          em {
            display: block;
            font-style: normal;
            font-size: 12px;
            font-weight: 300;
            color: @--color-text;
          }
        }
      }

      .icon-collect {
        cursor: pointer;

        &.active {
          color: @--color-text-height;
        }
      }
    }
  }
</style>
