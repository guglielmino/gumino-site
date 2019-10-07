---
title: 'Writing Apps for Apple TV for fun and (no) profit'
tags: ["swift", "appletv" ]
published: true
date: '2016-01-03'
---

# Writing Apps for Apple TV for fun and (no) profit

## A new AppleTV

On 9th September 2015 Apple announced a new version of Apple TV, the fourth-generation, and it brings a long awaited feature: Apps.

Many times I asked myself why Apple didn’t enabled Apps on Apple TV. Advantages are obvious to me: iOS is one of the most widespread mobile OS and the one with highest number of Apps. Porting Apps to Apple TV can be really simple and this make it the platform for TV with the higher number of Apps.

Eventually Apple did it and better than I could imagine. Apps for Apple TV can be made with classical approach, like we develop native Apps for other iOS devices, or in a new way based on a specific markup language and JavaScript. The latter is really interesting and at the same time strange for Apple standard, what I’d like to do in this article is make a simple example to explore this new way.

## TVML, TVJS and TVMLKit

Apps made with this new way use three new technologies, precisely TVML, a markup language made to create the UI (TVML stands for TV Markup Language). TVJS, a  JavaScript API to display and interact with TVML, and TVMLKit, the native layer to combine all together.  I’m a big fan of learning by examples approach so let’s start with a sample.

![A simple tvOS App](./appletv-image1.png)

Before starting make the example a few words on TVMLKit App’s architecture, this kind of Application is made of two parts: one native and one JavaScript.

![Architecture](./appletv-image2.png)

In a nutshell native code is something like a container which load startup JavaScript and give control to it. JavaScript and resources can be loaded from a remote server (ie a web server) so our App can be remotely updated after released on the App Store without making a new submission (this is one reason because I wrote this model is strange for Apple). So we’ll start making the native part, I assume You have XCode 7.1 or higher.

Launch XCode a choose tvOS Single View Application.

![Architecture](./appletv-image3.png)

Standard template for tvOS Application includes some files we don’t need, so first operation is to trash `ViewController.swift` and `Main.storyboard`, these will be not used in our example. We need to change some settings too, default template is made to use storyboard UI, we removed Main.storyboard and so delete “Main” in Main interface setting (You can also remove this by opening Info.plist file and removing “Main storyboard file base name” key). 

![](./appletv-image4.png)

Last operation is to permit to the App to make HTTP requests to outside world, with iOS 9 Apple introduced transport security setting and by default it blocks all networks requests. So open Info.plist file and add **App Transport Security** Setting like in the following image (**“Allow Arbitrary Loads”** set to YES is the mandatory part).

![](./appletv-image5.png)

## Let’s write the code

Now it’s time to modify AppDelegate, we have to delete all methods put by XCode, import TVMLKit and make AppDelegate class conform to TVApplicationControllerDelegate.

```
import UIKit
import TVMLKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {
    var window: UIWindow?
}

```
In this state our App isn’t able to do much so we need to add the code to bootstrap the JavaScript which represents the real core of the App. What we need to do is create a TVApplicationController giving to it necessary info to load the JavaScript code which handle UI.

```
import UIKit
import TVMLKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {

    var window: UIWindow?

    var appController: TVApplicationController?
    static let TVBaseURL = "http://localhost:9001/"
    static let TVBootURL = "\(AppDelegate.TVBaseURL)/app.js"
    
    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        window = UIWindow(frame: UIScreen.mainScreen().bounds)
        
        // Controller context for loading JavaScript
        let appControllerContext = TVApplicationControllerContext()
        // Url from which to load javascript
        appControllerContext.javaScriptApplicationURL = NSURL(string: AppDelegate.TVBootURL)!
        // BASEURL variable will be available in the JavaScript code
        appControllerContext.launchOptions["BASEURL"] = AppDelegate.TVBaseURL
        
        // Standard controller for tvOS Apps based on TVMLKit
        appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)
        return true
    }
}
```


First we set two variables with the base URL where to load scripts from, TVBaseURL, and the URL of the bootstrap script, TVBootURL. After we need to implement didFinishLaunchingWithOptions, this method is called on Application start and here we did two logical operations:

- Create a TVApplicationControllerContext used to load JavaScript
- Create a TVApplicationController, passing to it the previous TVApplicationControllerContext, to handle Application lifecycle
That’s all we need for the native part of our App, now it’s time to move to the JavaScript side.

## The JavaScript side

Native part of App loads a simple JavaScript, creates a new folder in the root of the project where to put the code. Call it “js”, now creates a app.js file and put the following code in it.

```
App.onLaunch = function(options) {
  var menu = mainMenu(); 
  navigationDocument.presentModal(menu);
}
 
var mainMenu = function() {
  var tvmlCode = `<?xml version="1.0" encoding="UTF-8" ?>
   <document>
   <mainTemplate>
      <background>
         <img src="https://c1.staticflickr.com/7/6050/6350327968_33f008d9c2_b.jpg" />
      </background>
      <menuBar>
         <section>
            <menuItem>
               <title>PLAY</title>
            </menuItem>
            <menuItem>
               <title>SCENES</title>
            </menuItem>
            <menuItem>
               <title>EXTRAS</title>
            </menuItem>
         </section>
      </menuBar>
   </mainTemplate>
</document>
`
    var parser = new DOMParser();
    var menuDoc = parser.parseFromString(tvmlCode, "application/xml");
    return menuDoc
}
```

As I already wrote JavaScript is the real core of our application. `App.launch` is the entry point of the code, it’s called when the script is loaded by `TVApplicationController`. In launch there is a first interaction with TVJS API, `navigationDocument`. This object is used to present views on the screen in few different ways, it’s something comparable to `UINavigationController` if You wrote some native code for iOS.

The code is pretty simple, launch method calls mainMenu function, this function uses DOMParser to make a document object starting from a TVML template. The interesting part is tmvCode variable which contains TMVL code to make the user interface. TVML is a custom XML which defines the UI elements, it starts alway with <document> element and contains many different children elements who renders on the screen in different ways. In our simple case we used <background> to put an image on the background and <menuBar> for the menu on the bottom of the screen (menuBar is a complex element with a three of children for define the inside items). A full documentation of TVML is available on [Apple Developer Site](https://developer.apple.com/library/tvos/documentation/LanguagesUtilities/Conceptual/ATV_Template_Guide/).

Now we are ready to try our simple App, in the native part we used an URL to load app.js, so we need to serve this script using a web server. The simplest way to make this is to use python which is installed by default on Mac OS X. Before running the App from XCode launch the Terminal and go in the folder with app.js, from here type the following command

```
python -m SimpleHTTPServer 9001
```

This command runs a simple web server listening on port 9001 serving files from current folder. Started the web server run the App from XCode the App and it’ll be executed on Apple TV simulator or on the real device if connected to the Mac.

## Conclusion

his article is a simple introduction on how simple can be write Apps for tvOS, make real applications it’s obviously more complicated than this. In a future article I’ll describe how to use NodeJS as backend for a TVMLKit App using a template system to handle dynamic TVML generation.

Source code of the app can be found [here](https://github.com/guglielmino/tvOSSample).
