#!/usr/bin/env bash

# Script obtained from https://unix.stackexchange.com/questions/146570/arrow-key-enter-menu
# Renders a text based list of options that can be selected by the
# user using up, down and enter keys and returns the chosen option.
#
#   Arguments   : list of options, maximum of 256
#                 "opt1" "opt2" ...
#   Return value: selected index (0 for opt1, 1 for opt2 ...)
function select_option {

    # little helpers for terminal print control and key input
    ESC=$( printf "\033")
    cursor_blink_on()  { printf "$ESC[?25h"; }
    cursor_blink_off() { printf "$ESC[?25l"; }
    cursor_to()        { printf "$ESC[$1;${2:-1}H"; }
    print_option()     { printf "   $1 "; }
    print_selected()   { printf "  $ESC[7m $1 $ESC[27m"; }
    get_cursor_row()   { IFS=';' read -sdR -p $'\E[6n' ROW COL; echo ${ROW#*[}; }
    key_input()        { read -s -n3 key 2>/dev/null >&2
                         if [[ $key = $ESC[A ]]; then echo up;    fi
                         if [[ $key = $ESC[B ]]; then echo down;  fi
                         if [[ $key = ""     ]]; then echo enter; fi; }

    # initially print empty new lines (scroll down if at bottom of screen)
    for opt; do printf "\n"; done

    # determine current screen position for overwriting the options
    local lastrow=`get_cursor_row`
    local startrow=$(($lastrow - $#))

    # ensure cursor and input echoing back on upon a ctrl+c during read -s
    trap "cursor_blink_on; stty echo; printf '\n'; exit" 2
    cursor_blink_off

    local selected=0
    while true; do
        # print options by overwriting the last lines
        local idx=0
        for opt; do
            cursor_to $(($startrow + $idx))
            if [ $idx -eq $selected ]; then
                print_selected "$opt"
            else
                print_option "$opt"
            fi
            ((idx++))
        done

        # user key control
        case `key_input` in
            enter) break;;
            up)    ((selected--));
                   if [ $selected -lt 0 ]; then selected=$(($# - 1)); fi;;
            down)  ((selected++));
                   if [ $selected -ge $# ]; then selected=0; fi;;
        esac
    done

    # cursor position back to normal
    cursor_to $lastrow
    printf "\n"
    cursor_blink_on

    return $selected
}

echo "Select one option using up/down keys and enter to confirm:"
echo

options=(
    "Authentication Hub"
    "Detection and Response Service"
    "Email OTP Authentication"
    "Email OTP Authentication (Backend)"
    "SMS OTP Authentication"
    "SMS OTP Authentication (Backend)"
    "Google Authentication"
    "Token Validation"
    "Identity Verification (Hosted)"
    "Magic Link Authentication"
    "Multi Factor Authentication"
    "Multi Factor Authentication (Backend)"
    "Password Authentication"
    "Password Authentication (Backend)"
    "SAML IDP"
    "WebAuthn Passkey Authentication (autocomplete)"
    "WebAuthn Logged In Users"
    "WebAuthn Logged Out Users"
    "WebAuthn Cross Device Logged In Users"
    "WebAuthn Cross Device Logged Out Users"
)
optdir=(
    "authentication-hub"
    "password-authentication-drs"
    "login-with-email"
    "login-with-be-email"
    "login-with-sms"
    "login-with-be-sms"
    "login-with-google"
    "login-with-email"
    "hosted-idv"
    "login-with-magiclink"
    "login-with-mfa"
    "login-with-be-mfa"
    "password-authentication"
    "password-be-authentication"
    "saml-idp"
    "passkey-authentication"
    "webauthn-for-logged-in-users"
    "webauthn-for-logged-out-users"
    "webauthn-cross-device-for-logged-in-users"
    "webauthn-cross-device-for-logged-out-users"
)

select_option "${options[@]} "
choice=$?
