apt-get install -y python3-pip
apt-get install -y python3-venv
apt-get install -y docker.io
apt-get install -y docker-compose

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
deactivate