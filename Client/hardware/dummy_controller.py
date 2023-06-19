

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
    return_value = True
    return return_value


def lid_is_closed():
    return_value = False
    return return_value


def button_is_pressed():
    return_value = True
    return return_value


def activate_laser_barrier():
    ...


def deactivate_laser_barrier():
    ...


def activate_light():
    ...


def deactivate_light():
    ...


def play_sound():
    ...
