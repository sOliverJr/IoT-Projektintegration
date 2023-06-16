import RPi.GPIO as GPIO

# Numbering of GPIO Pins not the one on the board
GPIO.setmode(GPIO.BCM)

# Lid Switch (GND)
magnet_switch_pin = 23

# Pull-Down parameter damit es nicht selber gebaut werden muss :)
GPIO.setup(magnet_switch_pin, GPIO.IN, GPIO.PUD_UP)


def lid_is_closed():
    if GPIO.input(magnet_switch_pin) == 0:
        return False
    else:
        return True
