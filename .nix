{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    (pkgs.nodePackages.pnpm.override { version = "9.4.0"; })
    # Add other packages here
  ];
}
