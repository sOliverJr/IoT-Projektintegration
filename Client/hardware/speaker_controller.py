import RPi.GPIO as GPIO
import time


# Numbering of GPIO Pins not the one on the board
GPIO.setmode(GPIO.BCM)

buzzer_pin = 24

GPIO.setup(buzzer_pin, GPIO.OUT)
GPIO.output(buzzer_pin, GPIO.LOW)


def beep_beep():
    GPIO.output(buzzer_pin, GPIO.HIGH)
    time.sleep(0.2)
    GPIO.output(buzzer_pin, GPIO.LOW)
    time.sleep(0.5)
    GPIO.output(buzzer_pin, GPIO.HIGH)
    time.sleep(0.2)
    GPIO.output(buzzer_pin, GPIO.LOW)


def play_sound():
    beep_beep()
    time.sleep(1)
    beep_beep()
