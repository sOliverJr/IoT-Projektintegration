# Get started
## Dependencies
``pip install -r requirements.txt``

## Start docker-compose
``sudo docker-compose up -d``

## Start API
``uvicorn main:backend --reload``

# Datenstrukturen
## Geräte-Objekt
```
gerät: {
    device_id: String,
    device_pwd: String,
    device_hash: String,
    device_cassette: ID
}
```

## Kassetten-Objekt
```
kassette: {
    cassette_id: String,
    einnahme_frequenz: Integer,
    einnahme_uhrzeiten: IntegerArray[] (800, 1300, 1530, ...)
}
```
