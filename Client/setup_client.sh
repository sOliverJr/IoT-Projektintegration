apt-get install -y python3-pip
apt-get install -y python3-venv

sudo modprobe i2c-bcm2835
sudo modprobe i2c-dev

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
deactivate