# haddock3_configurator

[![Github Actions Status](https://github.com/i-VRESSE/jupyterlab-haddock3-configurator/workflows/Build/badge.svg)](https://github.com/i-VRESSE/jupyterlab-haddock3-configurator/actions/workflows/build.yml)[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/i-VRESSE/jupyterlab-haddock3-configurator/main?urlpath=lab)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.7034466.svg)](https://doi.org/10.5281/zenodo.7034466)
[![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8B%20%20%E2%97%8F%20%20%E2%97%8B-orange)](https://fair-software.eu)

Edit [haddock3](https://github.com/haddocking/haddock3) config file in [Jupyter Lab]().

Features:

- Create a new haddock3 config file from the Jupyter Lab launcher
- Open a haddock3 config file, edit it and save it

Quirks:

- To save press save button followed by CTRL-s

![Image](screenshot.png)

See running in JupyterLite at [https://i-vresse.github.io/jupyterlab-haddock3-configurator/](https://i-vresse.github.io/jupyterlab-haddock3-configurator/).

## Requirements

- JupyterLab >= 3.0

## Install

To install the extension, execute:

```bash
pip install https://github.com/i-VRESSE/jupyterlab-haddock3-configurator/releases/download/v0.1.1/haddock3_configurator-0.1.1-py3-none-any.whl
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall haddock3_configurator
```

## Usage

To open haddock3 configurator widget

1. In launcher
2. Click on `Haddock3 config` in other category

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the haddock3_configurator directory
# Install package in development mode
pip install jupyterlab
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# @i-vresse/wb-form needs @rjsf/core" "^4.2.2
# @jupyterlab/ui-components needs @rjsf/core" "^3.1.0"
# This gives Typescript conflig so drop older d.ts file
# vite defers `import.meta.url` till runtime, but webpack gives build error so create dummy files
jlpm prepare:dev
# You might need to re-run pip install again

# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall haddock3_configurator
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlab-haddock3-configurator` within that folder.

### Testing the extension

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)
