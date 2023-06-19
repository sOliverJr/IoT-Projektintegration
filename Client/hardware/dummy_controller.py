

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
    return False


def button_is_pressed():
    return True


def activate_laser_barrier():
    ...


def deactivate_laser_barrier():
    ...


def active_light():
    ...


def deactivate_light():
    ...


def play_sound():
    ...
