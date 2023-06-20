import RPi.GPIO as GPIO

# Numbering of GPIO Pins not the one on the board
GPIO.setmode(GPIO.BCM)

# Lichtsensor (5V & GND)
light_sensor_pin = 17
# Laser (GND)
laser_pin = 27

GPIO.setup(light_sensor_pin, GPIO.IN)
GPIO.setup(laser_pin, GPIO.OUT)

# Code
GPIO.output(laser_pin, GPIO.LOW)


def activate_laser_barrier():
    GPIO.output(laser_pin, GPIO.HIGH)


def deactivate_laser_barrier():
    GPIO.output(laser_pin, GPIO.LOW)


def barrier_is_closed():
    """Returns True if barrier is closed and no object is in the way"""
    if GPIO.input(light_sensor_pin) == 0:
        return True
    else:
        return False
