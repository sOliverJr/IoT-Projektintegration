

class StepperController:
    def rotate_stepper_forward(self, zahl):
        ...

    def rotate_stepper_backwards(self):
        ...

    def reset_stepper(self):
        ...


def lock_lid():
    ...


def unlock_lid():
    ...


def barrier_is_closed():
    return True


def lid_is_closed():
    return True


def button_is_pressed():
    return True
