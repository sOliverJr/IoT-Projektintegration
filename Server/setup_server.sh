apt-get install python3-pip
apt-get install python3-venv
apt-get install docker.io
apt-get install docker-compose

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
deactivate