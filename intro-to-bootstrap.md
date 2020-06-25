# Intro to Bootstrap

In this session we're going to do a quick intro to Bootstrap using
- [Our own wire frame](https://www.fluidui.com/)
- [BootstrapCDN](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
- [Bootstrap Templates](https://getbootstrap.com/docs/4.5/examples/)

## 1. Build a Wireframe

I've already mapped out a wireframe using [Fluid UI](https://www.fluidui.com/editor/live/preview/cF9CNU92TkRDdEJFcm1nQWJJRXZSOUlpTVNhc2JWSHY3Mw==).

Other tools are:
- [InVision](https://www.invisionapp.com/inside-design/how-to-wireframe/)
- [Draw.io](draw.io)
- [Lucid Chart](https://www.lucidchart.com/pages/)
- [Pen and Paper](https://youtu.be/PmmQjLqJQlY)


## 2. "Install Bootstrap" using BootstrapCDN

#### Use the BootstrapCDN

There are [many ways](https://getbootstrap.com/docs/4.5/getting-started/download/) we can "install" Bootstrap but we'll be using BootstrapCDN. This will get us access to Bootstrap components by simply using the `<link>` and `<script>` tags provided by Bootstrap in their [docs](https://getbootstrap.com/docs/4.5/getting-started/introduction/):
```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap-4 CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

    <title>Hello, world!</title>
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
  </body>
</html>
```

**NOTE:** We're using Bootstrap 4 in this walkthrough!

#### Test

Drop a [button](https://getbootstrap.com/docs/4.5/components/buttons/) into your `index.html` file to double check the Bootstrap CSS is being applied properly.

```html
<button type="button" class="btn btn-primary">Primary</button>
```

Once you've confirmed the CSS from Bootstrap is being properly applied then go ahead and start thinking about layout.

## 3. Bootstrap Templates

We're in an exciting place! We now know the Bootstrap CSS is properly being applied to HTML in our `index.html` file. Now we can start diving into layout!

#### Read Documentation

This is where your wireframe comes in handy. Review the [Bootstrap docs on layout](https://getbootstrap.com/docs/4.5/layout/overview/) and become familiar with how to navigate them. Make sure you build a basic level of understanding re: how you can organize your page using their containers, grids, and columns.  Keep your wireframe in mind as you review the documentation on layout.

#### Check Out the Templates

If you're not as interested in building out your layout from scratch, luckily, Bootstrap has some pretty lightweight [templates and frameworks](https://getbootstrap.com/docs/4.5/examples/) to help us get started quickly. Feel free to review these templates and get started with whatever most closely resembles your wireframe. Unfortunately to grab the source code for a particular template you have to download a zip file with all the templates, but feel free to delete the folder once you have the source code you need!

#### Implement the Template

Based on my wireframe, I'm going to go with the ["Album" template](https://getbootstrap.com/docs/4.5/examples/album/). In order to implement this template I'm going to:
1. Rename my current `index.html` file to `draft-index.html`
2. Create a new `index.html` file and copy and paste the HTML from the Bootstrap "Album" template into my newly created `index.html` file.
3. Create an `index.css` file and copy and paste the CSS from the Bootstrap "Album" template into my newly created `index.css` file.
4. Update my tags. In the `index.html` file I'm going to update the CSS `<link>` tag to use the BootstrapCDN CSS link and update my link tag for my custom CSS to connect to the `index.css` file. Lastly, I'm going to update the  JavaScript `<script>` tags to the BootstrapCDN tags and add the `<script>` tags connecting my JS files.

  ```html
  <!-- Bootstrap core CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

  <!-- Custom styles for this template -->
  <link href="index.css" rel="stylesheet">

  <!-- JavaScript Project Files  -->
  <script type="text/javascript" src="src/syllabus.js"></script>
  <script type="text/javascript" src="src/index.js"></script>

  <!-- Optional JavaScript -->
  <!-- jQuery first, then Popper.js, then Bootstrap JS -->
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
  ```

5. Finally I'm going to integrate my own forms, buttons, "cards", etc. that are connected with my JavaScript code.

After this process you'll see some errors in your console because you need to update your new HTML elements with the id's you used for DOM manipulation and event handling in your JS files. Start with these errors first and keeping building until you get to your MVP using Bootstrap. 
