import sensor, image, time, ustruct, ubinascii
from pyb import USB_VCP,LED

led = LED(1)
usb = USB_VCP()
sensor.reset()                      # 重置感光模組
sensor.set_pixformat(sensor.RGB565) # 將像素格式設定為RGB565
sensor.set_framesize(sensor.QVGA)   # 將解析度設定為QVGA(320*240)
sensor.skip_frames(10)              # 等待設定生效

while(True):
    clock = time.clock()
    img = sensor.snapshot().compress()
    usb.send(ubinascii.b2a_base64(img))
