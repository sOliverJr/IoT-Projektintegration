import RPi.GPIO as GPIO
import time


# Numbering of GPIO Pins not the one on the board
GPIO.setmode(GPIO.BCM)

blinking = False

# LEDs (GND)
led_1_pin = 5
led_2_pin = 6

GPIO.setup(led_1_pin, GPIO.OUT)
GPIO.setup(led_2_pin, GPIO.OUT)

# Code
GPIO.output(led_1_pin, GPIO.LOW)
GPIO.output(led_2_pin, GPIO.LOW)


def activate_light():
    global blinking
    blinking = True


def deactivate_light():
    global blinking
    blinking = False


while True:
    if blinking:
        GPIO.output(led_1_pin, GPIO.HIGH)
        GPIO.output(led_2_pin, GPIO.HIGH)
        time.sleep(0.5)
        GPIO.output(led_1_pin, GPIO.LOW)
        GPIO.output(led_2_pin, GPIO.LOW)
