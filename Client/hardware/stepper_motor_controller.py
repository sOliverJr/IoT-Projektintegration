import board
import time
from adafruit_motor import stepper
from adafruit_motorkit import MotorKit

kit = MotorKit(i2c=board.I2C())


class StepperController:
    def __init__(self):
        self.current_position = 0
        self.steps_for_revolution = 200

    def rotate_stepper_forward(self, amount_steps: int):
        for i in range(amount_steps):
            kit.stepper1.onestep(direction=stepper.FORWARD, style=stepper.SINGLE)

            self.current_position += 1
            if self.current_position >= 200:
                self.current_position = 0

            time.sleep(0.01)
        kit.stepper1.release()

    def rotate_stepper_backwards(self, amount_steps: int):
        for i in range(amount_steps):
            kit.stepper1.onestep(direction=stepper.BACKWARD, style=stepper.SINGLE)

            self.current_position -= 1
            if self.current_position < 0:
                self.current_position = 200

            time.sleep(0.01)
        kit.stepper1.release()

    def reset_stepper(self):
        steps_to_reset = (self.current_position - self.steps_for_revolution) * -1
        print(steps_to_reset)
        while self.current_position != 0:
            kit.stepper1.onestep(direction=stepper.BACKWARD, style=stepper.SINGLE)
            self.current_position -= 1
            time.sleep(0.01)
        kit.stepper1.release()
