#!/usr/bin/env bash
# NAME=$(hyprctl clients -j | jq -r '.[] | select(.title != "") | .title' | rofi -dmenu)
# WINDOW=$(hyprctl clients -j | jq -r ".[] | select(.title == \"${NAME}\") | .address")
# hyprctl dispatch focuswindow address:${WINDOW}
#

hyprctl clients | awk '/title: ./ { gsub("\t*title: *", ""); print}' | rofi -dmenu | xargs -I{} hyprctl dispatch focuswindow "title:{}"
