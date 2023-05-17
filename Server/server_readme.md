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

# Routen
If Server backend is running: ``http://localhost:8000/docs``
## App mit Gerät verknüpfen
```REST
POST {URL}/auth_device
Request body: {"device_id": "string", "device_pwd": "string"}
Response code: 200
Response body: { device_hash }
```

## Kassette wechseln
```REST
PUT {URL}/change_cassette
Request body: {"device_id": "string", "device_hash": "string", "cassette_id": "string"}
Response code: 200
Response body: { 'Success' }
```

## Aktuell zugewiesene Kassette erhalten
```REST
POST {URL}/get_current_cassette
Request body: {"device_id": "string", "device_hash": "string"}
Response code: 200
Response body: {"cassette_id": String, "einnahme_frequenz": Integer, "einnahme_uhrzeiten": Integer[]}
```
