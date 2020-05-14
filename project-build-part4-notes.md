# PART 3 Review

1. Events
2. Fetch (`GET` and `POST`)
3. Implement `.catch()`

```javascript
function getSyllabi() {
  fetch(endPoint)
    .then(res => res.json())
    .then(json => console.log(json));
    .catch(err => console.log(err);)
}
```

4. DOM Manipulation
5. Render refactor

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

# PART 4 — OOJS Refactor

## Refactor Render Using Syllabus Class

If our _only deliverable_ was to show text on the page, our code would be sufficient. There's a real deficiency with our current implementation though.

Think about the next step where a user clicks one of the edit buttons. **Without storing ids in the html elements** how could we

**a)** determine which syllabus got clicked on and

**b)** show more information about that syllabus (the content of the syllabus)?

Please take a moment to think this through and make sure you understand the following before moving forward.

---

The only way to solve this problem would be to grab the text of the h3 element from the DOM, use that title to query our backend and do something in our Rails controller along the lines of...

```ruby
@syllabus = Syllabus.find_by(title: params[:title])
```

This would feel really annoying. We _just_ had access to this data when we retrieved all the syllabi, but we effectively threw it away.

**This is where we can refactor to use Object Orientation.** We can take advantage of the encapsulation provided by objects to store _all_ the data about a particular syllabus in one place.

If we **weren't** storing an `id` on the button, a second annoyance we might notice about our current implementation is that when the edit button is clicked, nothing on the button itself indicates what syllabus the button is for. We would have to look at the text of it's parent h3 element. We've solved this by adding data-attributes on the parent `<div>` and `<button>`.

### Create Syllabus Class and Render Function

```javascript
/* create a file src/syllabus.js and link to it from your index.html */
class Syllabus {
  constructor(id, syllabusAttributes) {
    this.id = id;
    this.title = syllabusAttributes.title;
    this.description = syllabusAttributes.description;
    this.image_url = syllabusAttributes.image_url;
    this.category = syllabusAttributes.category;
    Syllabus.all.push(this);
  }

  renderSyllabusCard() {
    return `
            <div data-id=${this.id}>
              <img src=${this.image_url} height="200" width="250">
              <h3>${this.title}</h3>
              <p>${this.category.name}</p>
              <button data-id=${this.id}>edit</button>
            </div>
            <br><br>`;
  }
}

Syllabus.all = [];
```

**Note:** if you are not familiar with html5 data-attributes [check them out](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).
We totalllyyyy could have taken the id of the syllabus and added it to the DOM in the button's id or class properties. However, **html ids and classes are typically used for css, not to store data**.

But this is exactly what data-attributes are for and should make our lives easier. The important takeaway here is that the data our application logic depends on **lives in the DOM itself and we must put it there somehow.** _Understanding that is more important than how exactly we put that data there._

### Refactor GET

```javascript
/* src/index.js */
function getSyllabi() {
  fetch(endPoint)
  .then(response => response.json())
  .then(syllabi => {
    syllabi.data.forEach(syllabus => {
      // create a new instance of the Syllabus class for every syllabus in the array from the DB (remember how our data is nested)
      const newSyllabus = new Syllabus(syllabus.id, syllabus.attributes)

      // call renderSyllabusCard() located in Syllabus class
      document.querySelector('#syllabus-container').innerHTML += newSyllabus.renderSyllabusCard();
    })
  })
}
```

### Refactor POST

```javascript
function postFetch(title, description, image_url, category_id) {
  // build my body object outside of my fetch
  const bodyData = {title, description, image_url, category_id}

  fetch(endPoint, {
    // POST request
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bodyData)
  })
  .then(response => response.json())
  .then(syllabus => {

    const newSyllabus = new Syllabus(syllabus.data.id, syllabus.data.attributes)

    // call renderSyllabusCard() located in Syllabus class
    document.querySelector('#syllabus-container').innerHTML += newSyllabus.renderSyllabusCard();
  })
}
```

## Creating a Static Method for "Find" Utility


```javascript
/* src/syllabus.js */
class Syllabus {
  // ... previous code

  static findById(id) {
    return this.all.find(syllabus => syllabus.id === id);
  }
}
```

From [learn.co](https://learn.co/tracks/full-stack-web-development-v8/module-14-front-end-web-programming-in-javascript/section-10-object-orientation-in-javascript/oojs-static-methods-lab):

[Static methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Static_methods) are useful ways to create _utility methods_ for your data. If you have operation that you need do perform on a **batch of data** (say, find a particular syllabus in an array, as above), `static` methods are your go-to tool. Since **they are called on the class but don't have access to individual objects**, they are somewhat limited in their scope, but can be very powerful in the correct application.

## Clicking the 'edit' button & showing a form

Our code above was a true refactoring: we didn't change any functionality, we only changed (and hopefully improved) the implementation details.

Now let's add the ability to click an edit button and show a filled out form. As always, when dealing with handling events we'll want to break this down into a couple steps.

1. Can we respond to the event at all? First let's just `console.log` or `alert` something on a click.

2. Can we then `console.log` some data specific to the event. We'll try to `console.log` the whole syllabus object we're trying to edit.

3. Only after all that is wired up will we attempt to show a form with the correct values.

The first step, though straightforward, involves some decision making--where should the code that attaches the event listener go?

**There is no right answer here.** An argument could be made that it is the responsibility of the Syllabus class, something like `Syllabus.addEditListeners()`. The choice we will go with is to attach the event listeners in `index.js` which will continue to act as the "parent" of the Syllabus class. As the application scales and more classes are created, we could make a class called `App` that will be responsible for higher level things like attaching event listeners. **Currently we only have one class, so attaching event listeners in `index.js` will do.**

```javascript
/* src/index.js */
document.addEventListener('DOMContentLoaded', () => {
  // fetch and load syllabi
  getSyllabi()
  // listen for 'submit' event on form and handle data
  const createSyllabusForm = document.querySelector("#create-syllabus-form")
  createSyllabusForm.addEventListener("submit", (e) => createFormHandler(e))
  // listen for 'click' event on syllabus container
  const syllabusContainer = document.querySelector('#syllabus-container')
  syllabusContainer.addEventListener('click', e => {
    console.log('clicked');
  });
})
```

_**Note**: we won't go into [event delegation](https://learn.jquery.com/events/event-delegation/) in detail here, but because the edit buttons are dynamically added to the page we cannot put the event listeners on them directly. We have to put the listener on a static element, i.e. the parent `<div>`, and delegate the listening down to the children_

If you see 'clicked' in the console move on to the next step.

---

You are very much encouraged to try to get the next step working on your own. You need to

**a)** grab the `data-id` of the clicked button out of the DOM and

