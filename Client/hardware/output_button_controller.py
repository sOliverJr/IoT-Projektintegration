import RPi.GPIO as GPIO

# Numbering of GPIO Pins not the one on the board
GPIO.setmode(GPIO.BCM)

# Lid Switch (GND)
output_button_pin = 22

# Pull-Down parameter damit es nicht selber gebaut werden muss :)
GPIO.setup(output_button_pin, GPIO.IN, GPIO.PUD_UP)


def button_is_pressed():
    if GPIO.input(output_button_pin) == 0:
        return True
    else:
        return False
