### Start docker-compose
``sudo docker-compose up -d``

### Geräte-Objekt
```
gerät: {
    device_id: String,
    device_pwd: String,
    device_hash: String,
    device_cassette: ID
}
```

### Kassetten-Objekt
```
kassette: {
    id: String,
    einnahmefrequenz: IntegerArray[] (Einnahmeuhreiten) (Zweidimensional??)
}
```
