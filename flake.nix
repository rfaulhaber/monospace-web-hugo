{
  description = "monospace-web-hugo — a Hugo port of the-monospace-web";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    supportedSystems = [
      "x86_64-linux"
      "aarch64-linux"
      "x86_64-darwin"
      "aarch64-darwin"
    ];
    forAllSystems = f:
      nixpkgs.lib.genAttrs supportedSystems
      (system: f system nixpkgs.legacyPackages.${system});
  in {
    packages = forAllSystems (system: pkgs: rec {
      # The rendered example site. `nix build` produces a result/ directory
      # ready to serve, which is also what CI publishes.
      example-site = pkgs.stdenv.mkDerivation {
        pname = "monospace-web-hugo-example";
        version = "0.2.0";
        src = ./.;

        nativeBuildInputs = [pkgs.hugo];

        # Hugo writes its module and file caches under $HOME.
        HUGO_CACHEDIR = "/build/hugo-cache";
        HUGO_ENVIRONMENT = "production";

        buildPhase = ''
          runHook preBuild
          export HOME=$(mktemp -d)
          hugo --source example --minify --destination "$PWD/public"
          runHook postBuild
        '';

        installPhase = ''
          runHook preInstall
          cp -r public $out
          runHook postInstall
        '';
      };

      default = example-site;
    });

    formatter = forAllSystems (system: pkgs: pkgs.alejandra);

    devShells = forAllSystems (system: pkgs: {
      default = pkgs.mkShell {
        packages = with pkgs; [
          hugo
          # Formats the templates and stylesheet; see `make fmt`.
          nodePackages.prettier
        ];

        shellHook = ''
          echo "monospace-web-hugo — hugo $(hugo version | cut -d' ' -f2)"
          echo "  hugo server --source example    # live preview"
          echo "  nix build                       # render the example site"
        '';
      };
    });
  };
}
