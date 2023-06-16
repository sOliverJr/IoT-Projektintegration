apt-get install -y python3-pip
apt-get install -y python3-venv

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
deactivate