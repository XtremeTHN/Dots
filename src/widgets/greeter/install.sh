#!/bin/bash
set -e

PREFIX=$HOME/.config/ags/src/widgets/greeter

echo :: Create a user named greetd and add it to the video group

sudo bun build $PREFIX/main.ts --outdir /etc/greetd --external "resource://*" --external "gi://*"
sudo sass $PREFIX/styles/main.scss /etc/greetd/style.css
sudo cp $PREFIX/profile_config.json $PREFIX/hyprland.conf /etc/greetd/
sudo cp $PREFIX/config.toml /etc/greetd

echo Done
