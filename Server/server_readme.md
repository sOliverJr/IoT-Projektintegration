# Get started
## Dependencies
``pip install -r requirements.txt``

## Start docker-compose
``sudo docker-compose up -d``

## Start API
``python3 -m api.api``

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
GET {URL}/auth_device/{device_id}
Request header: {"device_pwd": string}
Response code: 200
Response body: {device_hash}
```

## Abfrage ob Kassette existiert
```REST
GET {URL}/cassette_exists/{cassette_id}
Request header: {"adminKey": string}
Response code: 200
Response body: {"Cassette with that ID exists"}
```

## Aktuell zugewiesene Kassette erhalten
```REST
GET {URL}/cassette/{device_id}
Request header: {"device_hash": string}
Response code: 200
Response body: {"cassette_id": String, "einnahme_frequenz": Integer, "einnahme_uhrzeiten": Integer[]}
```

## Kassette wechseln
```REST
PUT {URL}/cassette/{device_id}
Request headers: {"device_hash": string, "cassette_id": string}
Response code: 200
Response body: {'Success'}
```

## Kassetten-Informationen updaten
```REST
PATCH {URL}/cassette/{cassette_id}
Request header: {"admin_key": string}
Request body: {"cassette": dict}
Response code: 200
Response body: {cassette: dict}
```
