import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    artPlayerInstance: null as Artplayer | null,
  }),
  actions: {
    setPlayerInstance(instance: Artplayer | null) {
      this.artPlayerInstance = instance;
    },
    destroyPlayerInstance() {
      if (this.artPlayerInstance) {
        try {
          console.log("销毁 Artplayer 实例");
          this.artPlayerInstance.pause();
          this.artPlayerInstance.destroy(true);
          this.artPlayerInstance = null;
          console.log("Artplayer 实例已销毁");
        } catch (error) {
          console.error("销毁 Artplayer 时发生错误:", error);
        }
      }
    },
  },
});
