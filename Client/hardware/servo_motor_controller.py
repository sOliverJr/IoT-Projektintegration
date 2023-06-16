import RPi.GPIO as GPIO
import time


servoPIN = 25
# Possible servo positions
# 2,5 -> cable side
# 7,5 -> middle
# 12,5 -> opposed cable side
unlocked_position = 12.5
locked_position = 7.5


GPIO.setmode(GPIO.BCM)
GPIO.setup(servoPIN, GPIO.OUT)
p = GPIO.PWM(servoPIN, 50)          # GPIO as PWM with 50Hz

p.start(locked_position)


def set_servo_cycle(position):
    p.ChangeDutyCycle(position)
    time.sleep(0.5)


def lock_lid():
    set_servo_cycle(locked_position)
    # servo.max()


def unlock_lid():
    set_servo_cycle(unlocked_position)
