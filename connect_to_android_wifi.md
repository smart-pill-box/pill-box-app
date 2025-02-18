
```shell
adb devices
```
```shell
adb -s <device name> reverse tcp:8081 tcp:8081
```

- Abra o aplicativo no celular
- Ele vai dar erro
- Vá para Dev Settings → Debug server host & port for device
- Insira o IP do computador e porta 8081
