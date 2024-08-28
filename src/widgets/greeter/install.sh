#!/bin/bash
set -e

PREFIX=$HOME/.config/ags/src/widgets/greeter

sudo bun build $PREFIX/main.ts --outdir /etc/greetd --external "resource://*" --external "gi://*"
sudo sass $PREFIX/styles/main.scss /etc/greetd/style.css
sudo cp $PREFIX/profile_config.json /etc/greetd/
