---
title: 'Push notification from Arduino Yún'
tags: ["apple", "android" ]
published: true
date: '2014-11-16'
---

![Pushetta](./push-yun-image1.png)

#  Push notification from Arduino Yún

I have often wished a system to send notifications to cell phones without paying for it (ie SMS) or using emails.

Major mobile operating systems include those that are commonly referred to as push notifications and slowly these are getting available also on Desktop system. The use of push notifications is not trivial because every system (or at least the major ones) requires to develop a custom App as receiver of notifications.

Simply put, notifications aren’t like SMS, where knowing the phone number is enough to send a message, no!! You need to develop an App and use a server provided by manufacturers of mobile operating system (ie Apple, Google, Microsoft, …) but this isn’t enough there are also some security requirements like digital certificates and other pagan rituals.

Back to the top what I needed was a simple notification system and looking around I was not able to find one, so I made Pushetta. The opportunity came from the integration of my pellet stove in Domitio, my home automation system. One of objectives was to get notified when pellet level was below a threshold, this information is important because some stoves fails to start,  when refilled, if pellet has been previously completely exhausted (mine is one of these).

![Stove](./push-yun-image2.jpg)

So, Pushetta is a simple system I made to send notifications to mobile phones (and also desktop in future), components are:

- A web site, [http://www.pushetta.com](http://www.pushetta.com)
- An API
- Some clients libraries (eg. for [Arduino Yún](https://github.com/guglielmino/arduino-pushetta-lib))
- Some Apps (for iOS, Android and Windows Phone)

Typical use case is:

- User interested in send notification register on pushetta.com
- He /She defines a Channel, that is a node where send notification
- User wants to be notified downloads the [App](http://www.pushetta.com/pushetta-downloads/)
- By the App he seeks interested channels and subscribes them
- Every time a message is “pushed” to a channel subscribers receive it

Back to my stove I made a custom shield for my Arduino Yún to interact with it, this interfaces Arduino with a ultrasonic sensor that measure pellet level and some relays to controls start and stop of the stove.

![Stove controller](./push-yun-image3.jpg)

![Ultrasonic sensor](./push-yun-image4.jpg)

So, stove controller continuously measures pellet level and when under a threshold uses Pushetta to send a notification. Sending notification from Arduino it’s really simple, nothing can explain it better than show a trivial example.

![Sample sketch](./push-yun-image5.png)

Example shown in picture is a modified version of the “Button” example found in Arduino IDE, in this version (made for Arduino Yún) when button connected to pin 2 is pressed a push notification is sent. In my stove automation system I use the same code to send notification when pellet level goes too low.

Pushetta isn’t limited to Arduino, it can be used virtually from any system can make an http post with a json payload. I used it also in an experiment with Raspberry Pi where I made a simple face recognition software who sends a push notification if I’m the subject in the camera.

I’m looking for beta tester because Pushetta is a “spare time” project but I would like to transform it in a production level software, look at www.pushetta.com if You can help me.