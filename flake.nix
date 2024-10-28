{
  description = "monospace web hugo theme";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = {
    self,
      nixpkgs,
  }: let
    projectName = "monospace-web-hugo";
    supportedSystems = ["x86_64-linux"];
    forSystems = systems: f:
      nixpkgs.lib.genAttrs systems
        (system: f system (import nixpkgs {inherit system;}));
    forAllSystems = forSystems supportedSystems;
  in {
    packages = forAllSystems (system: pkgs: {
      ${projectName} = {};
      default = self.packages.system.projectName;
    });

    formatter = forAllSystems (system: pkgs: pkgs.alejandra);

    devShells = forAllSystems (system: pkgs: {
      default = pkgs.mkShell {
        buildInputs = with pkgs; [
          hugo
        ];
      };
    });
  };
}
