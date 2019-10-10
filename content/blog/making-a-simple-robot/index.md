---
title: 'Making a simple robot'
tags: ["beaglebond" ]
published: true
date: '2013-11-02'
---

# Making a simple Robot

Making a robot is a big challenge, also when You say to yourself “I make only a simple robot” simple will be not so simple.

<iframe width="625" height="469" src="https://www.youtube.com/embed/c-B3EiIwta8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I started making the “simple robot” mainly because I like to make things, and I like more to make things that move. For the first version I decided to concentrate my efforts in electronic and software, for this I bought a cheap robot platform for mechanical platform (this one).

I gave to myself some goals:

- Make a WiFi connected robot
- Make use of websockets for the control interface
- Make the robot speech
- Use some simple form of shape recognition

I made many projects based on Arduino but this time I looked for something more powerful, looking in my “stuff drawer” I found a beaglebone (white one) and I choose her for the brain of the robot.

BeagleBone is an incredible platform, it can run various OS like Arch Linux (default), Ubuntu and many others. One thing that made BeagleBone a little “special” compared to others it’s expansions capabilities (65 GPIO, 8 PWM, 7 Analog input, …) and a feature I found only in this board : PRU.

PRU is acronym for Programmable Realtime Unit, BeagleBone has two of them. Essentially PRU are autonomous chip with a specific assembly instruction set capable of performing realtime task, they run separately from main OS but can communicate with it using shared memory.

![PRU-ICSS](./robot-image1.png)

PRU are essential to make tasks with high precision time constraints, like make a pulse wave modulation or, as in my case, to read short pulse from a [PING)))](http://learn.parallax.com/kickstart/28015) sensor.

PING))) sensor from parallax is cheap and theoretically really simple to use, this is true for example with Arduino but using it with BeagleBone make things a bit more difficult. This sensor works emitting an ultrasonic signal when the board send a short signal on trigger pin (40Khz), to misure distance board have to read the echo response duration. Here is where things get complicated.

Using a GPIO to read an hight frequency signal and pretend to precisely measure it is really optimistic. Isn’t a hardware problem but more a software one. GPIO on BeagleBone are handled by operating system (Linux), this is not a realtime OS so software scheduler can’t grant a precise response time to an hardware event.

In a next post I’ll show how to use PRU in BeagleBone, stay tuned!