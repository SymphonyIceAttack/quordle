{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  dotenv = {
    disableHint = true;
    enable = true;
    filename = ".env.crush";
  };
  # https://devenv.sh/services/
  # services.postgres.enable = true;

  tasks."biome:check" = {
    exec = "npx biome check --write";
    before = [ "devenv:enterShell" ];
  };

}
