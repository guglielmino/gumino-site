---
title: 'Linking iOS App from Web'
tags: ["apple", "swift" ]
published: true
date: '2015-07-30'
---

# Linking iOS App from Web

Nowadays almost all web sites  match with a mobile Application. Users jump from web to Apps and back, making this experience as fluid as possibile is becoming really important. In this post I’d like to explain the standard approach to this problem and how I get an enhanced solution to it.

![Link animation](./linkios-image1.gif)

## Standard approach

Before describing the standard approach we need to explain how an iOS App can be launched from a web site and how this is typically used.

iOS Apps comes with a configuration file named Info.plist who gives all the parameters needed by the iOS runtime to execute the App itself. Some of these parameters are  App name, supported screen orientations, default language and many others. One of these is URLscheme  who is a powerful system to launch the App from outside.

Looking to a snippet of Info.plist took from my App Pushetta it looks as follow:

```
<key>CFBundleURLSchemes</key>
<array>
<string>pushetta</string>
</array>
```

What this mean? It simply says the App can be executed with a custom url, in this case the url is pushetta://. So first step is now clear, if a web page has a link with this url schema, loading it on a device with the App installed and using the link the App is started. WOW this is great!!! But wait a moment, if the App isn’t installed? Ehm, we get an error.

![Link animation](./linkios-image2.jpg)

Error is self explaining, we tried to open an url Safari doesn’t understand. This freezes our initial enthusiasm.

The standard solutions comes in mind is to check if the App is installed before running the custom url. BEEEEEEEP!!! This isn’t possible! For (obvious) privacy problems a web page can’t inspect the device to known if a specific App is installed.

Ok, so we are at dead end, we know how to execute the App from web page but we don’t know how to be sure is installed before this.

Some clever people made a work around to this problem with a trick based on JavaScript setTimeout function. The idea behind the solution is: we start a timer that when expire executes a function whose redirects the user to a predefined url (it can be for example a landing page with info about the App and a link to the store). Right after the start of the timer the script try to launch the App with the custom url, so we get two scenarios:

- App is installed: it runs and the timer never fires (this because running the App brings the user outside the browser)
- App isn’t installed: we get the error but after awhile we get redirected to a predefined page

The code for this solution is

```
   setTimeout(function(){
                window.location = "http://www.pushetta.com";
              }, 1000);
   document.location = "pushetta://";
```

The code make exactly what we described: it sets a timer function that after one second (1000 milliseconds) redirects the user to http://www.pushetta.com. Next it tries to run pushetta:// custom url scheme and this implies the two scenarios described.

This is a pretty poor solution, it works but with a bad user experience. This is where I started to look for a better solution, googling around wasn’t productive so I decided to make some tries. My starting point was: I can’t check if the App is installed but if I could handle the error on opening a wrong url this would be enough to resolve the problem. This is simplest to say that to do, window.location gives an error when we try to open a wrong url but it seems not trappable by code. So how can we do? The solution I used is based on a iframe. As many know an iframe is something like an hole (squared) inside the page who loads another url, the idea is: if I create an iframe in the DOM with it’s src set to the custom schema, will it show the error popup when the schema is wrong (ie the App is not installed)? Luckily enough this doesn’t happen and so we can implement the right solution based on this behaviour.

```
// timer func to bring the user to a web page if App isn't installed
   setTimeout(function(){
            document.location = "http://www.pushetta.com";
        }, 1000);

   // put an iframe in the DOM with "pushetta://" as src (and 0x0 dimensions)
   ifrm = document.createElement("IFRAME"); 
   ifrm.setAttribute("src", "pushetta://"); 
   ifrm.style.width = 0+"px"; 
   ifrm.style.height = 0+"px"; 
            
   document.body.firstElementChild.appendChild(ifrm);
```

The solution seems to work well but I consider it a test to be verified with various scenarios.

