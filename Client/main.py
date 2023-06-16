from pprint import pprint
from hardware.stepper_motor_controller import StepperController
from hardware.magnet_switch_controller import lid_is_closed
from hardware.servo_motor_controller import lock_lid, unlock_lid
from interfaces.server_api import get_device_cassette
from datetime import date, datetime
from dotenv import load_dotenv, set_key
import os
import time
from pathlib import Path
import threading


running = False
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
current_cassette_id = os.getenv('CURRENT_CASSETTE_ID')
cassette_fields = int(os.getenv('CASSETTE_FIELDS'))
# TODO cassette_fields should probably be gotten by database


def _reset_day():
    global intake_times
    global todays_intakes
    todays_intakes = []

    for time in intake_times:
        todays_intakes.append([time, False])
    pprint(todays_intakes)


def get_new_cassette():
    global intake_frequency
    global intake_times
    global device_id
    global device_hash
    new_cassette = get_device_cassette(device_id, device_hash)
    intake_frequency = new_cassette['einnahme_frequenz']
    intake_times = new_cassette['einnahme_uhrzeiten']
    print('New intake frequency: ' + str(intake_frequency))
    print('New intake times: ' + str(intake_times))


def get_date():
    return date.today().strftime("%Y%m%d")


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
                return True
    return False


def change_cassette():
    global running
    global current_cassette_count
    global cassette_changed
    global cassette_is_empty
    print('[CLIENT] Getting new cassette')
    stepper_controller.reset_stepper()

    unlock_lid()
    get_new_cassette()
    current_cassette_count = 0

    while lid_is_closed:        # wait until lid is opened
        continue

    while not lid_is_closed:    # wait until lid is closed
        continue

    lock_lid()
    running = True
    cassette_changed = False
    cassette_is_empty = False


def output_meds():
    global current_cassette_count
    stepper_controller.rotate_stepper_forward(10)       # One cassette-field
    current_cassette_count += 1


def update_cassette_thread():
    global current_cassette_id
    global env_file_path
    global cassette_changed
    new_cassette_id = get_device_cassette(device_id, device_hash)
    if current_cassette_id != new_cassette_id:
        current_cassette_id = new_cassette_id
        set_key(dotenv_path=env_file_path, key_to_set="CURRENT_CASSETTE_ID", value_to_set=new_cassette_id)
        cassette_changed = True
    time.sleep(1)


def start_client():
    global running
    global cassette_changed
    global last_intake_date
    global current_cassette_count
    global cassette_fields
    global cassette_is_empty
    try:
        x = threading.Thread(target=update_cassette_thread, daemon=True)        # deamon=True -> thread gets killed when script terminates
        x.start()
        while True:
            if cassette_changed or not running:
                change_cassette()
                continue
            if cassette_is_empty:       # Don't do anything while the cassette is empty
                continue
            if last_intake_date != get_date():
                _reset_day()
                last_intake_date = get_date()
            if intake_is_due():
                output_meds()
                if current_cassette_count >= cassette_fields:
                    print('[CLIENT] ATTENTION: cassette is now empty')
                    cassette_is_empty = True

    except KeyboardInterrupt:
        print('[CLIENT] Exiting')
        pass


if __name__ == "__main__":
    start_client()
