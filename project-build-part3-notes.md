# PART 2 Review

1. Routes
2. Controllers
3. Serializers
4. Follow Up Question:
    - `rails g migration AddCategoryToSyllabus category:belongs_to` will generate the following migration:

    ```ruby
    class AddCategoryToSyllabus < ActiveRecord::Migration
      def change
        add_reference :syllabuses, :category, null: false, foreign_key: true
      end
    end
    ```
    - **[I WAS WRONG](https://youtu.be/sLrFiwhMPZU?t=861):** Because we're using PostGres we need to delete `null: false` so this migration will be successful. Read why [here](https://stackoverflow.com/questions/24298171/pgnotnullviolation-error-null-value-in-column-id-violates-not-null-constra).
    - **SHOUT OUT TO WILLIAM:** WE _DO NOT_ need to delete `null: false` in this migration. But we do need to delete the syllabi seed data in the `rails console` before running the migration using: `Syllabus.all.each{|s| s.destroy}`

    ```md
    "I ran into the same issue when I had to a foreign key to one of my tables. It happens because we already seeded the database with records in the table which we are trying to add the foreign key to. As a result, when we run the migration, the database can't add the column because by default those records would then have `null` values for the foreign key. **I think it is important that a foreign key reference always be non-null to ensure the integrity of the database.** As a result, the "fix" I used (since I didn't want to just drop my database) was just to go into the Rails console and run `Word.all.each{|w| w.destroy}` to drop all of the words that would have had a `null` foreign key reference to the author model. After that, the migration ran and I was able to keep the null false check in PostgreSQL."

    — William Barela
    ```

# PART 3

## Rails vs JS (Backend vs. Frontend)

Coming from the Rails Section, you may be used to a framework such as Ruby on Rails being very _opinionated_. That is, it has a lot of opinions about how your application should be structured. The same rules don't apply on the frontend, _there is not one right way to structure your code_. Specifically, we are not using any frontend framework and many of the design decisions will be left up to you.

In PART 3 of this project build, we'll walk through getting and creating data and provide some example code. The example code will demonstrate a reasonable/sensible way to structure this application. You should learn what you can from it and structure your code in a similar pattern.

The key word here is _similar_, rather than directly copying the patterns shown, try to apply the principles you have learned (oo, single responsibility principle, encapsulation) to make code that will be easy for you as your application grows.

**Source: _[JavaScript Rails API Project Setup](https://github.com/learn-co-curriculum/mod3-project-week-setup-example#code-along)_**

## Initial Set Up

Make sure you create **a separate directory and a separate GitHub repository for the frontend.**

**Tip:** you can open up a new tab in terminal `command + t` if you'd like to have your rails server up and running in another tab.

Create a new folder for the frontend: `mkdir notes_frontend && cd $_`
(The `cd $_` command will move you into the folder you've just created)

In the new folder you create you should `touch index.html` and `mkdir src` in which you will add your JavaScript files. At minimum you should have a file called `index.js` inside of the `src` folder.

In `index.html`, you need to add some HTML. Text editors will often have a shortcut for creating a blank HTML document. In Atom you can begin typing "html" and then press tab to auto-generate the starter HTML.

### Setup Frontend Files

The first step is getting the list of notes to show up on the page. Translating that to more technical language, we need to:

1 - Fire off an AJAX fetch request to the index route (i.e GET '/syllabuses')

2 - Use the response JSON to append elements to the DOM.

Let's be sure not to overcomplicate our approach, we can (and will) refactor later. At the same time, we don't want to be debugging the routes in our Rails application trying to figure why our server isn't responding when it turns out we forgot to include a script tag linking `src/index.js` in `index.html`. Speaking of which, don't forget to add `<script src="src/index.js" charset="utf-8"></script>` to the head of your `index.html`

This may sound silly but step 1 should be:

```javascript
/* src/index.js */
document.addEventListener('DOMContentLoaded', () => {
  alert('LOADED');
});
```

Until you see the alert, don't move forward. What would be some reasons you might not see the alert? You can also `console.log("in index.js")` in `index.js` file.

### A Note on CORS

**Before we make our first fetch request, we need to talk about something called Cross Origin Resource Sharing (CORS)**:

- Basically, CORS is a security feature that prevents API calls from unknown origins. For example, if someone tried to use some malicious JavaScript to steal your bank information and your bank allowed API calls from anywhere, this could be a bad news bears™️ situation.
- Let's say your bank is hosted on `https://bankofamerica.com` but a clever hacker tried to impersonate you and send a request with an _origin_ of `https://couponvirus.org`. Ideally, your bank would reject requests from unknown _origins_ such as `couponvirus.org` and only allow requests from trusted origins or domains like `bankofamerica.com`

1. Navigate to your backend, in your Gemfile uncomment `gem 'rack-cors'` This will allow us to setup Cross Origin Resource Sharing (CORS) in our API.
2. Run `bundle`.
3. Inside of `config/initializers/cors.rb` uncomment the following code:

  ```ruby
  Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins '*'

      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head]
    end
  end
  ```

(This snippet is from the [documentation for the rack-cors gem](https://github.com/cyu/rack-cors).)

Inside the `allow` block, `origins '*'` means we are allowing requests from **all** origins and are allowing `[:get, :post, :patch, :delete]` requests to the API. Read [this](https://www.w3schools.com/tags/ref_httpmethods.asp) if you need a refresher on HTTP methods.

This may come as a shock but the `config.api_only = true` option found in `config/application.rb` tells our app that it is going to be an **API only**. In other words, our API **will not generate any HTML** and instead will return JSON. The frontend is responsible for taking that JSON, formatting the data, and generating HTML to show to the user. Read [this](https://www.w3schools.com/js/js_json_intro.asp) if you want to review what JSON is and why we use it.

For now, we will leave the origins open. Later on, we can change this to only allow requests from the address of the frontend repo––localhost:8000 or `www.myapp.com` for example.

Now let's fetch the syllabi (from our Rails API index route, Ex: 'http://localhost:3000/api/v1/syllabuses')

## GET Request

### Fetch JSON

Let's save ourselves trouble in the future and add this to the top of our `index.js`

`const endPoint = <YOUR_ENDPOINT>`

---

```javascript
/* index.js */
const endPoint = "http://localhost:3000/api/v1/syllabuses";

document.addEventListener('DOMContentLoaded', () => {
  getSyllabi()
});

function getSyllabi() {
  fetch(endPoint)
    .then(res => res.json())
    .then(json => console.log(json));
}
```

If you see the notes printed to the console, you're good to move forward.

### Render JSON

The next step is getting the syllabi added to the DOM. No problem, add an empty `<div>` or `<ul>` element to `index.html` and go ahead and add each syllabus title, along with an edit button. We'll give the button a `data-id` in case we want to implement edit functionality in the future.

```javascript
/* src/index.js */
document.addEventListener('DOMContentLoaded', () => {
  const endPoint = "http://localhost:3000/api/v1/notes"
  getSyllabi()
})


function getSyllabi() {
  fetch(endPoint)
    .then(res => res.json())
    .then(syllabi => {
      // remember our JSON data is a bit nested due to our serializer
      syllabi.data.forEach(syllabus => {
        // double check how your data is nested in the console so you can successfully access the attributes of each individual object
        const syllabusMarkup = `
          <div data-id=${syllabus.id}>
            <img src=${syllabus.attributes.image_url} height="200" width="250">
            <h3>${syllabus.attributes.title}</h3>
            <p>${syllabus.attributes.category.name}</p>
            <button data-id=${syllabus.id}>edit</button>
          </div>
          <br><br>`;

          document.querySelector('#syllabus-container').innerHTML += syllabusMarkup
      })
    })
}
```

There are many ways to do this. The above snippet is not super pretty, but it works.

**Source: _[JavaScript Rails API Project Setup](https://github.com/learn-co-curriculum/mod3-project-week-setup-example#code-along)_**

## POST Request

Now that we've made a GET request we're familiar with how to GET data from the server but what about SENDING data to the server? Let's walk through it!

The key differences are in order to POST data to the server, you might need to get some input from the user. To collect this we're going to use a HTML form.

```html
<div class="form-container">

  <form id="create-syllabus-form" style="">
    <h3>Create a Syllabus!</h3>

    <input id='input-title' type="text" name="title" value="" placeholder="Enter your syllabus name..." class="input-text">
    <br><br>
    <textarea id='input-description' name="description" rows="8" cols="80" value="" placeholder="Enter your syllabus description..."></textarea>
    <br><br>
    <input id='input-url' type="text" name="image" value="" placeholder="Enter your syllabus image URL..." class="input-text">
    <br><br>

    <select id="categories" name="categories">
      <option value="1">Art</option>
      <option value="2">Tech</option>
      <option value="3">Science</option>
    </select>
    <br><br>

    <input id= 'create-button' type="submit" name="submit" value="Create New Syllabus" class="submit">
  </form>

</div>
```

We'll use this form to allow a visitor to the site to create a syllabus using our app.

### Submit Event

In the DOMContentLoaded event listener we can find the form on the DOM and attach a submit event listener to the form element.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  getSyllabi()

  let createSyllabusForm = document.querySelector('#create-syllabus-form')

  createSyllabusForm.addEventListener('submit', (e) => createFormHandler(e))
});
```
### Form Handler

Gather all the input values and pass it to your function to execute the post fetch.

```javaScript
function createFormHandler(e) {
  e.preventDefault()
  const titleInput = document.querySelector('#input-title').value
  const descriptionInput = document.querySelector('#input-description').value
  const imageInput = document.querySelector('#input-url').value
  const categoryInput = document.querySelector('#categories').value
  const categoryId = parseInt(categoryInput)
  postSyllabus(titleInput, descriptionInput, imageInput, categoryInput)
}
```

### POST fetch request

```javascript
function postSyllabus(title, description, image_url, category_id) {
  // confirm these values are coming through properly
  console.log(title, description, image_url, category_id);
  // build body object
  let bodyData = {title, description, image_url, category_id}

  fetch(endPoint, {
    // POST request
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bodyData)
  })
  .then(response => response.json())
  .then(syllabus => {
    console.log(syllabus);
    const syllabusData = syllabus.data
    // render JSON response
    const syllabusMarkup = `
    <div data-id=${syllabus.id}>
      <img src=${syllabusData.attributes.image_url} height="200" width="250">
      <h3>${syllabusData.attributes.title}</h3>
      <p>${syllabusData.attributes.category.name}</p>
      <button data-id=${syllabusData.id}>edit</button>
    </div>
    <br><br>`;

    document.querySelector('#syllabus-container').innerHTML += syllabusMarkup;
  })
}
```

### Render Created Data

Refactor your code to make it more DRY and implement a render function you can reuse in multiple places.

```javascript
function render(syllabus) {
  const syllabusMarkup = `
          <div data-id=${syllabus.id}>
            <img src=${syllabus.attributes.image_url} height="200" width="250">
            <h3>${syllabus.attributes.title}</h3>
            <p>${syllabus.attributes.category.name}</p>
            <button data-id=${syllabus.id}>edit</button>
          </div>
          <br><br>`;

  document.querySelector('#syllabus-container').innerHTML += syllabusMarkup;
}
```


### PART 4 Notes
1. Implement `.catch()` in fetch requests to handle errors.
