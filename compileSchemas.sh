#!/bin/bash

sudo cp $HOME/.config/ags/com.github.XtremeTHN.Dotfiles.Ags.gschema.xml /usr/share/glib-2.0/schemas/
sudo glib-compile-schemas /usr/share/glib-2.0/schemas