**b)** find the associated syllabus instance. Try it on your own. Below is an implementation that works.

```javascript
/* src/app.js */
document.addEventListener('DOMContentLoaded', () => {
  // ... previous code

  const syllabusContainer = document.querySelector('#syllabus-container')
  syllabusContainer.addEventListener('click', e => {
    const id = parseInt(e.target.dataset.id);
    const syllabus = Syllabus.findById(id);
    console.log(syllabus);
  });
})
```

Once we have the syllabus instance the next step is pretty easy. Just as we can call a prototype method `syllabus.renderListItem` on a syllabus instance we'll make a prototype method `syllabus.renderUpdateForm` and attach HTML to the DOM. **This is like telling a syllabus object: 'use your state (all the information about this syllabus) to create an update form for it'.**

Create the HTML for your edit form:

```javascript
/* src/syllabus.js */
class Syllabus {
  // ... prev code

  renderUpdateForm() {
    return `
    <form data-id=${this.id} >
      <h3>Edit a Syllabus!</h3>

      <label>Title</label>
      <input id='input-title' type="text" name="title" value="${this.title}" class="input-text">
      <br><br>

      <label>Description</label>
      <textarea id='input-description' name="description" rows="8" cols="80" value="">${this.description}</textarea>
      <br><br>

      <label>Image URL</label>
      <input id='input-url' type="text" name="image" value="${this.image_url}" class="input-text">
      <br><br>

      <label>Category</label>
      <select id="categories" name="categories" value="${this.category.name}">
        <option value="1">Art</option>
        <option value="2">Tech</option>
        <option value="3">Science</option>
      </select>
      <br><br>

      <input id='edit-button' type="submit" name="submit" value="Edit Syllabus" class="submit">
    </form>
  `;
  }
}
```

Add a div for the form to render in `index.html`:

```html
<div id="update-syllabus">

</div>

```

Render the edit form when the edit button is clicked:
```javascript
/* src/index.js */
document.addEventListener('DOMContentLoaded', () => {
  // ... previous code

  const syllabusContainer = document.querySelector('#syllabus-container')
  syllabusContainer.addEventListener('click', e => {
    const id = parseInt(e.target.dataset.id);
    const syllabus = Syllabus.findById(id);
    document.querySelector('#update-syllabus').innerHTML = syllabus.renderUpdateForm();
  });
})
```

## Making the PATCH request

When the form is submitted we need to make a PATCH request to our server to update this syllabus record in our database. Like before, we will start with a straightforward approach and refactor.

It seems like we already have a place in our app where we attach event listeners. Let's add our code there. I will skip a few steps here and go straight to the implementation. When you are trying to grab data from the DOM in your own projects try things like

`const title = e.target.querySelector('input').value;`

Open up the console, use a debugger, and play around

### Listen for the Event

```javascript
/* src/index.js */
document.addEventListener('DOMContentLoaded', () => {
  // ... previous code

  // render edit form once button is clicked
  const syllabusContainer = document.querySelector('#syllabus-container')
  syllabusContainer.addEventListener('click', e => {
    const id = parseInt(e.target.dataset.id);
    const syllabus = Syllabus.findById(id);
    document.querySelector('#update-syllabus').innerHTML = syllabus.renderUpdateForm();
  });

  // listen for the submit event of the edit form and handle the data
  document.querySelector('#update-syllsbus').addEventListener('submit', e => updateFormHandler(e))
})
```

### Handle the Data from the Event

```javascript
function updateFormHandler(e) {
  e.preventDefault();
  const id = parseInt(e.target.dataset.id);
  const syllabus = Syllabus.findById(id);
  const title = e.target.querySelector('#input-title').value;
  const description = e.target.querySelector('#input-description').value;
  const image_url = e.target.querySelector('#input-url').value;
  const category_id = parseInt(e.target.querySelector('#categories').value);
  patchSyllabus(syllabus, title, description, image_url, category_id)
}
```

### Send the PATCH Request to the Backend

```javascript
function patchSyllabus(syllabus, title, description, image_url, category_id) {
  const bodyJSON = { title, description, image_url, category_id }
  fetch(`http://localhost:3000/api/v1/syllabuses/${syllabus.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(bodyJSON),
  })
    .then(res => res.json())
    // our backend responds with the updated syllabus instance represented as JSON
    .then(updatedNote => console.log(updatedNote));
});
}

```

**Note:** If you are not familiar with what is going on in the line `const bodyJSON = { title, description, image_url, category_id }`, look into [ES6 Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

**Source: _[JavaScript Rails API Project Setup](https://github.com/learn-co-curriculum/mod3-project-week-setup-example#code-along)_**
