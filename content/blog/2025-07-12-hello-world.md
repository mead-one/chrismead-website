---
title: "Hello, World!"
brief: "A test post"
description: "The first post on this new blog section of my website, introducing myself and my new Hugo-powered blog."
layout: "post"
id: "hello-world"
images: [ ]
date: 2025-07-12
tags: [ "hugo", "typescript", "web-dev", "golang" ]
---

Welcome to the new blog section of my website! This is a test post to see if everything is working as expected.

## Hugo

I'm using [Hugo](https://gohugo.io/) to generate the site, and I'm very happy with the results so far. It offers many of the features I've come to expect from a back-end framework, such as:

- Highly flexible templates, massively cutting down on duplicated code and its maintenance
- Built-in support for [Markdown](https://en.wikipedia.org/wiki/Markdown), which I'm using to write this blog post, allowing:
    - Extensive formatting and styling options without having to write a lot of HTML
        - Easy **bold**, _italic_, _**bold and italic**_, ~~strikethrough~~, and `inline code`
        - Nested ordered and unordered lists
    - Full code highlighting
    - Easy embedding of images ![Logo](/img/blog/2025-07-11-hello-world/00-logo.png)
    - Easy embedding of videos
- Highly configurable behaviour, defined in the [Go programming language](https://go.dev/)
    - Generation of custom navigation menus
    - Paginated navigation menus for sections containing multiple pages that are updated regularly, such as my [Projects](/projects) section and this blog
    - Customised taxonomies, such as the [Tags](/tags) section, for grouping posts by topic

These benefits come without the drawbacks of running a separate back-end, as the static content is generated at compile-time, meaning the web server only needs to serve static files with no extra processing required once it's on the server.

Test of inline code formatting: `const message: string = "Hello, World!";`

Test of _Go_ code highlighting:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    fmt.Println("Really, really, really, really, really, really, really, really, really long line to test overflow and scrolling.")
}
```

## TypeScript and Vite

Although I strongly believe that web content should be freely accessible without having to run JavaScript code wherever possible, and have built this website with that ethos in mind, I'm also using [TypeScript](https://www.typescriptlang.org/) to make small, optional enhancements throughout the website. I'm also using it to power my interactive demos in the [Projects](/projects/) section of my website, such as my [brick arch drawing tool](projects/brick-arch/).

I'm using [Vite](https://vitejs.dev/) to bundle the TypeScript code into a single JavaScript file, which is then included in the HTML of the page, giving me the freedom to split the code into logically organised files for readability and maintainability.

## Going forward

Regularly creating written content like blog posts is a whole new world to me, so expect to see my writing skills and the way I organise my content improve over time as I write about my projects, learnings, and interests on this blog. I expect I'll also need to tweak things as the volume of content grows to ensure smooth navigation around the website.

Stick around if you want to see more of my work, or if you're interested in my thoughts on software development, AI, &amp; robotics by subscribing to the RSS feed of the [blog](/blog/index.xml) or [projects](/blog/index.xml) sections, or connecting with me on [LinkedIn](https://www.linkedin.com/in/christopher-mead-4765bb182).
