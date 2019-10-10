---
title: 'Domitio'
tags: ["linux" ]
published: true
date: '2013-03-23'
---

# Domitio

Domitio is a classic always open project with a no real end. Its purpose is to automate some house tasks like:

- Handling sprinkler timers
- Handling house temperature
- Managing electrical power
- …


Some tasks already works some other partially and others are still in development. Domitio is deliberately an heterogeneous system, I used (and presumably I’ll use) many different devices and technologies for many reasons. First because advancing slowly technology evolve and solutions used in past are overcome by new (and often cheap) ones.

![Domitio board](./domitio-image1.jpg)

An example of this is the sprinkler controller, this was made (about three years ago) using a [Fox Board G20](http://www.acmesystems.it/FOXG20), today most likely I would choose a different hardware and maybe a different approach. Evolving speed of technology is a common problem in industry, in my case without market requirements I can choose what I like when I like it, but in a industrial approach this isn’t the right way.

Working with different technologies which contribute to the same goal it’s a good challenge because I need to face many problems. First I need a “glue” to make different parts communicate each other, this glue is made by protocols and software.

For the software I chosen  Python as main language, but I used also C/C++ for some parts. Talking of protocols I started looking for one specifically made for domotics, I found many but  I got the impression that often are vendor specific, closed or based on obsoletes ideas. Out of curiosity some of these are X-10, UPB, Z-Wave, Insteon… Abandoned these protocols I decided to use the today ubiquitous TCP/IP as transport and web protocols as Application layer.

At this time Domitio is made of these components:

- Sprinkler control (fox board G20)
- Gas boiler controlled by Arduino with bluetooth shield
- Pellet stove controlled by Arduino Yún



