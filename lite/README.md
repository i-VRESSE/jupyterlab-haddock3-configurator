# JupyterLite

Deploy extension inside [Jupyterlite](https://jupyterlite.readthedocs.io/).

This will run extension without a server backend, just hosting of static files will suffice.

## Build

First build extension with

```shell
jlpm build:prod
python -m build
```

In another virtual env

Install jupyterlite with

```shell
python -m pip install -r lite/requirements.txt
```

Install extension

```shell
pip install haddock3_configurator*.whl
```

Fill content with example cfg

```shell
cd lite
mkdir -p content/data
cp ../../haddock3/examples/docking-protein-protein/docking-protein-protein-test.cfg content/
cp ../../haddock3/examples/docking-protein-protein/data/e2a-hpr_1GGR.pdb content/data/
cp ../../haddock3/examples/docking-protein-protein/data/e2a-hpr_air.tbl content/data/
cp ../../haddock3/examples/docking-protein-protein/data/e2aP_1F3G.pdb content/data/
cp ../../haddock3/examples/docking-protein-protein/data/hpr_ensemble.pdb content/data/
cd ..
```

Stuff in `lite/content/` will show in Jupyterlite file browser.

Build JupyterLite dist

```shell
cd lite
jupyter lite build --contents content --output-dir ../_site
```

Host it

```shell
python3 -m http.server --directory _site 8888
```
