from datetime import date, datetime
from dotenv import load_dotenv, set_key
# Hardware functions
from hardware.stepper_motor_controller import StepperController
from hardware.magnet_switch_controller import lid_is_closed
from hardware.servo_motor_controller import lock_lid, unlock_lid
from hardware.output_button_controller import button_is_pressed
from hardware.laser_barrier_controller import barrier_is_closed, activate_laser_barrier, deactivate_laser_barrier
from hardware.led_controller import activate_light, deactivate_light
from hardware.speaker_controller import play_sound
# from hardware.dummy_controller import *                                  # Dummy Hardware Funktionen
from interfaces.server_api import get_device_cassette, post_intake_message
import os
from pathlib import Path
from pprint import pprint
import threading
import time


cassette_changed = False
intake_frequency = 0
intake_times = []

current_day = None
last_intake_date = None
todays_intakes = []
current_cassette = None
current_cassette_count = 0
cassette_is_empty = False

stepper_controller = StepperController()

env_file_path = Path(".env")
load_dotenv()
device_id = os.getenv('DEVICE_ID')
device_pwd = os.getenv('DEVICE_PWD')
device_hash = os.getenv('DEVICE_HASH')
current_cassette_id = None
cassette_fields = int(os.getenv('CASSETTE_FIELDS'))
# TODO cassette_fields should probably be gotten by database


def _reset_day():
    global intake_times
    global todays_intakes
    todays_intakes = []

    for intake_time in intake_times:
        todays_intakes.append([intake_time, False])
    pprint(todays_intakes)


def get_new_cassette():
    global intake_frequency
    global intake_times
    global device_id
    global device_hash
    new_cassette = get_device_cassette(device_id, device_hash)
    intake_frequency = new_cassette['einnahmeFrequenz']
    intake_times = new_cassette['einnahmeUhrzeiten']
    print('New intake frequency: ' + str(intake_frequency))
    print('New intake times: ' + str(intake_times))


def get_date():
    return date.today().strftime("%d%m%Y")


def get_time():
    return int(datetime.now().strftime('%H%M'))


def intake_is_due():
    global todays_intakes
    for intake in todays_intakes:
        # Wenn zu der Uhrzeit noch nicht eingenommen wurde
        if not intake[1]:
            # Wenn es Einnahmezeit ist
            if intake[0] == get_time():
                intake[1] = True
                print('[CLIENT] The ' + str(intake[0]) + ' intake is due')
                return True, intake[0]
    return False, None


def change_cassette():
    global current_cassette_count
    global cassette_changed
    global cassette_is_empty
    print('[CLIENT] Replacing device cassette')
    stepper_controller.reset_stepper()

    get_new_cassette()
    print('[CLIENT] Unlocking the lid')
    unlock_lid()

    print('[CLIENT] Waiting for user to open the lid')
    while lid_is_closed():        # wait until lid is opened
        continue
    print('[CLIENT] User opened the lid')

    print('[CLIENT] Waiting for user to close the lid')
    while not lid_is_closed():    # wait until lid is closed
        continue
    print('[CLIENT] User closed the lid')

    time.sleep(5)

    print('[CLIENT] Locking the lid')
    lock_lid()
    current_cassette_count = 0
    cassette_changed = False
    cassette_is_empty = False


def sound_controller(last_alarm_time):
    """
    Plays sound if elapsed time >= 5min
    Returns current time if sound was played
    Returns last_alert_time if no sound was played
    """
    current_time = datetime.now()
    delta_time = current_time - last_alarm_time
    if int(delta_time.seconds / 60) >= 5:
        print('[OUTPUT MEDS THREAD] Five minutes have passed, playing sound')
        play_sound()
        return datetime.now()
    else:
        return last_alarm_time


def output_meds_thread(should_time):
    global current_cassette_count
    global device_id
    global device_hash
    global cassette_is_empty
    start_time = datetime.now()
    last_alarm_time = datetime.now()
    activate_light()

    # Wait until button is pressed
    print('[OUTPUT MEDS THREAD] Waiting for user to press the button')
    while not button_is_pressed():
        last_alarm_time = sound_controller(last_alarm_time)
    print('[OUTPUT MEDS THREAD] Button was pressed')

    print('[OUTPUT MEDS THREAD] Activating laser barrier')
    activate_laser_barrier()
    while not barrier_is_closed():
        last_alarm_time = sound_controller(last_alarm_time)

    print('[OUTPUT MEDS THREAD] Dispensing meds')
    # Dispense meds
    stepper_controller.rotate_stepper_forward(10)       # One cassette-field

    # Wait for meds to fall down
    print('[OUTPUT MEDS THREAD] Waiting for meds to open the laser barrier')
    while barrier_is_closed():
        last_alarm_time = sound_controller(last_alarm_time)

    time.sleep(2)

    # Wait until meds are taken
    print('[OUTPUT MEDS THREAD] Waiting for user to take the meds')
    while not barrier_is_closed():
        last_alarm_time = sound_controller(last_alarm_time)
    print('[OUTPUT MEDS THREAD] Meds were taken')

    print('[OUTPUT MEDS THREAD] Deactivating laser barrier')
    deactivate_laser_barrier()
    deactivate_light()

    current_time = datetime.now()
    delta_time = current_time - start_time
    if int(delta_time.seconds / 60) >= 15:
        print('[OUTPUT MEDS THREAD] Intake was late, posting message')
        post_intake_message(device_id, device_hash, should_time, get_time(), get_date())

    current_cassette_count += 1
    if current_cassette_count >= cassette_fields:
        print('[OUTPUT MEDS THREAD] ATTENTION: cassette is now empty')
        cassette_is_empty = True

    print('[OUTPUT MEDS THREAD] Intake successfull, terminating thread')


def update_cassette_thread():
    global current_cassette_id
    global env_file_path
    global cassette_changed
    print('[CLIENT] Thread (update_cassette_thread) started')
    while True:
        new_cassette_id = get_device_cassette(device_id, device_hash)['cassette_id']
        if current_cassette_id != new_cassette_id:
            print('[UPDATE CASSETTE THREAD] New cassette assigned to device')
            current_cassette_id = new_cassette_id
            set_key(dotenv_path=env_file_path, key_to_set="CURRENT_CASSETTE_ID", value_to_set=new_cassette_id)
            cassette_changed = True
        time.sleep(1)


def start_client():
    global cassette_changed
    global last_intake_date
    global current_cassette_count
    global cassette_fields
    global cassette_is_empty
    try:
        x = threading.Thread(target=update_cassette_thread, daemon=True)        # daemon=True -> thread gets killed when script terminates
        x.start()
        while True:
            if cassette_changed:
                change_cassette()
                _reset_day()
                last_intake_date = get_date()
            if cassette_is_empty:       # Don't do anything while the cassette is empty
                continue
            if last_intake_date != get_date():
                _reset_day()
                last_intake_date = get_date()
            intake_is_due_result, due_time = intake_is_due()
            if intake_is_due_result:
                x = threading.Thread(target=output_meds_thread, args=(due_time, ))
                x.start()

    except KeyboardInterrupt:
        print('[CLIENT] Exiting')
        unlock_lid()
        pass


if __name__ == "__main__":
    start_client()
