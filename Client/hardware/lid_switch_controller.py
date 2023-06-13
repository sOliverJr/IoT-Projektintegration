import RPi.GPIO as GPIO

# Numbering of GPIO Pins not the one on the board
GPIO.setmode(GPIO.BCM)

# Lid Switch (GND)
lid_switch_pin = 18

# Pull-Down parameter damit es nicht selber gebaut werden muss :)
GPIO.setup(lid_switch_pin, GPIO.IN, GPIO.PUD_UP)


def switch_is_on():
    if GPIO.input(lid_switch_pin) == 0:
        return False
    else:
        return True
