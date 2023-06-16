from gpiozero import Servo
from time import sleep

servo = Servo(25)


def lock_lid():
    servo.min()
    # servo.max()


def unlock_lid():
    servo.mid()