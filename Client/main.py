from pprint import pprint
from hardware.lid_button_controller import lid_is_open
from hardware.stepper_motor_controller import rotate_stepper_motor
from interfaces.server_api import get_device_cassette
from datetime import date, datetime
from dotenv import load_dotenv
import os


running = False
cassette_changed = False
intake_frequency = 0
intake_times = []

current_day = None
last_intake_date = None
todays_intakes = []
current_cassette_count = 0
cassette_is_empty = False

load_dotenv()
device_id = os.getenv('DEVICE_ID')
# device_pwd = os.getenv('DEVICE_PWD')
device_hash = os.getenv('DEVICE_HASH')
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
    get_new_cassette()
    current_cassette_count = 0
    running = True
    cassette_changed = False
    cassette_is_empty = False


def output_meds():
    global current_cassette_count
    rotate_stepper_motor()
    current_cassette_count += 1
    # current_cassette_count = 16


def start_client():
    global running
    global cassette_changed
    global last_intake_date
    global current_cassette_count
    global cassette_fields
    global cassette_is_empty
    try:
        while True:
            while lid_is_open():
                cassette_changed = True
            if cassette_changed or not running:
                change_cassette()
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
