import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      config: {
        // Mark sharp as external so it's not bundled
        experimental: {
          serverComponentsExternalPackages: ["sharp"],
        },
      },
    },
  },
};

export default config;
