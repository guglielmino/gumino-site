---
title: 'Air Pollution monitor - part 1'
tags: ["esp32", "arduino" ]
published: true
date: '2020-05-25'
---

# Air Pollution monitor - part 1

This is the first part of two articles on monitoring air pollution with a DIY smart sensor.

Air Pollution is a topic about which everyone heard something at least once (I'm sure nobody heard about it ONLY once :-) ). It's a very important topic and we need to care a lot more about it.

COVID-19 global emergency forced everyone to wonder what are root causes for a so scaring plague. Viruses are always been part of human life but what we figured out in this case is they can hit very hard. We are a technological society, and before the emergency we were strongly convinced to be able to control nature (hey, we went on the Moon! How, a very small piece of proteins, can hurt us?).

Science is trying to find a way to manage the emergency, finding a vaccine is one of the priorities right now. At the same time a long debate has started, to understand what environment conditions helped in spreading the Virus around so fast. There are for sure a lot but many scientists seems to agree about one: **Air Pollution**


## Air pollution, does we need to care about?

Air pollution is a term to indicate presence in the air of substances potentially harmful. There are a lot of substances that can be defined with this term but two are very dangerous: **PM10** and **PM2.5** 

I'm not the right person to give a full description on what these substances are, and why they are so dangerous, there are a lot of trustable source for that, let's spend only a few words about. Firts of all PM means Particulate Matter (or Pollution Matter), the number after the PM word indicate the size in micron of the particle. So PM10 means a Particle Matter with size up to 10 micrometers. To give a simple comparision a human hair diameter is 50-70 micron.

Now, there are many sources for these particles, naturals like soil erosion, and artificials like domestic heating, traffic, industry and so on. Of course, there are a lot of studies on the effect of human health caused by the PMs, and its internationally recognised that effects are very bad.

![EEA Signals 2013](./images/air_pollution_image1.png)

Source [EEA Signals 2013](https://www.eea.europa.eu/media/infographics/air-pollution-from-emissions-to-exposure/view)



## You can't control what you don't measure

Given the premise it's quite obvious that monitoring PM10 and PM2.5 is fundamental, in fact many governments have programs about air pollution monitor, with control units around the country. Control units are normally displaced in the center of big cities and their data isn't always public accessible.  
The project presented here is a way to allow anyone to contribute to a open and distributed network of air quality sensors, providing public accessible data.

The idea is quite simple: using a ESP32 SoC and a air quality sensor, we'll sample data and send it to a IoT platform. In this first part we'll focus on reading data and displaying it, next part focus on sending data to a IoT platform.

So, what PM10 and PM2.5 ranges are considered dangerous? There indications are called AQI (Air Quality Index) and index levels depends on the region. 

![European Index Levels](./images/air_pollution_image6.png)
Source [European Environment Agency](https://airindex.eea.europa.eu)

As you can see in the table, in the European Union, recomended maximum concentration for PM2.5 is under 20µg/m3 and under 40µg/m3 for PM10. Those levels changes a little bit for other areas but in general they aren't so different.

## Introducing the project: hardware required

Defined what we want to achieve it's time to get what we need. In fact we need only two components: the ESP32 SoC and the sensor.
ESP32 is available in many flavours, we'll use a powerful device expressly thought for rapid prototyping and testing: M5Stack. 

### M5Stack, army knife for IoT

ESP32 doesn't need presentation, in the last few years it becomes one of the main player in IoT world. In our case we are going to use the M5Stack, that is a small device, based on a ESP32 boundled with a lot of peripherials.

![M5Stack Internal](./images/air_pollution_image7.jpg)

![M5Stack](./images/air_pollution_image8.jpg)

We are going to use it to read data from the sensor and displaying PMs values on his screen. Since ESP32 is equipped with WiFi the next step will be to connect it to the internet, and send data acquired to an IoT platform, visualizing pollution information on the web.

To program the M5Stack we are using Arduino IDE as development environment, that's a good choise for fast prototyping a solution.

### SDS011 air quality sensor, measure PM10 and PM2.5

Sampling air pollution is today quite simple because the introduction of small components specialized on this topic. For our project we selected the SDS011.

SDS011 sensor is able to measure PM10 and PM2.5 in a quite reliable way. 
It uses a laser scattering principle as described in the [datasheet](https://www-sd-nf.oss-cn-beijing.aliyuncs.com/%E5%AE%98%E7%BD%91%E4%B8%8B%E8%BD%BD/SDS011%20laser%20PM2.5%20sensor%20specification-V1.4.pdf). In simple terms there is a correlation between laser waveform and particle diameter, SDS011 is able to measure vaweform changes and give back a (quite precise) estimation on particles in µg/m3.

Let's get out hands dirty playing with the sensor 🤓

![Sensor Image](./images/air_pollution_image2.jpg)

SDS011 comes provided with a handly TTL to USB adapter, that means it can be connected to a computer to read data from it. In my case, I used [CoolTerm](https://freeware.the-meiers.org/) but it can be used any serial port terminal. It could be necessary to install driver to support the USB to serial adapter, that depends on the operating system used.

![Sensor serial data](./images/air_pollution_image3.gif)

Connected the sensor and opened the serial port (connection parameter are 9600 N81) we can see the data coming from it. It sends 10bytes on a 1Hz frequency following the the schema below. 

| Header | Cmd  | DATA1 | DATA2 | DATA3 | DATA4 | DATA5 | DATA6 | Checksum | Tail |
|--------|------|-------|-------|-------|-------|-------|-------|----------|------|
| 0xAA   | 0xC0 | 0x??  | 0x??  | 0x??  | 0x??  | 0x??  | 0x??  | 0x??     | 0xAB | 

Important data for our scope are DATA1 and DATA2, where PM2.5 value is stored and DATA3 and DATA4, where PM10 is. Both are stored in a 16 bit word in little endian order, so PM2.5 low byte is DATA2 and high byte is DATA1, same for DATA3 and DATA4 for PM10.

Given a sample from our connection we can calculate PM2.5 and PM10 values as follow.

```
PM2.5 = ((DATA2 * 256) + DATA1) / 10
PM10  = ((DATA4 * 256) + DATA3) / 10
```

## Let's start

Before starting we need to setup the environment, we need the Arduino IDE and enable it to write code for the M5Stack. The procecure is very well described [here](https://docs.m5stack.com/#/en/arduino/arduino_development) then I assume that everything is already setup.

As seen before, using the air quality sensor is very simple, for our project we want to create a smart sensor, able to show information about pollution and send it to the cloud without a PC.

Let's start wiring the sensor, as shown in the following schematic it is trivial, in fact we 4 wires only, two for the power, taken directly from the M5Stack, the other two for UART RX and TX.

![Wiring](./images/air_pollution_image4.png)

Time to write some code. Application core is reading data from the serial interface, for that Arduino library for M5Stack provides some global objects bound on the UART ports. As visible from the schematic, we are using pin 16 and 17 of M5Stack, these pins are bound to RX and TX of `Serial2`. The last info we need is the serial speed, num bits, parity and stop bit, this is specified in the SDS011 datasheet as: 9600, 8bits, no parity 1 bit stop, so to initialize the communication we have:

```
Serial2.begin(9600, SERIAL_8N1, 16, 17);
```

Reading the SDS011 message is matter of a single call of the Arduino Stream class.

```
// buffer to store the SDS011 message
byte buffer[10] = {};

// Marker byte for SDS011 message end
byte DATA_END_MARK = 0xAB;

Serial2.readBytesUntil(DATA_END_MARK, buffer, 10);
```

As we know from the sensor's datasheet, it sends a messages composed by 10 bytes with 0xAB as ending byte marker. The code above is an implementation to read a single message.

Of course, reading the message is the first step, we need to extract and convert data from the raw buffer in meaningful PM2.5 and PM10 values.

```
float pm25 = ((buffer[3] * 256) + buffer[2]) / 10.0;
float pm10 = ((buffer[5] * 256) + buffer[4]) / 10.0;
```

Easy enough, it's a trivial conversion from a little endian 16 bit word and a division.

At this point the worst is over, we can show on M5Stack display the values, and using the M5Stack library this is pretty straightforward.

```
M5.Lcd.clear(WHITE);
M5.Lcd.setCursor(5, 10);
M5.Lcd.printf("PM2.5 %.2f ug/m3",airQuality.pm25);
M5.Lcd.setCursor(5, 40);
M5.Lcd.printf("PM10  %.2f ug/m3",airQuality.pm10);
```

And here the result

![Air Pollution Monitor](./images/air_pollution_image5.gif)

## Tesing and moving ahead 

To test the device we need a source of air pollution (it should be easy enough to find one :-) ). One simple way is to put the sensor close to a car exhaust muffler or close to a cooking pan and see how values grow up very quickly.

We achieved or first goal, reading and displaying PM2,5 and PM10 values next step is to transform it in a IoT sensor, trasmitting data to a cloud IoT platform and displaying the informations on the web, stay tuned!


### Hardware components

| Component                                                                                                                                                                                        | Quantity |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| [SDS011 Air Quality Sensor Module](https://www.digitspace.com/sds011-air-quality-sensor-module?0c8bd709c6a0e011)                                                                                 |    x1    |
| [M5Stack ESP32 GREY Development Kit](https://www.digitspace.com/products/wireless-iot/wifi/esp/m5stack-esp32-grey-development-kit?0c8bd709c6a0e011)                                                                                 |    x1    |



# Sources

[Project source code](https://github.com/guglielmino/air_pollution_monitor)