const endPoint = "http://localhost:3000/api/v1/syllabuses"

document.addEventListener('DOMContentLoaded', () => {
  // fetch and load syllabi
  console.log("DOM is Loaded");
  getSyllabi()

  // event listner and handler for create syllabus form
  const createSyllabusForm = document.querySelector("#create-syllabus-form")
  createSyllabusForm.addEventListener("submit", (e) => createFormHandler(e))
})

function getSyllabi() {
  fetch(endPoint)
  .then(response => response.json())
  .then(syllabi => {
    syllabi.data.forEach(syllabus => {
      // double check how your data is nested in the console so you can successfully access the attributes of each individual object
      // debugger
      let newSyllabus = new Syllabus(syllabus, syllabus.attributes)

      document.querySelector('#syllabus-container').innerHTML += newSyllabus.renderSyllabusCard()
    })
  })
}

function createFormHandler(e) {
  e.preventDefault()
  const titleInput = document.querySelector('#input-title').value
  const descriptionInput = document.querySelector('#input-description').value
  const imageInput = document.querySelector('#input-url').value
  const categoryId = parseInt(document.querySelector('#categories').value)
  postFetch(titleInput, descriptionInput, imageInput, categoryId)
}

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
    console.log(syllabus);
    const syllabusData = syllabus.data
    // render JSON response
    let newSyllabus = new Syllabus(syllabusData, syllabusData.attributes)
    document.querySelector('#syllabus-container').innerHTML += newSyllabus.renderSyllabusCard()
  })

}
