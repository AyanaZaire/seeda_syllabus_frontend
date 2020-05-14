# JS/Rails Order of Operations Guide (FRONTEND)

The JavaScript Project repo has a handful of helpful [READMEs](https://github.com/learn-co-students/js-spa-project-instructions-online-web-sp-000) that outline the requirements for the JS/Rails Project along with project planning tips and a note about what to expect during your review. There is also this [JavaScript Rails API Project Setup README](https://github.com/learn-co-curriculum/mod3-project-week-setup-example) that provides a thorough step by step walkthrough to get your project up and running along with some help OOJS refactoring tips. Lastly, we also wanted to outline a suggested flow of execution to aide you in building your project. We put together this "Order of Operations Guide" for organizing and completing your JS/Rails Project. This guide is based on the 4-part project build. All study groups can be found [here](https://learn.co/study-groups).

The application we will create during the project build series is a "Syllabus Sharing App" for independent study.

 **USER STORY: A user should be able to read and create syllabi based on category**

## Checklist

### PART 1: Planning and Building a Rails API

**BEFORE YOU CODE**
- [x] 1. Check project requirements in [JavaScript READMEs](https://github.com/learn-co-students/js-spa-project-instructions-online-web-sp-000)
- [x] 2. Ideate! What do you want to build?
    - choose a domain you're familiar with!
    - choose a domain you care about
- [x] 3. Wireframing & User Stories
    - Write down your models, their attributes, and their associations
    - "As a user, I can ....."
    - "A user should be able to ....."
    - What does your app _do_?
- [x] 4. Design your MVP = 'Minimum Viable Product' vs. what are my 'stretch goals'
    - Stretch goals - bonus features you want but don't need

**NOW WE'RE READY FOR PROJECT SET UP**

- [x] 5. Generate new [Rails API](https://edgeguides.rubyonrails.org/api_app.html) using `rails new <my_app_name> --database=postgresql --api`
    - (Replace `<my_app_name>` with the actual name of your project)
- [x] 6. Create github repo
- [x] 7. Create a new branch for building out models `git co -b <branch_name>`. This way you can always go back to the fresh API.
    - **NOTE**: It is best practice to always create a new branch when working on a new feature/edit to your code. Your master branch should only have working code. Debug in a branch, not in master.

**NOW WE'RE READY TO CODE (BUT JUST OUR MODELS — NO CONTROLLERS OR SERIALIZERS YET)**

**NOTE**: Remember to _**VERTICALLY**_ build your MVP! This means building out one model/feature at a time. DO NOT build out _all_ the models and controllers at the same time. This is the easiest way to get lost in your project very early. Read more about this [here](https://github.com/learn-co-students/js-spa-project-instructions-online-web-sp-000/blob/master/project-planning-tips.md#build-vertically-not-horizontallys).

- [x] 8. Build your models: `rails g model <your_model_name> name` (Make sure you capitalize the first letter of the model name!)
    - Migrations
    - Model classes
    - Associations
- [x] 9. Test your models and associations in the console
    - Create some seed data
    - Adjust migrations as needed


### PART 2: Routes, Controllers, Serializers

- [x] 1. Routes
    - Implement _specific_ namespaced routes for _a_ controller **for MVP**
    - REMEMBER! We're _trying_ to build vertically.

      ```ruby
      Rails.application.routes.draw do
        namespace :api do
          namespace :v1 do
            resources :syllabuses, only: [:index, :create]
          end
        end
      end
      ```
    - Run `rails routes` to confirm routes
    - Visit `http://localhost:3000/api/v1/<your_resource_name>` to see error


- [x] 2. Controllers
    - In your console run: `rails g controller api/v1/<your controller_name>` (Make sure you capitalize and the first letter of the controller name!)
    - Build relevant routes for MVP (ex: `index` and `create`)
    - Visit `http://localhost:3000/api/v1/<your_resource_name>` to see JSON data

- [x] 3. Fast JSON API Serializer
    - Add `gem 'fast_jsonapi'` to your Rails project's Gemfile and run `bundle install`
    - Create Serializer classes
      - `rails g serializer <your_resource_name>`
      - `rails g serializer <your_resource_name>`
    - Update Controller Actions
        ```ruby
        class Api::V1::SyllabusesController < ApplicationController
          def index
            @syllabuses = Syllabus.all
            # render json: @syllabuses
            render json: SyllabusSerializer.new(@syllabuses)
          end
        end
        ```
    - Adding Attributes
        ```ruby
        class SyllabusSerializer
          include FastJsonapi::ObjectSerializer
          attributes :title, :description, :image_url, :category_id
        end
        ```
    - Accessing Associations (Related Objects)
        ```ruby
        class SyllabusSerializer
          include FastJsonapi::ObjectSerializer
          attributes :title, :description, :image_url, :category_id, :category
        end
        ```
    - Adding Relationships
        - To control the attributes displayed in the association view PART 2 notes on adding relationships


- [x] 4. **TEST:** Confirm data at your Rails endpoints! (ex: `http://seeda.com/api/v1/syllabuses`)
- [ ] 5. Build out your associated models using this same process. **REMEMBER: Focus on building vertically for MVP** this means only starting with 2 or 3 models before moving on to the frontend.


### PART 3: DOM Manipulation, Events, and Fetch using Rails API

- **JS MANTRA:** When _some event_ happens, I want to make _what kind of_ fetch and then manipulate the DOM _in what way_?

- Quick note on frontend JS project design can be found in PART 3 notes.

**Initial Setup**

- [x] 1. Create separate directory for frontend
- [x] 2. Create `index.html` file with script tag connecting your `index.js`. Ex: `<script type="text/javascript" src="index.js"></script>`
- [x] 3. Create `index.js`, `console.log("in index.js")`, and check for the logged message in your dev tools to confirm the `index.html` <> `index.js` connection was established.
- [x] 4. Initialize a `git` repo for frontend repository.

**Connect your API to your frontend!**

- [x] 5. Think about the **JS mantra** and answer this question: When the _DOM Content is Loaded_, I want to make a  _GET_ fetch and then manipulate the DOM _in what way_ (usually render the data)?
- [x] 6. Create `DOMContentLoaded` event listener and `console.log("loaded")` as the event handler to confirm we've properly set up the listener.
- [x] 7. We're eventually going to make a call to the `index` route of our API (ex: `localhost:3000/api/v1/syllabuses`). Run your `rails server` and visit that end point in the browser to confirm the expected JSON data is present.
- [x] 8. We can see the JSON data in the browser but in order to access it in our frontend, we'll need to setup Cross Origin Resource Sharing (CORS). In order to do this we'll need to do a couple things:
    - Navigate to your Gemfile and uncomment `gem 'rack-cors'` then `bundle install`. You can read more about CORS in the PART 3 notes and [here](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
    - Inside of `config/initializers/cors.rb` uncomment the CORS code and update `origins 'example.com'` to `origins '*'`
- [x] 9. Commit and push this code!

**Receive (GET) data _from_ the server**

- [x] 10. `GET` request
    - Create a new branch for `GET` implementation.
    - Create your `get____` function (ex: `function getToys()`) that will make a call to your `index` endPoint in your API, make your `GET` request inside the function and `console.log` the json data, then call your `get___` function in the `DOMContentLoaded` event listener.
    - Once you have confirmed your `GET` request is returning the `JSON` you were expecting, use that data to update the `DOM`.(see PART 3 notes for example)
    - Once working: Commit and push this code! Then merge branch to master.

**Submit (POST) data _to_ the server**

- [x] 11. `POST` request
    - Create a new branch for `POST` implementation.
    - Create form
    - Create submit event listener
    - Create submit event handler to handle form data
    - Create `post_____` function
    - Manipulate the DOM with "posted" JSON data
    - Once working: Commit and push this code! Then merge branch to master.
- [ ] 12. `git pull` on the master branch to get working `GET` and `POST` functionality.

**Refactor to make your code more DRY**

- [ ] 13. Make sure you're not repeating yourself unnecessarily in your code. Ex: Create a render function you can use in both your "read" and "create" functions.
- [ ] 14.  Build out any additional features using the JS Mantra: Event, Fetch, and DOM Manipulation flow as a guide.

### PART 4: OOJS Refactor
- [ ] 1. _IMPORTANT:_ Create a separate branch for your OOJS Refactor
- [ ] 2. Create a JS Class (ex: `class Syllabus`)
- [ ] 3. Link to the new JS file in your `index.html` (ex: `<script type="text/javascript" src="src/syllabus.js"></script>`)
- [ ] 3. Create a constructor that pushes all instances of `this` into an empty array (See part 4 notes for example)
- [ ] 4. Refactor render functionality by creating a render function in your JS class
- [ ] 5. For future use, create a static method in your JS class that finds an object based on it's id. (In the PART 4 notes we see how this would be useful for 'update/`PATCH`' functionality)

### Bonus
- [ ] Leverage a CSS framework to improve the styling of your application
  - Easiest to implement: [Bulma](https://bulma.io/)
  - Most popular: [Bootstrap](https://getbootstrap.com/)
  - Also good: [Semantic UI](https://semantic-ui.com/)
  - Not bootstrap: [Materialize](https://materializecss.com/)

### Confirm
- [ ] You have a large number of small Git commits
- [ ] Your commit messages are meaningful
- [ ] You made the changes in a commit that relate to the commit message
- [ ] You don't include changes in a commit that aren't related to the commit message
