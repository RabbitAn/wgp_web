import { defineConfig, presetIcons } from "unocss";
import presetUno from "@unocss/preset-uno";
import presetAttributify from "@unocss/preset-attributify";

export default defineConfig({
  presets: [
    presetIcons({ scale: 1.2, extraProperties: { display: "inline-block" } }),
    presetUno(),
    presetAttributify(),
  ],
  theme: {
    colors: {
      // 可以在这里自定义颜色
    },
  },
  shortcuts: {
    // 可以在这里定义快捷方式
  },
});
